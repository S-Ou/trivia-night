"use client";

import { Button, Separator } from "@radix-ui/themes";
import { Presentation } from "lucide-react";
import { useEventId } from "@/contexts/EventIdContext";
import { toast } from "sonner";
import styled from "styled-components";
import { EventPageTemplate, Page } from "./pageTemplate";
import Link from "next/link";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { CallToActionCopyUrl } from "@/components/CopyUrlButton";

const IdButton = styled.a`
  color: var(--accent-11);
  cursor: pointer;
  font-weight: 800;
  font-stretch: expanded;

  &:hover {
    text-decoration: underline;
  }
`;

function CopyIdButton() {
  const { eventId } = useEventId();

  const handleCopy = () => {
    navigator.clipboard.writeText(eventId.toString()).then(() => {
      toast.success("Event ID copied to clipboard!");
    });
  };

  return (
    <IdButton
      onClick={(e) => {
        e.preventDefault();
        handleCopy();
      }}
    >
      {eventId}
    </IdButton>
  );
}

export default function Home() {
  const { questions } = useQuestionContext();

  return (
    <EventPageTemplate currentPage={Page.Home}>
      <CallToActionCopyUrl>
        This is the event&apos;s unique ID: <CopyIdButton />. Save it somewhere
        safe to return to this event later or to share with others.
      </CallToActionCopyUrl>

      <Link href="/">
        <Button variant={"outline"}>Exit to homepage</Button>
      </Link>

      <Separator size="3" />

      <a href="./present" target="_blank" rel="noopener noreferrer">
        <Button variant="solid" size={"4"} disabled={questions.length === 0}>
          <Presentation />
          {questions.length > 0 ? "Present" : "Add questions to present"}
        </Button>
      </a>
    </EventPageTemplate>
  );
}
