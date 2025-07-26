import { toast } from "sonner";

export type HandleConfigUpdateParams = {
  key: string;
  value: string | boolean;
  required?: boolean;
  event: any;
  updateEvent: (data: any) => Promise<void>;
  title: string;
  description: string | null;
  hideResults: boolean;
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
}: HandleConfigUpdateParams) {
  if (required && !value) {
    toast.error("Info failed to save, field is required");
    return;
  }

  if (
    (key === "title" && value === event.title) ||
    (key === "description" && value === event.description) ||
    (key === "hideResults" && value === event.hideResults)
  ) {
    return;
  }

  let updatePromise: Promise<void> | undefined;
  switch (key) {
    case "title": {
      updatePromise = updateEvent({
        title: (value as string).trim(),
        description: description?.trim() || null,
        hideResults,
      });
      break;
    }
    case "description": {
      updatePromise = updateEvent({
        title: title.trim(),
        description: (value as string).trim() || null,
        hideResults,
      });
      break;
    }
    case "hideResults": {
      updatePromise = updateEvent({
        title: title.trim(),
        description: description?.trim() || null,
        hideResults: value as boolean,
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
