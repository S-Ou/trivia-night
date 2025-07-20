import { Category } from "@/generated/prisma";
import BaseSlide from "./baseSlide";
import { Question } from "@/types/Question";
import styled from "styled-components";
import { Separator } from "@radix-ui/themes";

const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
`;

const SummaryTitle = styled.h2`
  font-size: 5rem;
  margin-top: 1rem;
`;

const SummaryList = styled.table`
  padding: 0;
  margin-top: 10vh;
  border-spacing: 2rem 0.2rem;
  width: 50vw;
`;

const SummaryItem = styled.tr`
  font-size: 2.5rem;
  font-weight: 400;
`;

const SummaryLabel = styled.td`
  font-size: 2rem;
  font-weight: 700;
`;

export function SummarySlide({
  category,
  questions,
}: {
  category: Category;
  questions: Question[];
}) {
  return (
    <BaseSlide>
      <CategoryTitle>{category.name}</CategoryTitle>
      <Separator size="3" />
      <SummaryTitle>Summary</SummaryTitle>
      <SummaryList>
        {questions.map((question, index) => (
          <SummaryItem key={index}>
            <SummaryLabel>{index + 1}.</SummaryLabel>
            <td>{question.question}</td>
          </SummaryItem>
        ))}
      </SummaryList>
    </BaseSlide>
  );
}
