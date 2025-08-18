import { Button } from "@radix-ui/themes";
import { toast } from "sonner";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useEventId } from "@/contexts/EventIdContext";
import { exportCsv, parseCsvFile, RowData } from "@/utils/csvHandler";

const StyledButton = styled(Button).attrs({
  size: "3",
  variant: "solid",
})``;

export function ImportButton() {
  const { fetchQuestions } = useQuestionContext();
  const { eventId } = useEventId();

  const inputRef = useRef<HTMLInputElement>(null);

  function onError(error: Error) {
    console.error("Error parsing CSV:", error);
    toast.error(`Failed to parse CSV file. ${error.message}`, {
      duration: Infinity,
    });
  }

  async function handleQuestionImport(questions: RowData[]) {
    const response = await fetch(`/api/${eventId}/import-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: questions }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || response.statusText;
      onError(new Error(errorMessage));
      throw new Error(errorMessage);
    }
    toast.success("Questions imported successfully!");
    fetchQuestions();
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, handleQuestionImport);
    e.target.value = "";
  }

  return (
    <div>
      <StyledButton onClick={() => inputRef.current?.click()}>
        Import from CSV
      </StyledButton>
      <input
        accept=".csv,.tsv"
        onChange={handleImport}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
    </div>
  );
}

export function ExportButton() {
  const { eventId } = useEventId();

  async function fetchQuestions() {
    const response = await fetch(`/api/${eventId}/export-questions`);
    if (!response.ok) {
      toast.error("Failed to fetch questions");
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  }

  async function handleExport() {
    await fetchQuestions()
      .then((questions) => {
        exportCsv(questions, `questions-${eventId}.csv`);
        toast.success("Questions exported to CSV!");
      })
      .catch((error) => {
        toast.error(`Export failed: ${error.message}`);
      });
  }

  return <StyledButton onClick={handleExport}>Export to CSV</StyledButton>;
}

export function ExampleQuestionsButton() {
  const { fetchQuestions } = useQuestionContext();
  const { eventId } = useEventId();
  const [isLoading, setIsLoading] = useState(false);

  async function handleExampleImport() {
    if (isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Importing example questions...");

    try {
      const response = await fetch("/questions-example.csv");
      if (!response.ok) {
        toast.error("Failed to fetch example questions");
        throw new Error("Failed to fetch example questions");
      }
      const csvText = await response.text();
      const file = new File([csvText], "questions-example.csv", {
        type: "text/csv",
      });

      await new Promise<void>((resolve, reject) => {
        parseCsvFile(file, async (questions) => {
          try {
            const importResponse = await fetch(
              `/api/${eventId}/import-questions`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions }),
              }
            );

            if (!importResponse.ok) {
              const errorBody = await importResponse.json();
              const errorMessage = errorBody.error || importResponse.statusText;
              toast.error(
                `Failed to import example questions: ${errorMessage}`
              );
              reject(new Error(errorMessage));
              return;
            }
            toast.success("Example questions imported successfully!");
            fetchQuestions();
            resolve();
          } catch (error) {
            console.error("Error in parseCsvFile callback:", error);
            toast.error("Failed to import example questions");
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error("Error importing example questions:", error);
      // Error toasts are already handled above
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="surface"
      onClick={handleExampleImport}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Load Example Questions"}
    </Button>
  );
}
