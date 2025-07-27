"use client";

import { useQuestionContext } from "@/contexts/QuestionContext";
import { useEffect, useState } from "react";
import { QuestionSlide } from "../../../../components/slides/questionSlide";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SummarySlide } from "@/components/slides/summarySlide";
import { TitleSlide } from "@/components/slides/titleSlide";
import { useSearchParams } from "next/navigation";

enum PageState {
  Title,
  Question,
  Summary,
}

export default function CategoryPage() {
  const router = useRouter();
  const { index } = useParams();
  const parsedIndex = parseInt(typeof index === "string" ? index : "0", 10);

  const searchParams = useSearchParams();
  const showAnswers = searchParams?.get("answers") === "true";

  const [pageState, setPageState] = useState<PageState>(PageState.Title);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const { getCategory, categories, isLoading, setNextCategoryIndex } =
    useQuestionContext();

  function goHome() {
    if (!showAnswers) {
      if (pageState === PageState.Summary) {
        setNextCategoryIndex(parsedIndex + 1);
      } else {
        setNextCategoryIndex(parsedIndex);
      }
    }
    router.push("../../");
  }

  function incrementState() {
    switch (pageState) {
      case PageState.Title:
        setPageState(PageState.Question);
        setCurrentQuestion(0);
        break;

      case PageState.Question:
        const questionCount = questions.length;
        if (currentQuestion < questionCount - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          if (!showAnswers) {
            setPageState(PageState.Summary);
          } else {
            goHome();
          }
        }
        break;

      case PageState.Summary:
        goHome();
        break;
    }
  }

  function decrementState() {
    switch (pageState) {
      case PageState.Question:
        if (currentQuestion > 0) {
          setCurrentQuestion((prev) => prev - 1);
        } else {
          setPageState(PageState.Title);
        }
        break;

      case PageState.Summary:
        setPageState(PageState.Question);
        setCurrentQuestion(questions.length - 1);
        break;

      case PageState.Title:
        goHome();
        break;
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        incrementState();
      } else if (e.key === "ArrowLeft") {
        decrementState();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, categories, parsedIndex, currentQuestion, pageState]);

  if (isLoading || categories.length <= parsedIndex) {
    return <p>Loading category...</p>;
  }

  const { category, questions } = getCategory(parsedIndex);

  return (
    <div>
      {pageState === PageState.Title && (
        <TitleSlide
          category={category}
          questions={questions}
          showAnswers={showAnswers}
        />
      )}
      {pageState === PageState.Question && (
        <QuestionSlide
          category={category}
          question={questions[currentQuestion]}
          showAnswers={showAnswers}
        />
      )}
      {pageState === PageState.Summary && (
        <SummarySlide category={category} questions={questions} />
      )}
    </div>
  );
}
