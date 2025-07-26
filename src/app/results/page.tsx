"use client";
import React from "react";
import styled from "styled-components";
import { PageTemplate, Page } from "../pageTemplate";
import { useResultsContext } from "@/contexts/ResultsContext";
import { intToOrdinal } from "@/utils";

const StyledTable = styled.table`
  border-collapse: collapse;
  margin-top: 1rem;
  width: 80%;

  th,
  td {
    border-bottom: 2px solid var(--accent-5);
    padding: 0.5rem;
  }

  th {
    text-align: left;
  }
`;

const BoldTD = styled.td`
  font-weight: 600;
`;

export default function ResultsPage() {
  const { results, isLoading } = useResultsContext();

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  return (
    <PageTemplate currentPage={Page.Results}>
      <StyledTable>
        <thead>
          <tr>
            <th>Place</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.playerId}>
              <BoldTD>
                {intToOrdinal(result.place)}
                {result.tied && " ="}
              </BoldTD>
              <BoldTD>{result.playerName}</BoldTD>
              <BoldTD>{result.score}</BoldTD>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </PageTemplate>
  );
}
