"use client";
import React, { CSSProperties, useMemo } from "react";
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

  const styleVars = useMemo(() => {
    const bg = event?.themeBackgroundColor || "#ffffff";
    const fg = event?.themeForegroundColor || "#000000";
    const accent = event?.themeAccentColor || "#3e63dd";
    return {
      // Custom properties consumed by slide components
      "--slide-bg-color": bg,
      "--slide-fg-color": fg,
      "--slide-accent-color": accent,
    } as CSSProperties;
  }, [
    event?.themeBackgroundColor,
    event?.themeForegroundColor,
    event?.themeAccentColor,
  ]);

  return <div style={styleVars}>{children}</div>;
}
