"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ImportButton, ExportButton } from "../../../components/csvButtons";
import { AdminPage, Page } from "../pageTemplate";
import styled from "styled-components";
import { Separator, Text } from "@radix-ui/themes";
import { Question } from "@/types/Question";
import { Category } from "@/generated/prisma";
import { Accordion } from "radix-ui";
import { motion } from "framer-motion";

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

function Categories({
  questions,
  categories,
}: {
  questions: Question[];
  categories: Category[];
}) {
  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.map((cat) => cat.name)
  );

  const combinedQuestions = React.useMemo(
    () => ({
      ...questions.reduce((acc, question) => {
        if (!acc[question.categoryName]) {
          acc[question.categoryName] = [];
        }
        acc[question.categoryName].push(question);
        return acc;
      }, {} as Record<string, Question[]>),
    }),
    [questions]
  );

  useEffect(() => {
    setOpenCategories(categories.map((cat) => cat.name));
  }, [categories]);

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
      {questions.map((question) => (
        <QuestionAccordionItem key={question.id} value={question.id}>
          <QuestionAccordionTrigger>
            {question.question}
          </QuestionAccordionTrigger>
          <QuestionAccordionContent>
            <OptionsWrapper>
              {question.options.map((option) => (
                <p key={option.id}>
                  {question.questionType === "multiChoice" &&
                    String.fromCharCode(65 + question.options.indexOf(option)) +
                      ": "}
                  {option.option}
                  {option.isCorrect && question.questionType === "multiChoice"
                    ? " (Correct)"
                    : ""}
                </p>
              ))}
            </OptionsWrapper>
          </QuestionAccordionContent>
        </QuestionAccordionItem>
      ))}
    </QuestionAccordionRoot>
  );
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchQuestions = useCallback(async () => {
    const response = await fetch("/api/questions");
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    setQuestions(data.questions);
    setCategories(data.categories);
  }, []);

  useEffect(() => {
    fetchQuestions().catch((error) => {
      console.error("Error fetching questions:", error);
    });
  }, [fetchQuestions]);

  return (
    <AdminPage currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton onImportComplete={fetchQuestions} />
        <ExportButton />
      </ButtonWrapper>
      <Text size={"2"}>
        Click &quot;Export&quot; to obtain the CSV file format
      </Text>
      <Separator size="4" />
      <Categories questions={questions} categories={categories} />
    </AdminPage>
  );
}
