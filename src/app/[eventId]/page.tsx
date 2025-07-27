"use client";

import { Button } from "@radix-ui/themes";
import { PageTemplate, Page } from "./pageTemplate";
import { Presentation } from "lucide-react";
import { useEventId } from "@/contexts/EventIdContext";

export default function Home() {
  const { eventId } = useEventId();

  return (
    <PageTemplate currentPage={Page.Home}>
      {eventId}
      <a href="./present" target="_blank" rel="noopener noreferrer">
        <Button variant="solid" size={"4"}>
          <Presentation />
          Present
        </Button>
      </a>
    </PageTemplate>
  );
}
