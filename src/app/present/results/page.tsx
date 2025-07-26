"use client";

import BaseSlide from "@/components/slides/baseSlide";
import { useResultsContext } from "@/contexts/ResultsContext";
import { intToOrdinal } from "@/utils";
import styled from "styled-components";

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

export default function PresentResultsPage() {
  const { results, isLoading } = useResultsContext();

  return (
    <BaseSlide>
      <Title>Results</Title>
      {isLoading ? (
        <p>Loading results...</p>
      ) : (
        <ResultsTable>
          <tbody>
            {results.map((result) => (
              <tr key={result.playerId}>
                <PlaceTD>
                  {intToOrdinal(result.place)}
                  {result.tied && " ="}
                </PlaceTD>
                <PlayerTD>{result.playerName}</PlayerTD>
                <ScoreTD>{result.score}</ScoreTD>
              </tr>
            ))}
          </tbody>
        </ResultsTable>
      )}
    </BaseSlide>
  );
}
