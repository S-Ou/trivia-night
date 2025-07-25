"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
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

type ConfigField = {
  key: string;
  label: string;
  type: ConfigComponentType;
  value: string | boolean;
  required?: boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
};

function ConfigComponent({
  label,
  type,
  value,
  required = false,
  onChange,
  onBlur,
}: ConfigField) {
  const error = required && !value;
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
            onBlur={onBlur}
            $error={error}
          />
        ) : type === ConfigComponentType.TextArea ? (
          <StyledTextArea
            placeholder={label}
            value={value as string}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChange(e.target.value)
            }
            onBlur={onBlur}
            $error={error}
          />
        ) : type === ConfigComponentType.Switch ? (
          <Switch checked={value as boolean} onCheckedChange={onChange} />
        ) : null}
      </ConfigInput>
    </>
  );
}

export default function ConfigPage() {
  const { event, isLoading, updateEvent } = useEventContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableAnimations, setEnableAnimations] = useState(true);

  useEffect(() => {
    if (event && !isLoading) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setEnableAnimations(true);
    }
  }, [event?.id, isLoading]);

  const handleUpdate = (
    key: string,
    value: string | boolean,
    required?: boolean
  ) => {
    if (required && !value) {
      toast.error("Info failed to save, field is required");
      return;
    }

    if (
      (key === "title" && value === event.title) ||
      (key === "description" && value === event.description)
    ) {
      return;
    }

    let updatePromise: Promise<void> | undefined;
    switch (key) {
      case "title":
        updatePromise = updateEvent({ title: value as string, description });
        break;
      case "description":
        updatePromise = updateEvent({ title, description: value as string });
        break;
    }
    if (updatePromise) {
      updatePromise
        .then(() => toast.success("Config saved!"))
        .catch(() => toast.error("Failed to save config"));
    }
  };

  const configFields: ConfigField[] = [
    {
      key: "title",
      label: "Title",
      type: ConfigComponentType.TextField,
      value: title,
      required: true,
      onChange: (val) => setTitle(val as string),
      onBlur: () => handleUpdate("title", title, true),
    },
    {
      key: "description",
      label: "Description",
      type: ConfigComponentType.TextArea,
      value: description,
      onChange: (val) => setDescription(val as string),
      onBlur: () => handleUpdate("description", description),
    },
    {
      key: "enableAnimations",
      label: "Enable animations",
      type: ConfigComponentType.Switch,
      value: enableAnimations,
      onChange: (val) => {
        setEnableAnimations(val as boolean);
        // handleUpdate("enableAnimations", val as boolean); // enable later
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <PageTemplate currentPage={Page.Config}>
      <Toaster richColors position="top-right" />
      <ConfigWrapper>
        {configFields.map((field) => {
          const { key, ...rest } = field;
          return <ConfigComponent key={key} {...rest} />;
        })}
      </ConfigWrapper>
    </PageTemplate>
  );
}
