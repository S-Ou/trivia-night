"use client";

import { exportCsv, parseCsvFile, RowData } from "@/utils/csvHandler";
import { Button } from "@radix-ui/themes";
import React from "react";

function ImportButton() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleQuestionImport(questions: RowData[]) {
    const response = await fetch("/api/import-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: questions }),
    });

    if (!response.ok) throw new Error("Failed to upload");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, handleQuestionImport);
    e.target.value = "";
  }

  return (
    <div>
      <Button onClick={() => inputRef.current?.click()}>Import</Button>
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

function ExportButton() {
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

  return <Button onClick={handleExport}>Export</Button>;
}

export default function AdminPage() {
  return (
    <>
      <h1>Admin Page</h1>
      <ImportButton />
      <ExportButton />
    </>
  );
}
