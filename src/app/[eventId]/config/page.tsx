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
import { AlertDialog, Button, Flex, Separator } from "@radix-ui/themes";
import { Skull, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSlideTheme } from "@/contexts/ThemeContext";
import { cleanHexString, getContrastRatio } from "@/utils/color";
import styled from "styled-components";

const TextContrastExample = styled.div<{
  $backgroundColor: string;
  $foregroundColor: string;
}>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: var(--radius-2);
  color: ${({ $foregroundColor }) => $foregroundColor};
  padding-block: 0.5rem;
  padding-inline: 1rem;
`;

const TextContrastHighlightText = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: bold;
`;

export default function ConfigPage() {
  const router = useRouter();
  const { event, isLoading, updateEvent } = useEventContext();
  const { currentTheme, availableThemes, setTheme } = useSlideTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hideResults, setHideResults] = useState(event?.hideResults || false);

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#3e63dd");

  useEffect(() => {
    if (event && !isLoading) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setHideResults(event.hideResults || false);
      setBackgroundColor(event.themeBackgroundColor || "#ffffff");
      setForegroundColor(event.themeForegroundColor || "#000000");
      setAccentColor(event.themeAccentColor || "#3e63dd");
    }
  }, [event, isLoading]);

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
      themeId: currentTheme.id,
      backgroundColor,
      foregroundColor,
      accentColor,
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
    {
      key: "theme",
      label: "Slide theme",
      type: ConfigComponentType.Select,
      value: currentTheme.id,
      options: availableThemes.reduce((acc, theme) => {
        acc[theme.id] = theme.title;
        return acc;
      }, {} as Record<string, string>),
      onChange: (val) => {
        setTheme(val as string);
        handleUpdate("themeId", val as string);
      },
    },
    {
      key: "themeAccentColor",
      label: "Accent color",
      type: ConfigComponentType.ColorPicker,
      value: accentColor || "#3e63dd",
      onChange: (val) => setAccentColor(val as string),
      onBlur: () => {
        const cleaned = cleanHexString(accentColor);
        setAccentColor(cleaned);
        handleUpdate("themeAccentColor", cleaned);
      },
    },
    {
      key: "themeForegroundColor",
      label: "Foreground color",
      type: ConfigComponentType.ColorPicker,
      value: foregroundColor || "#000000",
      onChange: (val) => setForegroundColor(val as string),
      onBlur: () => {
        const cleaned = cleanHexString(foregroundColor);
        setForegroundColor(cleaned);
        handleUpdate("themeForegroundColor", cleaned);
      },
    },
    {
      key: "themeBackgroundColor",
      label: "Background color",
      type: ConfigComponentType.ColorPicker,
      value: backgroundColor || "#ffffff",
      onChange: (val) => setBackgroundColor(val as string),
      onBlur: () => {
        const cleaned = cleanHexString(backgroundColor);
        setBackgroundColor(cleaned);
        handleUpdate("themeBackgroundColor", cleaned);
      },
    },
  ];

  function handleDeleteEvent() {
    if (event?.id) {
      fetch(`/api/${event.id}/event`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Event deleted successfully!");
            router.push("/");
          } else {
            throw new Error("Failed to delete event");
          }
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          toast.error("Failed to delete event.");
        });
    }
  }

  const colorContrast = Math.min(
    getContrastRatio(foregroundColor, backgroundColor),
    getContrastRatio(accentColor, backgroundColor)
  );

  const colorContrastLabel =
    colorContrast > 7
      ? "easy"
      : colorContrast > 4.5
      ? "reasonable"
      : colorContrast > 3
      ? "not preferable"
      : "difficult";

  return (
    <EventPageTemplate currentPage={Page.Config}>
      <ConfigForm fields={configFields} />

      <TextContrastExample
        $backgroundColor={backgroundColor}
        $foregroundColor={foregroundColor}
      >
        This text color is{" "}
        <TextContrastHighlightText $color={accentColor}>
          {colorContrastLabel}
        </TextContrastHighlightText>{" "}
        to read
      </TextContrastExample>

      <Separator size="3" />

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red">
            <TriangleAlert size={18} />
            Delete event
            <Skull size={18} />
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete event</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This event will be permanently deleted and cannot be
            recovered.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDeleteEvent}>
                Delete event
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </EventPageTemplate>
  );
}
