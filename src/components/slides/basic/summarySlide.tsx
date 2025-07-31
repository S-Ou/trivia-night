import BaseSlide from "./baseSlide";
import styled from "styled-components";
import { Separator } from "@radix-ui/themes";
import { SlideProps } from "../slideProps";

const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-stretch: expanded;
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
  font-weight: 300;
`;

const SummaryLabel = styled.td`
  font-size: 2rem;
  font-weight: 700;
`;

export function SummarySlide({
  category: { currentCategory },
  question: { currentQuestions },
}: SlideProps) {
  return (
    <BaseSlide>
      <CategoryTitle>{currentCategory!.name}</CategoryTitle>
      <Separator size="3" />
      <SummaryTitle>Summary</SummaryTitle>
      <SummaryList>
        {currentQuestions!.map((question, index) => (
          <SummaryItem key={index}>
            <SummaryLabel>{index + 1}.</SummaryLabel>
            <td>{question.question}</td>
          </SummaryItem>
        ))}
      </SummaryList>
    </BaseSlide>
  );
}
