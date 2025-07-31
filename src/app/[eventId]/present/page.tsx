"use client";

import HomeSlide from "@/components/slides/basic/homeSlide";
import { useEventContext } from "@/contexts/EventContext";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useResultsContext } from "@/contexts/ResultsContext";
import { useEffect } from "react";

export default function Present() {
  const { event, isLoading: isEventLoading } = useEventContext();
  const {
    categories,
    isLoading: isQuestionLoading,
    nextCategoryIndex,
    setNextCategoryIndex,
  } = useQuestionContext();
  const { results } = useResultsContext();

  useEffect(() => {
    if (isQuestionLoading) return;

    if (nextCategoryIndex === categories.length) {
      setNextCategoryIndex(null);
    }
  }, [
    isQuestionLoading,
    categories.length,
    nextCategoryIndex,
    setNextCategoryIndex,
  ]);

  if (!event) {
    return null;
  }

  return (
    <HomeSlide
      event={event}
      isEventLoading={isEventLoading}
      isQuestionLoading={isQuestionLoading}
      categories={categories}
      nextCategoryIndex={nextCategoryIndex}
      results={results}
    />
  );
}
