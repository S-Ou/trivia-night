"use client";

import { GetSlideProps } from "@/components/slides/slideProps";
import { useSlideComponents } from "@/contexts/ThemeContext";
import { useEventContext } from "@/contexts/EventContext";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useEffect } from "react";

export default function Present() {
  const { event } = useEventContext();
  const {
    categories,
    isLoading: isQuestionLoading,
    nextCategoryIndex,
    setNextCategoryIndex,
  } = useQuestionContext();

  const { HomeSlide } = useSlideComponents();

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

  const getCategoryLink = (index: number, isAnswers?: boolean) => {
    return isAnswers
      ? `./category/${index}?answers=true`
      : `./category/${index}`;
  };

  const slideProps = GetSlideProps();

  return (
    <HomeSlide
      {...slideProps}
      getCategoryLink={getCategoryLink}
      resultsLink="../results"
    />
  );
}
