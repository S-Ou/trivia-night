"use client";

import { Button, Link, TabNav, TextField } from "@radix-ui/themes";
import { PageTemplate } from "./pageTemplate";
import { SendHorizontal } from "lucide-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const eventNotFoundValue = searchParams?.get("eventNotFound");

  const [inputValue, setInputValue] = useState(eventNotFoundValue ?? "");
  useEffect(() => {
    if (eventNotFoundValue) {
      toast.error(`Event ${eventNotFoundValue} not found.`);
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.delete("eventNotFound");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [eventNotFoundValue, router]);

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

  return (
    <PageTemplate
      tabs={
        <TabNav.Link asChild active>
          <Link href="#">Home</Link>
        </TabNav.Link>
      }
    >
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
      <Button size={"3"} onClick={() => router.push("./create")}>
        Create new event
      </Button>
    </PageTemplate>
  );
}
