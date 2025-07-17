"use client";
import React, { useEffect, useState } from "react";
import { ImportButton, ExportButton } from "../../components/csvButtons";
import { PageTemplate, Page } from "../pageTemplate";
import styled from "styled-components";
import { Separator, Text } from "@radix-ui/themes";
import { Question } from "@/types/Question";
import { Option, QuestionType } from "@/generated/prisma";
import { Accordion } from "radix-ui";
import { motion } from "framer-motion";
import { indexToPermutation } from "@/utils/permutations";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { letterIndex } from "@/utils";

const MotionContent = motion(Accordion.Content);

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const QuestionSetWrapper = styled.div`
  padding-inline: 1rem;
  width: 100%;
`;

const CategoryAccordionRoot = styled(Accordion.Root)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryAccordionItem = styled(Accordion.Item)`
  width: 100%;
  background-color: var(--accent-3);
  border-radius: max(var(--radius-3), var(--radius-full));
`;

const CategoryAccordionTrigger = styled(Accordion.Trigger)`
  width: 100%;
  padding: 0.5rem;
  background-color: var(--accent-9);
  border-radius: max(var(--radius-3), var(--radius-full));
  border: none;
  font-size: 2rem;
  font-weight: 600;
`;

const CategoryAccordionContent = styled(MotionContent)`
  padding: 1rem;
`;

const QuestionAccordionRoot = styled(Accordion.Root)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const QuestionAccordionItem = styled(Accordion.Item)`
  width: 100%;
  padding: 0.5rem;
  border-radius: max(var(--radius-3), var(--radius-full));
  border: 2px solid var(--accent-7);
`;

const QuestionAccordionTrigger = styled(Accordion.Trigger)`
  background-color: inherit;
  border: none;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
`;

const QuestionAccordionContent = styled(MotionContent)``;

const OptionsWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  background-color: var(--accent-4);
  border-radius: max(var(--radius-3), var(--radius-full));
  color: var(--foreground);
  flex-direction: column;
  font-size: 1rem;
  padding: 0.5rem;
`;

function Categories() {
  const { combinedQuestions, categories, isLoading } = useQuestionContext();

  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.map((cat) => cat.name)
  );

  useEffect(() => {
    setOpenCategories(categories.map((cat) => cat.name));
  }, [categories]);

  if (isLoading) {
    return <Text size="2">Loading...</Text>;
  }

  if (categories.length === 0) {
    return (
      <Text size="2">
        No questions uploaded. Import them using the button above! You can
        download the template from the export button.
      </Text>
    );
  }

  return (
    <QuestionSetWrapper>
      <CategoryAccordionRoot
        type="multiple"
        value={openCategories}
        onValueChange={setOpenCategories}
      >
        {categories.map((category) => (
          <CategoryAccordionItem key={category.name} value={category.name}>
            <CategoryAccordionTrigger>{category.name}</CategoryAccordionTrigger>
            <CategoryAccordionContent>
              <Questions questions={combinedQuestions[category.name] || []} />
            </CategoryAccordionContent>
          </CategoryAccordionItem>
        ))}
      </CategoryAccordionRoot>
    </QuestionSetWrapper>
  );
}

function Questions({ questions }: { questions: Question[] }) {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  useEffect(() => {
    setOpenQuestions(questions.map((q) => q.id));
  }, [questions]);

  return (
    <QuestionAccordionRoot
      type="multiple"
      value={openQuestions}
      onValueChange={(value) => {
        setOpenQuestions(value);
      }}
    >
      {questions.map((question, index) => (
        <QuestionAccordionItem key={question.id} value={question.id}>
          <QuestionAccordionTrigger>
            {index + 1}. {question.question}
          </QuestionAccordionTrigger>
          <QuestionAccordionContent>
            <Options
              options={question.options}
              order={question.optionOrder}
              type={question.questionType}
            />
          </QuestionAccordionContent>
        </QuestionAccordionItem>
      ))}
    </QuestionAccordionRoot>
  );
}

function Options({
  options,
  order,
  type,
}: {
  options: Option[];
  order: number;
  type: QuestionType;
}) {
  const permutations = indexToPermutation(order, options.length);
  const isMultiChoice = type === "multiChoice";

  return (
    <OptionsWrapper>
      {permutations.map((optionIndex, index) => (
        <p key={optionIndex}>
          {isMultiChoice && letterIndex(index) + ": "}
          {options[optionIndex].option}
          {options[optionIndex].isCorrect && isMultiChoice ? " (Correct)" : ""}
        </p>
      ))}
    </OptionsWrapper>
  );
}

export default function QuestionsPage() {
  return (
    <PageTemplate currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton />
        <ExportButton />
      </ButtonWrapper>
      <Text size={"2"}>
        Click &quot;Export&quot; to obtain the CSV file format
      </Text>
      <Separator size="4" />
      <Text size="5" weight="bold" style={{ textAlign: "center" }}>
        Reorder questions and categories by dragging and dropping them below.
      </Text>
      <Categories />
    </PageTemplate>
  );
}
