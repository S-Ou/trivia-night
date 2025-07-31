import { toast } from "sonner";
import { Event } from "@/generated/prisma";
import { UpdateEventDTO } from "@/services/eventService";

export type HandleConfigUpdateParams = {
  key: string;
  value: string | boolean;
  required?: boolean;
  event: Event | undefined;
  updateEvent: (data: UpdateEventDTO) => Promise<void>;
  title: string;
  description: string | null;
  hideResults: boolean;
  themeId?: string;
  setTitle?: (val: string) => void;
  setDescription?: (val: string) => void;
  setHideResults?: (val: boolean) => void;
};

export function handleConfigUpdate({
  key,
  value,
  required,
  event,
  updateEvent,
  title,
  description,
  hideResults,
  themeId,
}: HandleConfigUpdateParams) {
  if (!event) {
    toast.error("Event not found");
    return;
  }

  if (required && !value) {
    toast.error("Info failed to save, field is required");
    return;
  }

  if (
    (key === "title" && value === event.title) ||
    (key === "description" && value === event.description) ||
    (key === "hideResults" && value === event.hideResults) ||
    (key === "themeId" && value === event.themeId)
  ) {
    return;
  }

  let updatePromise: Promise<void> | undefined;
  switch (key) {
    case "title": {
      updatePromise = updateEvent({
        title: (value as string).trim(),
        description: description?.trim() || undefined,
        hideResults,
        themeId,
      });
      break;
    }
    case "description": {
      updatePromise = updateEvent({
        title: title.trim(),
        description: (value as string).trim() || undefined,
        hideResults,
        themeId,
      });
      break;
    }
    case "hideResults": {
      updatePromise = updateEvent({
        title: title.trim(),
        description: description?.trim() || undefined,
        hideResults: value as boolean,
        themeId,
      });
      break;
    }
    case "themeId": {
      updatePromise = updateEvent({
        title: title.trim(),
        description: description?.trim() || undefined,
        hideResults,
        themeId: value as string,
      });
      break;
    }
  }
  if (updatePromise) {
    updatePromise
      .then(() => toast.success("Config saved!"))
      .catch(() => toast.error("Failed to save config"));
  }
}
