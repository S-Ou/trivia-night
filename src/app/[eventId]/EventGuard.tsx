"use client";

import { useEventContext } from "@/contexts/EventContext";
import { useEventId } from "@/contexts/EventIdContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface EventGuardProps {
  children: React.ReactNode;
}

export function EventGuard({ children }: EventGuardProps) {
  const { event, isLoading } = useEventContext();
  const { eventId } = useEventId();
  const router = useRouter();

  useEffect(() => {
    console.log("EventGuard: Checking event state", { isLoading, event });
    if (!isLoading && (!event || Object.keys(event).length === 0)) {
      router.push(`/?eventNotFound=${eventId}`);
    }
  }, [isLoading, event, router]);

  if (isLoading || !event || Object.keys(event).length === 0) {
    return null;
  }

  // Event exists, show children
  return <>{children}</>;
}
