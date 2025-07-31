"use client";

import { Event } from "@/generated/prisma";
import { UpdateEventDTO } from "@/services/eventService";
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEventId } from "./EventIdContext";
import { SlideThemeProvider } from "./ThemeContext";

interface EventContextType {
  event: Event | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchEvent: () => void;
  updateEvent: (data: UpdateEventDTO) => Promise<void>;
  isUpdating: boolean;
}

export const EventContext = createContext<EventContextType>({
  event: undefined,
  isLoading: false,
  error: null,
  fetchEvent: () => {},
  updateEvent: async () => {
    throw new Error("updateEvent not implemented in default context");
  },
  isUpdating: false,
});

// API functions
const fetchEventData = async (
  eventId: number | null
): Promise<Event | null> => {
  if (!eventId) return null;

  const response = await fetch(`/api/${eventId}/event`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  return response.json();
};

const updateEventData = async (
  eventId: number,
  data: UpdateEventDTO
): Promise<Event> => {
  const response = await fetch(`/api/${eventId}/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
};

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const { eventId } = useEventId();
  const queryClient = useQueryClient();

  // Query for fetching event with caching
  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventData(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Mutation for updating event
  const updateEventMutation = useMutation({
    mutationFn: (data: UpdateEventDTO) => {
      if (!eventId) throw new Error("No event ID available");
      return updateEventData(eventId, data);
    },
    onSuccess: (updatedEvent) => {
      // Update the cache with the new event data
      queryClient.setQueryData(["event", eventId], updatedEvent);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });

  const updateEvent = async (data: UpdateEventDTO) => {
    await updateEventMutation.mutateAsync(data);
  };

  const fetchEvent = () => {
    refetch();
  };

  return (
    <EventContext.Provider
      value={{
        event: event || undefined,
        isLoading,
        error: error as Error | null,
        fetchEvent,
        updateEvent,
        isUpdating: updateEventMutation.isPending,
      }}
    >
      <SlideThemeProvider defaultTheme="base" eventThemeId={event?.themeId}>
        {children}
      </SlideThemeProvider>
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);

// Additional hook for pages that need fresh data every time
export const useEventContextWithFreshData = () => {
  const context = useEventContext();
  const queryClient = useQueryClient();
  const { eventId } = useEventId();

  const refetchFreshData = async () => {
    // Invalidate cache and refetch
    await queryClient.invalidateQueries({ queryKey: ["event", eventId] });
  };

  return {
    ...context,
    refetchFreshData,
  };
};
