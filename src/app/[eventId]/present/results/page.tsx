"use client";

import React, { useEffect, useState } from "react";
import { useEventContext } from "@/contexts/EventContext";
import { useResultsContext } from "@/contexts/ResultsContext";
import { useRouter } from "next/navigation";
import { ResultSlide } from "@/components/slides/basic/resultSlide";
import { GetSlideProps } from "@/components/slides/slideProps";

export default function PresentResultsPage() {
  const router = useRouter();
  const { fetchResults } = useResultsContext();
  const { fetchEvent } = useEventContext();
  const [revealedRows, setRevealedRows] = useState<Set<string>>(new Set());

  const handleReveal = (playerId: string) => {
    setRevealedRows((prev) => new Set(prev).add(playerId));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === " ") {
        router.push("../");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  useEffect(() => {
    Promise.all([fetchEvent(), fetchResults()]);
  }, [fetchEvent, fetchResults]);

  const slideProps = GetSlideProps();

  return (
    <ResultSlide
      {...slideProps}
      revealedRows={revealedRows}
      handleReveal={handleReveal}
    />
  );
}
