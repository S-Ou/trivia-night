"use client";
import React from "react";
import { ImportButton, ExportButton } from "../../components/csvButtons";
import { AdminPage, Page } from "../pageTemplate";

export default function QuestionsPage() {
  return (
    <AdminPage currentPage={Page.Questions}>
      <ImportButton />
      <ExportButton />
    </AdminPage>
  );
}
