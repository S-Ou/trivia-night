"use client";

import { useEventContext } from "@/contexts/EventContext";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { Result, useResultsContext } from "@/contexts/ResultsContext";
import { Event, Category } from "@/generated/prisma";
import { Question } from "@/types/Question";

export interface SlideProps {
  event: {
    event: Event;
    isLoading: boolean;
  };
  category: {
    categories: Category[];
    currentCategory: Category | null;
    currentCategoryIndex: number | null;
    nextCategoryIndex: number | null;
  };
  question: {
    questions: Question[];
    currentQuestions: Question[] | null;
    currentQuestionIndex: number | null;
    isLoading: boolean;
  };
  result: {
    results: Result[];
    isLoading: boolean;
  };
}

export function GetSlideProps({
  currentCategoryIndex,
  currentQuestionIndex,
}: {
  currentCategoryIndex?: number;
  currentQuestionIndex?: number;
} = {}): SlideProps {
  const { event, isLoading: isEventLoading } = useEventContext();
  const {
    questions,
    categories,
    isLoading: isQuestionLoading,
    nextCategoryIndex,
  } = useQuestionContext();
  const { results, isLoading: isResultsLoading } = useResultsContext();

  if (!event) {
    return {} as SlideProps;
  }

  const currentCategory = categories[currentCategoryIndex ?? 0] || null;
  const currentQuestions = currentCategory
    ? questions.filter((q) => q.categoryId === currentCategory.id)
    : null;

  return {
    event: {
      event,
      isLoading: isEventLoading,
    },
    category: {
      categories: categories,
      currentCategory: currentCategory,
      currentCategoryIndex: currentCategoryIndex ?? null,
      nextCategoryIndex: nextCategoryIndex,
    },
    question: {
      questions: questions,
      currentQuestions: currentQuestions,
      currentQuestionIndex: currentQuestionIndex ?? null,
      isLoading: isQuestionLoading,
    },
    result: {
      results: results,
      isLoading: isResultsLoading,
    },
  };
}
