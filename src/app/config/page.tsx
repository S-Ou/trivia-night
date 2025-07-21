"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { PageTemplate, Page } from "../pageTemplate";
import styled from "styled-components";
import { Switch, TextArea, TextField } from "@radix-ui/themes";
import { useEventContext } from "@/contexts/EventContext";

const ConfigWrapper = styled.div`
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  margin: 0 auto;
  // max-width: 800px;
`;

const ConfigLabel = styled.h2`
  margin: 0;
  text-align: right;
  font-size: 1.2rem;
`;

const ConfigInput = styled.div`
  width: 100%;
`;

const StyledTextField = styled(TextField.Root)<{ $error?: boolean }>`
  ${({ $error }) =>
    $error &&
    `
      box-shadow: inset 0 0 0 var(--text-field-border-width) red;
      --text-field-focus-color: red;
    `}
`;

const StyledTextArea = styled(TextArea)<{ $error?: boolean }>`
  ${({ $error }) =>
    $error &&
    `
      box-shadow: inset 0 0 0 var(--text-area-border-width) red;
      outline-color: red;
    `}
`;

enum ConfigComponentType {
  Switch,
  TextArea,
  TextField,
}

function ConfigComponent({
  label,
  type,
  value,
  onChange,
  required = false,
}: {
  label: string;
  type: ConfigComponentType;
  value?: string | boolean;
  onChange: (value: string | boolean) => void;
  required?: boolean;
}) {
  return (
    <>
      <ConfigLabel>
        {label}
        {required && <span>*</span>}
      </ConfigLabel>
      <ConfigInput>
        {type === ConfigComponentType.TextField ? (
          <StyledTextField
            placeholder={label}
            value={value as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            $error={required && !value}
          />
        ) : type === ConfigComponentType.TextArea ? (
          <StyledTextArea
            placeholder={label}
            value={value as string}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChange(e.target.value)
            }
            $error={required && !value}
          />
        ) : type === ConfigComponentType.Switch ? (
          <Switch checked={value as boolean} onCheckedChange={onChange} />
        ) : null}
      </ConfigInput>
    </>
  );
}

export default function ConfigPage() {
  const { event, isLoading } = useEventContext();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);

  useEffect(() => {
    console.log("Config updated:", {
      name: title,
      description,
      enableAnimations,
    });
  }, [title, description, enableAnimations]);

  useEffect(() => {
    if (event && !isLoading) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setEnableAnimations(true);
    }
  }, [event?.id, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTemplate currentPage={Page.Config}>
      <ConfigWrapper>
        <ConfigComponent
          label="Title"
          type={ConfigComponentType.TextField}
          required
          value={title}
          onChange={(val: string | boolean) => setTitle(val as string)}
        />
        <ConfigComponent
          label="Description"
          type={ConfigComponentType.TextArea}
          value={description}
          onChange={(val: string | boolean) => setDescription(val as string)}
        />
        <ConfigComponent
          label="Enable animations"
          type={ConfigComponentType.Switch}
          value={enableAnimations}
          onChange={(val: string | boolean) =>
            setEnableAnimations(val as boolean)
          }
        />
      </ConfigWrapper>
    </PageTemplate>
  );
}
