import { ContextProviders } from "@/contexts/contextProviders";
import { EventIdProvider } from "@/contexts/EventIdContext";
import { EventGuard } from "./EventGuard";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({
  children,
  params,
}: EventLayoutProps) {
  const { eventId: eventIdString } = await params;
  const eventId = parseInt(eventIdString, 10);

  return (
    <EventIdProvider eventId={eventId}>
      <ContextProviders>
        <EventGuard>{children}</EventGuard>
      </ContextProviders>
    </EventIdProvider>
  );
}
