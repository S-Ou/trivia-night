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
  backgroundColor?: string;
  foregroundColor?: string;
  accentColor?: string;
  setTitle?: (val: string) => void;
  setDescription?: (val: string) => void;
  setHideResults?: (val: boolean) => void;
};

const keyToFieldMap: Record<string, keyof UpdateEventDTO> = {
  title: "title",
  description: "description",
  hideResults: "hideResults",
  themeId: "themeId",
  themeBackgroundColor: "themeBackgroundColor",
  themeForegroundColor: "themeForegroundColor",
  themeAccentColor: "themeAccentColor",
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
  backgroundColor,
  foregroundColor,
  accentColor,
}: HandleConfigUpdateParams) {
  if (!event) {
    toast.error("Event not found");
    return;
  }

  if (required && !value) {
    toast.error("Info failed to save, field is required");
    return;
  }

  // Check if value is unchanged
  const eventFieldMap: Record<string, any> = {
    title: event.title,
    description: event.description,
    hideResults: event.hideResults,
    themeId: event.themeId,
    themeBackgroundColor: event.themeBackgroundColor,
    themeForegroundColor: event.themeForegroundColor,
    themeAccentColor: event.themeAccentColor,
  };
  if (key in eventFieldMap && value === eventFieldMap[key]) {
    return;
  }

  // Build update object
  const updateObj: UpdateEventDTO = {
    title: title.trim(),
    description: description?.trim() || undefined,
    hideResults,
    themeId,
    themeBackgroundColor: backgroundColor,
    themeForegroundColor: foregroundColor,
    themeAccentColor: accentColor,
  };

  // Only override the changed field
  const field = keyToFieldMap[key];
  if (field && field in updateObj) {
    // Handle string fields
    if (
      field === "title" ||
      field === "description" ||
      field === "themeBackgroundColor" ||
      field === "themeForegroundColor" ||
      field === "themeAccentColor" ||
      field === "themeId"
    ) {
      updateObj[field] = typeof value === "string" ? value.trim() : "";
    }
    // Handle boolean fields
    else if (field === "hideResults") {
      updateObj[field] = typeof value === "boolean" ? value : false;
    }
  }

  updateEvent(updateObj)
    .then(() => toast.success("Config saved!"))
    .catch(() => toast.error("Failed to save config"));
}
