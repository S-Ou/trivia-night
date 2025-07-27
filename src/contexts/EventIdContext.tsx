"use client";

import { createContext, useContext } from "react";

interface EventIdContextType {
  eventId: number;
}

export const EventIdContext = createContext<EventIdContextType>({
  eventId: 0,
});

interface EventIdProviderProps {
  children: React.ReactNode;
  eventId: number;
}

export const EventIdProvider = ({
  children,
  eventId,
}: EventIdProviderProps) => {
  return (
    <EventIdContext.Provider value={{ eventId }}>
      {children}
    </EventIdContext.Provider>
  );
};

export const useEventId = () => {
  const context = useContext(EventIdContext);
  if (!context) {
    throw new Error("useEventId must be used within an EventIdProvider");
  }
  return context;
};
