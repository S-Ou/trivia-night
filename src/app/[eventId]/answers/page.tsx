"use client";

import { useQuestionContext } from "@/contexts/QuestionContext";
import React, { Fragment } from "react";
import styled from "styled-components";
import { letterIndex } from "@/utils";
import { indexToPermutation } from "@/utils/permutations";
import { Hash, PencilLine, SquareCheck } from "lucide-react";
import { PageTemplate } from "@/app/pageTemplate";
import { EventPageTemplate, Page } from "../pageTemplate";

const StyledTable = styled.table`
  border-collapse: collapse;
  margin-top: 1rem;
  width: 100%;

  th,
  td {
    border-bottom: 2px solid var(--accent-5);
    padding: 0.5rem;
  }

  th {
    font-weight: bold;
  }
`;

const LegendHeader = styled.tr`
  text-align: left;
`;

const CategoryHeader = styled.tr`
  font-stretch: expanded;
  text-align: center;

  th {
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

const BoldTD = styled.td`
  font-weight: 600;
  text-align: center;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
`;

export default function AnswersPage() {
  const { combinedQuestions, categories } = useQuestionContext();

  return (
    <EventPageTemplate currentPage={Page.Answers}>
      <StyledTable>
        <thead>
          <LegendHeader>
            <th>
              <IconWrapper>
                <Hash size={16} />
              </IconWrapper>
            </th>
            <th>Question</th>
            <th>
              <IconWrapper>
                <SquareCheck size={16} />
              </IconWrapper>
            </th>
            <th>Answer</th>
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
                      <BoldTD>{correctAnswerIndex}</BoldTD>
                    ) : (
                      <td>
                        <IconWrapper>
                          <PencilLine size={16} />
                        </IconWrapper>
                      </td>
                    )}
                    <td>{correctAnswer.option}</td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </StyledTable>
    </EventPageTemplate>
  );
}
