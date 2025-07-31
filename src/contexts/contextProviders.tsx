"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { EventProvider } from "./EventContext";
import { QuestionProvider } from "./QuestionContext";
import { ResultsProvider } from "./ResultsContext";
import { SlideThemeProvider } from "./ThemeContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
          },
        },
      })
  );

  return (
    <SlideThemeProvider defaultTheme="base">
      <QueryClientProvider client={queryClient}>
        <QuestionProvider>
          <EventProvider>
            <ResultsProvider>{children}</ResultsProvider>
          </EventProvider>
        </QuestionProvider>
      </QueryClientProvider>
    </SlideThemeProvider>
  );
}
