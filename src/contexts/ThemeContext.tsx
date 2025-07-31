import { BaseTheme, DuplicateBaseTheme } from "@/components/slides/basic/baseTheme";
import { BaseSlideTheme } from "@/components/slides/baseSlideTheme";
import { createContext, ReactNode, useState, useContext } from "react";

interface SlideThemeContextType {
  currentTheme: BaseSlideTheme;
  currentThemeId: string;
  availableThemes: BaseSlideTheme[];
  setTheme: (themeId: string) => void;
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
  const [themes] = useState<Map<string, BaseSlideTheme>>(() => {
    const themeMap = new Map();

    themeMap.set(BaseTheme.id, new BaseTheme());
    themeMap.set(DuplicateBaseTheme.id, new DuplicateBaseTheme());

    return themeMap;
  });

  const [currentThemeId, setCurrentThemeId] = useState(defaultTheme);

  const setTheme = (themeId: string) => {
    if (!themes.has(themeId)) {
      throw new Error(
        `Theme '${themeId}' not found. Available themes: ${Array.from(
          themes.keys()
        ).join(", ")}`
      );
    }
    console.log(`Setting theme to: ${themeId}`);
    setCurrentThemeId(themeId);
  };

  const currentTheme = themes.get(currentThemeId);
  if (!currentTheme) {
    throw new Error(`Current theme '${currentThemeId}' not found`);
  }

  const value: SlideThemeContextType = {
    currentTheme,
    currentThemeId: currentThemeId,
    availableThemes: Array.from(themes.values()),
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
