"use client";

import { exportCsv, parseCsvFile, RowData } from "@/utils/csvHandler";
import { Button } from "@radix-ui/themes";
import React from "react";

function UploadButton() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleQuestionUpload(questions: RowData[]) {
    const response = await fetch("/api/upload-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: questions }),
    });

    if (!response.ok) throw new Error("Failed to upload");
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, handleQuestionUpload);
  }

  return (
    <div>
      <Button onClick={() => inputRef.current?.click()}>Upload</Button>
      <input
        accept=".csv"
        onChange={handleUpload}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
    </div>
  );
}

function ExportButton() {
  async function fetchQuestions() {
    const response = await fetch("/api/download-questions");
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
      <UploadButton />
      <ExportButton />
    </>
  );
}
