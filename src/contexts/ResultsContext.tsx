"use client";

import { Results } from "@/generated/prisma";
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEventId } from "./EventIdContext";

export interface Result extends Results {
  place: number;
  tied: boolean;
}

interface ResultsContextType {
  results: Result[];
  isLoading: boolean;
  error: Error | null;
  fetchResults: () => void;
  updateResults: (results: Results[]) => Promise<void>;
  deleteResult: (playerId: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const ResultsContext = createContext<ResultsContextType>({
  results: [],
  isLoading: false,
  error: null,
  fetchResults: () => {},
  updateResults: async () => {
    throw new Error("updateResults not implemented in default context");
  },
  deleteResult: async () => {
    throw new Error("deleteResult not implemented in default context");
  },
  isUpdating: false,
  isDeleting: false,
});

// Helper function to calculate places
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

// API functions
const fetchResultsData = async (eventId: number | null): Promise<Result[]> => {
  if (!eventId) return [];

  const response = await fetch(`/api/${eventId}/results`);

  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }

  const data = await response.json();
  return calculatePlaces(data);
};

const updateResultsData = async (
  eventId: number,
  results: Results[]
): Promise<Result[]> => {
  const response = await fetch(`/api/${eventId}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ results }),
  });

  if (!response.ok) {
    throw new Error("Failed to update results");
  }

  const updatedResults = await response.json();
  return calculatePlaces(updatedResults);
};

const deleteResultData = async (
  eventId: number,
  playerId: string
): Promise<Result[]> => {
  const response = await fetch(`/api/${eventId}/results`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventId, playerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete result");
  }

  const updatedResults = await response.json();
  return calculatePlaces(updatedResults);
};

interface ResultsProviderProps {
  children: React.ReactNode;
}

export const ResultsProvider = ({ children }: ResultsProviderProps) => {
  const { eventId } = useEventId();
  const queryClient = useQueryClient();

  // Query for fetching results with caching
  const {
    data: results = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["results", eventId],
    queryFn: () => fetchResultsData(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (results change more frequently)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Mutation for updating results
  const updateResultsMutation = useMutation({
    mutationFn: (results: Results[]) => {
      if (!eventId) throw new Error("No event ID available");
      return updateResultsData(eventId, results);
    },
    onMutate: async (newResults) => {
      await queryClient.cancelQueries({ queryKey: ["results", eventId] });

      const previousResults = queryClient.getQueryData(["results", eventId]);

      queryClient.setQueryData(
        ["results", eventId],
        calculatePlaces(newResults)
      );

      return { previousResults };
    },
    onError: (err, newResults, context) => {
      queryClient.setQueryData(["results", eventId], context?.previousResults);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["results", eventId] });
    },
  });

  // Mutation for deleting a result
  const deleteResultMutation = useMutation({
    mutationFn: (playerId: string) => {
      if (!eventId) throw new Error("No event ID available");
      return deleteResultData(eventId, playerId);
    },
    onSuccess: (updatedResults) => {
      // Update the cache with the new results data
      queryClient.setQueryData(["results", eventId], updatedResults);
    },
    onError: (error) => {
      console.error("Error deleting result:", error);
    },
  });

  const updateResults = async (results: Results[]) => {
    await updateResultsMutation.mutateAsync(results);
  };

  const deleteResult = async (playerId: string) => {
    await deleteResultMutation.mutateAsync(playerId);
  };

  const fetchResults = () => {
    refetch();
  };

  return (
    <ResultsContext.Provider
      value={{
        results,
        isLoading,
        error: error as Error | null,
        fetchResults,
        updateResults,
        deleteResult,
        isUpdating: updateResultsMutation.isPending,
        isDeleting: deleteResultMutation.isPending,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResultsContext = () => useContext(ResultsContext);

// Additional hook for pages that need fresh data every time
export const useResultsContextWithFreshData = () => {
  const context = useResultsContext();
  const queryClient = useQueryClient();
  const { eventId } = useEventId();

  const refetchFreshData = async () => {
    // Invalidate cache and refetch
    await queryClient.invalidateQueries({ queryKey: ["results", eventId] });
  };

  return {
    ...context,
    refetchFreshData,
  };
};
