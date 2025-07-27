"use client";
import React, { useEffect, useState } from "react";
import { useEventContext } from "@/contexts/EventContext";
import {
  ConfigForm,
  ConfigComponentType,
  ConfigField,
} from "@/components/ConfigForm";
import { handleConfigUpdate } from "@/components/handleConfigUpdate";
import { EventPageTemplate, Page } from "../pageTemplate";

export default function ConfigPage() {
  const { event, isLoading, updateEvent } = useEventContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hideResults, setHideResults] = useState(event.hideResults || false);

  useEffect(() => {
    if (event && !isLoading) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setHideResults(event.hideResults || false);
    }
  }, [event?.id, isLoading]);

  const handleUpdate = (
    key: string,
    value: string | boolean,
    required?: boolean
  ) => {
    handleConfigUpdate({
      key,
      value,
      required,
      event,
      updateEvent,
      title,
      description,
      hideResults,
    });
  };

  const configFields: ConfigField[] = [
    {
      key: "title",
      label: "Title",
      type: ConfigComponentType.TextField,
      value: title,
      required: true,
      disabled: isLoading,
      onChange: (val) => setTitle(val as string),
      onBlur: () => {
        const trimmed = title.trim();
        setTitle(trimmed);
        handleUpdate("title", trimmed, true);
      },
    },
    {
      key: "description",
      label: "Description",
      type: ConfigComponentType.TextArea,
      value: description,
      disabled: isLoading,
      onChange: (val) => setDescription(val as string),
      onBlur: () => {
        const trimmed = description.trim();
        setDescription(trimmed);
        handleUpdate("description", trimmed);
      },
    },
    {
      key: "hideResults",
      label: "Hide results",
      type: ConfigComponentType.Switch,
      value: hideResults,
      disabled: isLoading,
      onChange: (val) => {
        setHideResults(val as boolean);
        handleUpdate("hideResults", val as boolean);
      },
    },
  ];

  return (
    <EventPageTemplate currentPage={Page.Config}>
      <ConfigForm fields={configFields} />
    </EventPageTemplate>
  );
}
