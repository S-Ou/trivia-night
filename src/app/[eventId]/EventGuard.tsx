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
    if (!isLoading && !event) {
      toast.error(`Event ${eventId} not found.`);
      router.push("/");
    }
  }, [isLoading, event, router]);

  if (isLoading || !event) {
    return null;
  }

  // Event exists, show children
  return <>{children}</>;
}
