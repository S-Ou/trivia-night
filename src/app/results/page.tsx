"use client";
import React from "react";
import { PageTemplate, Page } from "../pageTemplate";
import { useResultsContext } from "@/contexts/ResultsContext";

export default function ResultsPage() {
  const { results, isLoading } = useResultsContext();

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  return (
    <PageTemplate currentPage={Page.Results}>
      {results.map((result) => (
        <div key={result.playerId}>
          {result.playerName}: {result.score}
        </div>
      ))}
    </PageTemplate>
  );
}
