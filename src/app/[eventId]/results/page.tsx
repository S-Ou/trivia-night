"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Result, useResultsContext } from "@/contexts/ResultsContext";
import { intToOrdinal } from "@/utils";
import { Plus, Trash, Trophy } from "lucide-react";
import { Button, TextField } from "@radix-ui/themes";
import { useEventContext } from "@/contexts/EventContext";
import { handleConfigUpdate } from "@/components/handleConfigUpdate";
import {
  ConfigComponentType,
  ConfigField,
  ConfigForm,
} from "@/components/ConfigForm";
import { toast } from "sonner";
import { EventPageTemplate, Page } from "../pageTemplate";
import { CallToActionText } from "@/components/atomic";

const StyledTable = styled.table`
  border-collapse: collapse;
  column-gap: 1rem;
  width: 75%;

  th,
  td {
    border-bottom: 2px solid var(--accent-5);
    padding: 0.5rem;
  }

  th {
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PlaceTH = styled.th`
  white-space: nowrap;
  min-width: 3rem;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
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
  position: relative;
  &:hover .delete-btn {
    display: flex;
  }
`;

const ScoreTD = styled.td`
  font-weight: 500;
  white-space: nowrap;
`;

const PlayerTD = styled.td`
  font-weight: 400;
  width: 100%;
`;

const AddNewTD = styled.td``;

const AddNewButton = styled(Button)`
  align-items: center;
  color: var(--accent-9);
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: background-color 0.2s ease;
  width: 100%;

  &:hover {
    background-color: var(--accent-2);
  }
`;

export default function ResultsPage() {
  const {
    results,
    isLoading: isResultsLoading,
    updateResult,
    createResult,
    deleteResult,
  } = useResultsContext();
  const { event, isLoading: isEventLoading, updateEvent } = useEventContext();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hideResults, setHideResults] = useState(event?.hideResults || false);

  useEffect(() => {
    if (event && !isEventLoading) {
      setHideResults(event.hideResults || false);
    }
  }, [event, isEventLoading]);

  function onBlurHandler(updatedResult: Result) {
    const isChanged = results.some((result) => {
      return (
        result.playerId === updatedResult.playerId &&
        (result.playerName !== updatedResult.playerName ||
          result.score !== updatedResult.score)
      );
    });

    if (isChanged) {
      updateResult({
        playerId: updatedResult.playerId,
        eventId: updatedResult.eventId,
        playerName: updatedResult.playerName,
        score: updatedResult.score,
      })
        .then(() => {
          toast.success("Result updated successfully");
        })
        .catch(() => {
          toast.error("Failed to update result");
        });
    }
  }

  function addNewPlayer() {
    const playerName = `Player ${results.length + 1}`;
    createResult(playerName)
      .then(() => {
        toast.success("Player added successfully");
      })
      .catch(() => {
        toast.error("Failed to add player");
      });
  }

  function handleDelete(playerId: string) {
    deleteResult(playerId)
      .then(() => {
        toast.success("Player deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete player");
      });
  }

  const handleUpdate = (
    key: string,
    value: string | boolean,
    required?: boolean
  ) => {
    handleConfigUpdate({
      key,
      value,
      required,
      event,
      updateEvent,
      title: event?.title || "",
      description: event?.description || "",
      hideResults,
    });
  };

  const configFields: ConfigField[] = [
    {
      key: "hideResults",
      label: "Hide results",
      type: ConfigComponentType.Switch,
      value: hideResults,
      disabled: isEventLoading,
      onChange: (val) => {
        setHideResults(val as boolean);
        handleUpdate("hideResults", val as boolean);
      },
    },
  ];

  return (
    <EventPageTemplate currentPage={Page.Results}>
      <CallToActionText>
        Input live results below. These can be updated at any time and the live
        results can be viewed when presenting.
      </CallToActionText>
      <StyledTable>
        <thead>
          <tr>
            <PlaceTH>
              <IconWrapper>
                <Trophy size={16} />
              </IconWrapper>
            </PlaceTH>
            <PlayerTH>Player</PlayerTH>
            <ScoreTH>Score</ScoreTH>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.playerId}>
              <PlaceTD
                onMouseEnter={() => setHoveredId(result.playerId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {hoveredId === result.playerId ? (
                  <Button
                    className="delete-btn"
                    variant="ghost"
                    color="red"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => handleDelete(result.playerId)}
                  >
                    <Trash size={16} />
                  </Button>
                ) : (
                  <span>
                    {intToOrdinal(result.place)}
                    {result.tied && " ="}
                  </span>
                )}
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
          {!isResultsLoading && (
            <tr>
              <AddNewTD colSpan={3}>
                <AddNewButton variant="ghost" onClick={addNewPlayer}>
                  <Plus size={16} />
                  Add new player
                </AddNewButton>
              </AddNewTD>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <ConfigForm fields={configFields} />
    </EventPageTemplate>
  );
}
