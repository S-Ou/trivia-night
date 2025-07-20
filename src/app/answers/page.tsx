"use client";

import { PageTemplate, Page } from "../pageTemplate";
import { Text } from "@radix-ui/themes";
import { useQuestionContext } from "@/contexts/QuestionContext";
import React, { Fragment } from "react";
import styled from "styled-components";
import { letterIndex } from "@/utils";
import { indexToPermutation } from "@/utils/permutations";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.5rem;
    border-bottom: 2px solid var(--accent-5);
  }

  th {
    font-weight: bold;
  }
`;

const LegendHeader = styled.tr`
  text-align: left;
`;

const CategoryHeader = styled.tr`
  text-align: center;

  th {
    font-weight: 800;
    font-size: 1.5rem;
  }
`;

const BoldTD = styled.td`
  font-weight: 600;
`;

export default function AnswersPage() {
  const { combinedQuestions, categories, isLoading } = useQuestionContext();

  if (isLoading) {
    return <Text size="2">Loading...</Text>;
  }

  return (
    <PageTemplate currentPage={Page.Answers}>
      <StyledTable>
        <thead>
          <LegendHeader>
            <th>#</th>
            <th>Question</th>
            <th colSpan={2}>Answer</th>
          </LegendHeader>
        </thead>
        <tbody>
          {categories.map((category) => (
            <Fragment key={category.name}>
              <CategoryHeader key={category.name}>
                <th colSpan={4}>{category.name}</th>
              </CategoryHeader>
              {combinedQuestions[category.name].map((question, index) => {
                const correctAnswer = question.options.find(
                  (option) => option.isCorrect
                )!;
                const permutations = indexToPermutation(
                  question.optionOrder,
                  question.options.length
                );
                const correctAnswerIndex = letterIndex(permutations.indexOf(0));

                return (
                  <tr key={category.name + question.id}>
                    <BoldTD>{index + 1}</BoldTD>
                    <td>{question.question}</td>
                    {question.questionType === "multiChoice" ? (
                      <>
                        <BoldTD>{correctAnswerIndex}</BoldTD>
                        <td>{correctAnswer.option}</td>
                      </>
                    ) : (
                      <td colSpan={2}>{correctAnswer.option}</td>
                    )}
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </StyledTable>
    </PageTemplate>
  );
}
