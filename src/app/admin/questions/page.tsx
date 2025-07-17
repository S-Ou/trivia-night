"use client";
import React, { useEffect, useState } from "react";
import { ImportButton, ExportButton } from "../../components/csvButtons";
import { AdminPage, Page } from "../pageTemplate";
import styled from "styled-components";
import { Separator, Text } from "@radix-ui/themes";
import { Question } from "@/types/Question";
import { Category } from "@/generated/prisma";
import { Accordion } from "radix-ui";

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const QuestionSetWrapper = styled.div``;

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
      <Accordion.Root
        type="multiple"
        value={openCategories}
        onValueChange={setOpenCategories}
      >
        {categories.map((category) => (
          <Accordion.Item key={category.name} value={category.name}>
            <Accordion.Trigger>{category.name}</Accordion.Trigger>
            <Accordion.Content>
              <Questions questions={combinedQuestions[category.name] || []} />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </QuestionSetWrapper>
  );
}

function Questions({ questions }: { questions: Question[] }) {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  useEffect(() => {
    setOpenQuestions(questions.map((q) => q.id));
  }, [questions]);

  return (
    <Accordion.Root
      type="multiple"
      value={openQuestions}
      onValueChange={(value) => {
        setOpenQuestions(value);
      }}
    >
      {questions.map((question) => (
        <Accordion.Item key={question.id} value={question.id}>
          <Accordion.Trigger>{question.question}</Accordion.Trigger>
          <Accordion.Content>
            <div key={question.id}>
              <ul>
                {question.options.map((option) => (
                  <li key={option.id}>
                    {option.option} {option.isCorrect ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch("/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      return response.json();
    }

    fetchQuestions()
      .then((data) => {
        setQuestions(data.questions);
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);
  return (
    <AdminPage currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton />
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
