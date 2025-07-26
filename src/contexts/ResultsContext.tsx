"use client";

import { Results } from "@/generated/prisma";
import { createContext, useContext, useEffect, useState } from "react";

interface ResultsContextType {
  results: Results[];
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
  const [results, setResults] = useState<Results[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchResults() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/results`);
      const data = await response.json();
      setResults(data);
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
      setResults(updatedResults);
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
