"use client";

import { Button, Link, TabNav, TextField } from "@radix-ui/themes";
import { PageTemplate } from "./pageTemplate";
import { SendHorizontal } from "lucide-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CallToActionText } from "@/components/atomic";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const TextFieldRoot = styled(TextField.Root)`
  background-image: none;
  height: auto;
  padding: 0.5rem;
  min-width: 15rem;
`;

const TextFieldSlot = styled(TextField.Slot)`
  padding-right: 0;
`;

const StyledTextFieldButton = styled(Button)`
  padding-inline: 0.5rem;
`;

export default function HomePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  function handleNavigation(eventId: number) {
    router.push(`./${eventId}`);
  }

  function handleInputEnter() {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !isNaN(Number(trimmedValue))) {
      handleNavigation(Number(trimmedValue));
    } else {
      toast.error("Please enter a valid event ID.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleInputEnter();
    }
  }

  async function handleCreateNewEvent() {
    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const newEvent = await response.json();
      toast.success("New event created successfully!");
      handleNavigation(newEvent.id);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create new event.");
    }
  }

  return (
    <PageTemplate
      tabs={
        <TabNav.Link asChild active>
          <Link href="#">Home</Link>
        </TabNav.Link>
      }
    >
      <CallToActionText>
        Make trivia night hosting easy! Avoid the stress of creating
        presentation slides and focus on creating a fun event by letting this
        web app do the heavy lifting for you.
      </CallToActionText>
      <InputWrapper>
        <TextFieldRoot
          placeholder="Enter existing event ID"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        >
          <TextFieldSlot side="right">
            <StyledTextFieldButton onClick={handleInputEnter}>
              <SendHorizontal size={20} />
            </StyledTextFieldButton>
          </TextFieldSlot>
        </TextFieldRoot>
        or
        <Button size={"3"} onClick={handleCreateNewEvent}>
          Create new event
        </Button>
      </InputWrapper>
    </PageTemplate>
  );
}
