import { intToOrdinal } from "@/utils";
import { ResultSlideProps } from "../slideProps";
import BaseSlide from "./baseSlide";
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
  font-size: 2.5rem;
  font-weight: 1000;
`;

const PlayerTD = styled(StyledTD)`
  font-size: 3rem;
  font-weight: 500;
`;

const ScoreTD = styled(StyledTD)`
  font-size: 2.5rem;
  font-weight: 400;
`;

const HiddenSpan = styled.span<{ $isHidden?: boolean }>`
  opacity: ${(props) => (props.$isHidden ? 0 : 1)};
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

export function ResultSlide({
  event: { event, isLoading: isEventLoading },
  result: { results, isLoading: isResultsLoading },
  revealedRows,
  handleReveal,
  resultsLoaded,
}: ResultSlideProps) {
  console.log(event?.hideResults, resultsLoaded);
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
                (event?.hideResults && !revealedRows.has(result.playerId)) ||
                !resultsLoaded;
              return (
                <tr key={result.playerId}>
                  <PlaceTD>
                    {intToOrdinal(result.place)}
                    {result.tied && " ="}
                  </PlaceTD>
                  <PlayerTD style={{ position: "relative" }}>
                    <HiddenSpan $isHidden={isEventLoading || isHidden}>
                      {result.playerName}
                    </HiddenSpan>
                    {isHidden && (
                      <RevealOverlay
                        onClick={() => handleReveal(result.playerId)}
                      >
                        {resultsLoaded ? `click to reveal` : `loading...`}
                      </RevealOverlay>
                    )}
                  </PlayerTD>
                  <ScoreTD style={{ position: "relative" }}>
                    <HiddenSpan $isHidden={isEventLoading || isHidden}>
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
