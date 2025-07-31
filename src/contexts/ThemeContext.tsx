import { BaseTheme } from "@/components/slides/basic/baseTheme";
import { ISlideTheme } from "@/components/slides/slideTheme";
import { createContext, ReactNode, useState, useContext } from "react";

interface SlideThemeContextType {
  currentTheme: ISlideTheme;
  currentThemeName: string;
  availableThemes: string[];
  setTheme: (themeName: string) => void;
}
const SlideThemeContext = createContext<SlideThemeContextType | undefined>(
  undefined
);
interface SlideThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function SlideThemeProvider({
  children,
  defaultTheme = "base",
}: SlideThemeProviderProps) {
  const [themes] = useState<Map<string, ISlideTheme>>(() => {
    const themeMap = new Map();

    themeMap.set("base", new BaseTheme());

    return themeMap;
  });

  const [currentThemeName, setCurrentThemeName] = useState(defaultTheme);

  const setTheme = (themeName: string) => {
    if (!themes.has(themeName)) {
      throw new Error(
        `Theme '${themeName}' not found. Available themes: ${Array.from(
          themes.keys()
        ).join(", ")}`
      );
    }
    setCurrentThemeName(themeName);
  };

  const currentTheme = themes.get(currentThemeName);
  if (!currentTheme) {
    throw new Error(`Current theme '${currentThemeName}' not found`);
  }

  const value: SlideThemeContextType = {
    currentTheme,
    currentThemeName,
    availableThemes: Array.from(themes.keys()),
    setTheme,
  };

  return (
    <SlideThemeContext.Provider value={value}>
      {children}
    </SlideThemeContext.Provider>
  );
}

export function useSlideTheme() {
  const context = useContext(SlideThemeContext);
  if (context === undefined) {
    throw new Error("useSlideTheme must be used within a SlideThemeProvider");
  }
  return context;
}

export function useSlideComponents() {
  const { currentTheme } = useSlideTheme();
  return currentTheme;
}
