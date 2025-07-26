import { EventProvider } from "./EventContext";
import { QuestionProvider } from "./QuestionContext";
import { ResultsProvider } from "./ResultsContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <QuestionProvider>
      <EventProvider>
        <ResultsProvider>{children}</ResultsProvider>
      </EventProvider>
    </QuestionProvider>
  );
}
