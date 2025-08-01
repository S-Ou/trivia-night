import { Button, TextField } from "@radix-ui/themes";
import { toast } from "sonner";
import styled from "styled-components";
import { Clipboard } from "lucide-react";
import { ReactNode } from "react";
import { CallToActionText } from "./atomic";

const CallToActionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 30rem;
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

export function CopyUrlButton() {
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

export function CallToActionCopyUrl({ children }: { children?: ReactNode }) {
  return (
    <CallToActionWrapper>
      {children && <CallToActionText>{children}</CallToActionText>}
      <CopyUrlButton />
    </CallToActionWrapper>
  );
}
