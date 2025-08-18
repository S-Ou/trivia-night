"use client";
import React from "react";
import {
  ImportButton,
  ExportButton,
  ExampleQuestionsButton,
} from "../../../components/csvButtons";
import { Separator, Text } from "@radix-ui/themes";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { EventPageTemplate, Page } from "../pageTemplate";
import { Categories, ButtonWrapper } from "@/components/questions";

export default function QuestionsPage() {
  const { questions } = useQuestionContext();

  return (
    <EventPageTemplate currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton />
        <ExportButton />
      </ButtonWrapper>
      <Text size={"2"}>
        Click &quot;Export&quot; to obtain the CSV file format. Export, edit,
        then reimport to update questions.
      </Text>
      {!questions.length && <ExampleQuestionsButton />}
      <Separator size="4" />
      <Text size="4" style={{ textAlign: "center" }}>
        Reorder categories, questions, and options by dragging and dropping them
        below.
      </Text>
      <Categories />
    </EventPageTemplate>
  );
}
