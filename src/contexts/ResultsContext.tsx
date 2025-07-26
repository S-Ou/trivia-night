"use client";

import { Results } from "@/generated/prisma";
import { createContext, useContext, useEffect, useState } from "react";

interface Result extends Results {
  place: number;
  tied: boolean;
}

interface ResultsContextType {
  results: Result[];
  isLoading: boolean;
  fetchResults: () => Promise<void>;
  updateResults: (results: Results[]) => Promise<void>;
}

export const ResultsContext = createContext<ResultsContextType>({
  results: [],
  isLoading: false,
  fetchResults: async () => {},
  updateResults: async () => {
    throw new Error("updateResults not implemented in default context");
  },
});

interface ResultsProviderProps {
  children: React.ReactNode;
}

export const ResultsProvider = ({ children }: ResultsProviderProps) => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function calculatePlaces(rawResults: Results[]): Result[] {
    if (!rawResults || rawResults.length === 0) return [];
    const sortedResults = [...rawResults].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.playerId.localeCompare(b.playerId);
    });
    const placeMap = new Map<string, number>();
    let currentPlace = 1;
    sortedResults.forEach((result, idx) => {
      if (idx > 0 && result.score === sortedResults[idx - 1].score) {
        placeMap.set(
          result.playerId,
          placeMap.get(sortedResults[idx - 1].playerId)!
        );
      } else {
        placeMap.set(result.playerId, currentPlace);
      }
      currentPlace++;
    });
    return rawResults.map((result) => {
      const place = placeMap.get(result.playerId)!;
      const tied =
        rawResults.filter((r) => placeMap.get(r.playerId) === place).length > 1;
      return {
        ...result,
        place,
        tied,
      };
    });
  }

  async function fetchResults() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/results`);
      const data = await response.json();
      setResults(calculatePlaces(data));
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateResults(results: Results[]) {
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results }),
      });
      const updatedResults = await response.json();
      setResults(calculatePlaces(updatedResults));
    } catch (error) {
      console.error("Error updating results:", error);
    }
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <ResultsContext.Provider
      value={{
        results,
        isLoading,
        fetchResults,
        updateResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResultsContext = () => useContext(ResultsContext);
import * as React from "react";
