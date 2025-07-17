import { useQuestionContext } from "@/contexts/QuestionContext";
import { exportCsv, parseCsvFile, RowData } from "@/utils/csvHandler";
import { Button } from "@radix-ui/themes";
import { useRef } from "react";
import styled from "styled-components";

const StyledButton = styled(Button).attrs({
  size: "3",
  variant: "solid",
})``;

export function ImportButton() {
  const { fetchQuestions } = useQuestionContext();

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleQuestionImport(questions: RowData[]) {
    const response = await fetch("/api/import-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: questions }),
    });

    if (!response.ok) throw new Error("Failed to upload");
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
        accept=".csv"
        onChange={handleImport}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
    </div>
  );
}

export function ExportButton() {
  async function fetchQuestions() {
    const response = await fetch("/api/export-questions");
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  }

  async function handleExport() {
    await fetchQuestions().then((questions) => {
      exportCsv(questions);
    });
  }

  return <StyledButton onClick={handleExport}>Export from CSV</StyledButton>;
}
