"use client";

import { useQuestionContext } from "@/contexts/QuestionContext";
import { useEffect, useState } from "react";
import { QuestionSlide } from "../../../../components/slides/questionSlide";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SummarySlide } from "@/components/slides/summarySlide";
import { Title } from "@radix-ui/themes/components/alert-dialog";
import { TitleSlide } from "@/components/slides/titleSlide";

enum PageState {
  Title,
  Question,
  Summary,
}

export default function CategoryPage() {
  const router = useRouter();
  const { index } = useParams();
  const parsedIndex = parseInt(typeof index === "string" ? index : "0", 10);

  const [pageState, setPageState] = useState<PageState>(PageState.Title);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const { getCategory, categories, isLoading } = useQuestionContext();

  function incrementState() {
    console.log("Incrementing state", pageState, currentQuestion);
    switch (pageState) {
      case PageState.Title:
        setPageState(PageState.Question);
        setCurrentQuestion(0);
        break;

      case PageState.Question:
        const questionCount = questions.length;
        console.log(
          `Current question: ${currentQuestion}, Total questions: ${questionCount}`
        );
        if (currentQuestion < questionCount - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setPageState(PageState.Summary);
        }
        break;

      case PageState.Summary:
        router.push("../../");
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
        router.push("../../");
        break;
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        console.log("Incrementing state with key press");
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

  console.log(currentQuestion, questions[currentQuestion]);

  return (
    <div>
      {(() => {
        switch (pageState) {
          case PageState.Title:
            return <TitleSlide category={category} questions={questions} />;
          case PageState.Question:
            return (
              <QuestionSlide
                category={category}
                question={questions[currentQuestion]}
              />
            );
          case PageState.Summary:
            return <SummarySlide category={category} questions={questions} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
