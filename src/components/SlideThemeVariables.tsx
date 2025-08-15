"use client";
import React, { useMemo } from "react";
import { useEventContext } from "@/contexts/EventContext";

/**
 * Provides CSS custom properties (variables) for slide theming:
 * --slide-bg-color
 * --slide-fg-color
 * --slide-accent-color
 */
export function SlideThemeVariables({
  children,
}: {
  children: React.ReactNode;
}) {
  const { event } = useEventContext();

  const styleVars = useMemo<React.CSSProperties>(() => {
    const bg = event?.themeBackgroundColor || "#ffffff";
    const fg = event?.themeForegroundColor || "#000000";
    const accent = event?.themeAccentColor || "#3e63dd";
    return {
      // Custom properties consumed by slide components
      ["--slide-bg-color" as any]: bg,
      ["--slide-fg-color" as any]: fg,
      ["--slide-accent-color" as any]: accent,
    };
  }, [
    event?.themeBackgroundColor,
    event?.themeForegroundColor,
    event?.themeAccentColor,
  ]);

  return <div style={styleVars}>{children}</div>;
}
