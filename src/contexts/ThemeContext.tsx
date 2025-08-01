"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { SlideThemeBase } from "@/components/slides/baseSlideTheme";
import {
  DefaultTheme,
  DuplicateDefaultTheme,
} from "@/components/slides/default/defaultTheme";

const themes = [DefaultTheme, DuplicateDefaultTheme];

type SlideThemeContextType = {
  currentTheme: SlideThemeBase;
  availableThemes: (typeof SlideThemeBase)[];
  setTheme: (themeId: string) => void;
};

const SlideThemeContext = createContext<SlideThemeContextType | undefined>(
  undefined
);

interface SlideThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  eventThemeId?: string | null;
}

export function SlideThemeProvider({
  children,
  defaultTheme = DefaultTheme.id,
  eventThemeId,
}: SlideThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<SlideThemeBase>(() => {
    const themeToLoad = eventThemeId || defaultTheme;
    const ThemeClass =
      themes.find((theme) => theme.id === themeToLoad) ||
      themes.find((theme) => theme.id === defaultTheme) ||
      themes[0];
    return new ThemeClass();
  });

  useEffect(() => {
    if (eventThemeId) {
      const ThemeClass = themes.find((theme) => theme.id === eventThemeId);
      if (ThemeClass) {
        setCurrentTheme(new ThemeClass());
      }
    }
  }, [eventThemeId]);

  const setTheme = (themeId: string) => {
    const ThemeClass = themes.find((theme) => theme.id === themeId);
    if (ThemeClass) {
      setCurrentTheme(new ThemeClass());
    }
  };

  return (
    <SlideThemeContext.Provider
      value={{
        currentTheme,
        availableThemes: themes,
        setTheme,
      }}
    >
      {children}
    </SlideThemeContext.Provider>
  );
}

export function useSlideTheme() {
  const context = useContext(SlideThemeContext);
  if (!context) {
    throw new Error("useSlideTheme must be used within a SlideThemeProvider");
  }
  return context;
}

export function useSlideComponents() {
  const { currentTheme } = useSlideTheme();
  return currentTheme;
}
