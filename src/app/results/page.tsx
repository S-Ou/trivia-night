"use client";
import React from "react";
import styled from "styled-components";
import { PageTemplate, Page } from "../pageTemplate";
import { Result, useResultsContext } from "@/contexts/ResultsContext";
import { intToOrdinal } from "@/utils";
import { RefreshCcw } from "lucide-react";
import { TextField } from "@radix-ui/themes";

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 75%;
  column-gap: 1rem;

  th,
  td {
    border-bottom: 2px solid var(--accent-5);
    padding: 0.5rem;
  }

  th {
    text-align: left;
  }
`;

const PlaceTH = styled.th`
  white-space: nowrap;
`;

const ScoreTH = styled.th`
  white-space: nowrap;
`;

const PlayerTH = styled.th`
  width: 100%;
`;

const PlaceTD = styled.td`
  font-weight: 600;
  white-space: nowrap;
`;

const ScoreTD = styled.td`
  font-weight: 500;
  white-space: nowrap;
`;

const PlayerTD = styled.td`
  font-weight: 400;
  width: 100%;
`;

export default function ResultsPage() {
  const { results, isLoading, updateResults } = useResultsContext();

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  function onBlurHandler(updatedResult: Result) {
    const updatedResults = results.map((result) =>
      result.playerId != updatedResult.playerId
        ? result
        : {
            ...result,
            playerName: updatedResult.playerName,
            score: updatedResult.score,
          }
    );

    updateResults(updatedResults);
  }

  return (
    <PageTemplate currentPage={Page.Results}>
      <StyledTable>
        <thead>
          <tr>
            <PlaceTH>
              <RefreshCcw size={16} />
            </PlaceTH>
            <PlayerTH>Player</PlayerTH>
            <ScoreTH>Score</ScoreTH>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.playerId}>
              <PlaceTD>
                {intToOrdinal(result.place)}
                {result.tied && " ="}
              </PlaceTD>
              <PlayerTD>
                <TextField.Root
                  defaultValue={result.playerName}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    onBlurHandler({
                      ...result,
                      playerName: e.target.value.trim(),
                    });
                  }}
                  size="2"
                  variant="soft"
                />
              </PlayerTD>
              <ScoreTD>
                <TextField.Root
                  defaultValue={result.score}
                  type="number"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    onBlurHandler({
                      ...result,
                      score: parseInt(e.target.value, 10),
                    });
                  }}
                  size="2"
                  variant="soft"
                  inputMode="numeric"
                />
              </ScoreTD>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </PageTemplate>
  );
}
