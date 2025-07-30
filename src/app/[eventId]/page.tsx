"use client";

import { Button, Separator, TextField } from "@radix-ui/themes";
import { Clipboard, Presentation } from "lucide-react";
import { useEventId } from "@/contexts/EventIdContext";
import { toast } from "sonner";
import styled from "styled-components";
import { EventPageTemplate, Page } from "./pageTemplate";

const CallToActionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 30rem;
`;

const IdButton = styled.a`
  color: var(--accent-11);
  cursor: pointer;
  font-weight: 800;
  font-stretch: expanded;

  &:hover {
    text-decoration: underline;
  }
`;

const CallToActionText = styled.span`
  text-align: center;
  text-wrap: balance;
`;

const TextFieldRoot = styled(TextField.Root)`
  background-image: none;
  height: auto;
  padding: 0.5rem;
  width: 100%;
`;

const TextFieldSlot = styled(TextField.Slot)`
  padding-right: 0;
`;

const StyledButton = styled(Button)`
  padding-inline: 0.5rem;
`;

function CopyUrlButton() {
  const url = window.location.origin + window.location.pathname;
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL copied to clipboard!");
    });
  };
  return (
    <TextFieldRoot disabled value={url} size="3" name="copy-url">
      <TextFieldSlot side="right">
        <StyledButton onClick={handleCopy}>
          <Clipboard size={20} />
        </StyledButton>
      </TextFieldSlot>
    </TextFieldRoot>
  );
}

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
  return (
    <EventPageTemplate currentPage={Page.Home}>
      <CallToActionWrapper>
        <CallToActionText>
          It's dangerous to go alone! Take this: <CopyIdButton />. Don't lose
          it!
        </CallToActionText>
        <CopyUrlButton />
      </CallToActionWrapper>

      <Separator size="3" />

      <a href="./present" target="_blank" rel="noopener noreferrer">
        <Button variant="solid" size={"4"}>
          <Presentation />
          Present
        </Button>
      </a>
    </EventPageTemplate>
  );
}
