"use client";

import React, { use, useEffect, useState } from "react";
import BaseSlide from "@/components/slides/basic/baseSlide";
import { useEventContext } from "@/contexts/EventContext";
import { useResultsContext } from "@/contexts/ResultsContext";
import { intToOrdinal } from "@/utils";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Title = styled.h1`
  font-size: 8rem;
  font-stretch: expanded;
  font-weight: 800;
`;

const ResultsTable = styled.table`
  border-collapse: collapse;
  margin-top: 2rem;
`;

const StyledTD = styled.td`
  padding-block: 0.5rem;
  padding-inline: 3rem;
`;

const PlaceTD = styled(StyledTD)`
  font-weight: 1000;
  font-size: 2.5rem;
`;

const PlayerTD = styled(StyledTD)`
  font-weight: 500;
  font-size: 3rem;
`;

const ScoreTD = styled(StyledTD)`
  font-weight: 400;
  font-size: 2.5rem;
`;

const HiddenSpan = styled.span<{ isHidden?: boolean }>`
  opacity: ${(props) => (props.isHidden ? 0 : 1)};
  transition: opacity 0.3s;
`;

const RevealOverlay = styled.span`
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 2.5rem;
  font-variation-settings: "slnt" -10;
  font-weight: 300;
  height: 100%;
  justify-content: start;
  left: 3rem;
  position: absolute;
  top: 0;
  width: 100%;
`;

export default function PresentResultsPage() {
  const router = useRouter();
  const {
    results,
    isLoading: isResultsLoading,
    fetchResults,
  } = useResultsContext();
  const { event, isLoading: isEventLoading, fetchEvent } = useEventContext();
  const [revealedRows, setRevealedRows] = useState<Set<string>>(new Set());
  const [isCompletelyLoading, setIsCompletelyLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    if (isEventLoading) setIsCompletelyLoading(false);
    Promise.all([fetchEvent(), fetchResults()]).then(() => {
      setIsCompletelyLoading(false);
    });
  }, []);

  return (
    <BaseSlide>
      <Title>Results</Title>
      {isResultsLoading ? (
        <p>Loading results...</p>
      ) : (
        <ResultsTable>
          <tbody>
            {results.map((result) => {
              const isHidden =
                isCompletelyLoading ||
                (event?.hideResults && !revealedRows.has(result.playerId));
              return (
                <tr key={result.playerId}>
                  <PlaceTD>
                    {intToOrdinal(result.place)}
                    {result.tied && " ="}
                  </PlaceTD>
                  <PlayerTD style={{ position: "relative" }}>
                    <HiddenSpan isHidden={isEventLoading || isHidden}>
                      {result.playerName}
                    </HiddenSpan>
                    {isHidden && (
                      <RevealOverlay
                        onClick={() => handleReveal(result.playerId)}
                      >
                        click to reveal
                      </RevealOverlay>
                    )}
                  </PlayerTD>
                  <ScoreTD style={{ position: "relative" }}>
                    <HiddenSpan isHidden={isEventLoading || isHidden}>
                      {result.score}
                    </HiddenSpan>
                  </ScoreTD>
                </tr>
              );
            })}
          </tbody>
        </ResultsTable>
      )}
    </BaseSlide>
  );
}
