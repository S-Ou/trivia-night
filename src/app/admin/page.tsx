"use client";

import {
  downloadBlankCsvTemplate,
  parseCsvFile,
  RowData,
} from "@/utils/csvHandler";
import { Button } from "@radix-ui/themes";
import React from "react";

function UploadButton() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleQuestionUpload(questions: RowData[]) {
    console.log("Uploading questions:");
    const response = await fetch("/api/upload-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: questions }),
    });

    if (!response.ok) throw new Error("Failed to upload");
    console.log("Upload successful!");
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, handleQuestionUpload);
  };

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

function DownloadButton() {
  return (
    <Button onClick={() => downloadBlankCsvTemplate()}>
      Download Template
    </Button>
  );
}

export default function AdminPage() {
  return (
    <>
      <h1>Admin Page</h1>
      <UploadButton />
      <DownloadButton />
    </>
  );
}
