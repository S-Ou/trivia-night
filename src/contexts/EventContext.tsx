"use client";

import { Event } from "@/generated/prisma";
import { UpdateEventDTO } from "@/services/eventService";
import { createContext, useContext, useEffect, useState } from "react";
import { useEventId } from "./EventIdContext";

interface EventContextType {
  event: Event;
  isLoading: boolean;
  fetchEvent: () => Promise<void>;
  updateEvent: (data: UpdateEventDTO) => Promise<void>;
}

export const EventContext = createContext<EventContextType>({
  event: {} as Event,
  isLoading: false,
  fetchEvent: async () => {},
  updateEvent: async () => {
    throw new Error("updateEvent not implemented in default context");
  },
});

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const { eventId } = useEventId();
  const [event, setEvent] = useState<Event>({} as Event);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchEvent() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${eventId}/event`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateEvent(data: UpdateEventDTO) {
    try {
      const response = await fetch(`/api/${eventId}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  }

  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <EventContext.Provider
      value={{ event, isLoading, fetchEvent, updateEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
