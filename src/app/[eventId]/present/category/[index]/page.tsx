"use client";

import { useQuestionContext } from "@/contexts/QuestionContext";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { GetSlideProps } from "@/components/slides/slideProps";
import { useSlideComponents } from "@/contexts/ThemeContext";

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

  const { TitleSlide, QuestionSlide, SummarySlide } = useSlideComponents();

  const [pageState, setPageState] = useState<PageState>(PageState.Title);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const { getCategory, categories, isLoading, setNextCategoryIndex } =
    useQuestionContext();

  const categoryData =
    !isLoading && categories.length > parsedIndex
      ? getCategory(parsedIndex)
      : { category: null, questions: [] };
  const { category, questions } = categoryData;

  const goHome = useCallback(() => {
    if (!showAnswers) {
      if (pageState === PageState.Summary) {
        setNextCategoryIndex(parsedIndex + 1);
      } else {
        setNextCategoryIndex(parsedIndex);
      }
    }
    router.push("../../");
  }, [showAnswers, pageState, setNextCategoryIndex, parsedIndex, router]);

  const incrementState = useCallback(() => {
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
  }, [pageState, currentQuestion, questions.length, showAnswers, goHome]);

  const decrementState = useCallback(() => {
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
  }, [pageState, currentQuestion, questions.length, goHome]);

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
  }, [
    isLoading,
    categories,
    parsedIndex,
    currentQuestion,
    pageState,
    decrementState,
    incrementState,
  ]);

  if (isLoading || categories.length <= parsedIndex || !category) {
    return <p>Loading category...</p>;
  }

  const slideProps = {
    ...GetSlideProps({
      currentCategoryIndex: parsedIndex,
      currentQuestionIndex: currentQuestion,
    }),
    showAnswers,
  };

  return (
    <>
      {pageState === PageState.Title && <TitleSlide {...slideProps} />}
      {pageState === PageState.Question && <QuestionSlide {...slideProps} />}
      {pageState === PageState.Summary && <SummarySlide {...slideProps} />}
    </>
  );
}
