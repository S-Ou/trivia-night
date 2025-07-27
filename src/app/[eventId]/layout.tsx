"use client";

import { ContextProviders } from "@/contexts/contextProviders";
import { EventIdProvider } from "@/contexts/EventIdContext";

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const eventId = parseInt(params.eventId, 10);

  return (
    <EventIdProvider eventId={eventId}>
      <ContextProviders>{children}</ContextProviders>
    </EventIdProvider>
  );
}
