import { EventProvider } from "./EventContext";
import { QuestionProvider } from "./QuestionContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <QuestionProvider>
      <EventProvider>{children}</EventProvider>
    </QuestionProvider>
  );
}
