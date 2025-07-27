import { ContextProviders } from "@/contexts/contextProviders";
import { EventIdProvider } from "@/contexts/EventIdContext";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const { eventId: eventIdString } = await params;
  const eventId = parseInt(eventIdString, 10);

  return (
    <EventIdProvider eventId={eventId}>
      <ContextProviders>{children}</ContextProviders>
    </EventIdProvider>
  );
}
