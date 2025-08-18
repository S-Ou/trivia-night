import BaseSlide from "./baseSlide";
import styled from "styled-components";
import { Separator } from "@radix-ui/themes";
import { CategorySlideProps } from "../slideProps";

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
  border-spacing: 2rem 1rem;
  margin-top: 3rem;
  padding: 0;
  width: 60vw;
`;

const SummaryItem = styled.tr`
  font-size: 2rem;
  font-weight: 300;
`;

const SummaryLabel = styled.td`
  font-size: 2rem;
  font-weight: 700;
`;

export function SummarySlide({
  category: { currentCategory },
  question: { currentQuestions },
}: CategorySlideProps) {
  return (
    <BaseSlide>
      <CategoryTitle>{currentCategory!.name}</CategoryTitle>
      <Separator size="3" />
      <SummaryTitle>Summary</SummaryTitle>
      <SummaryList>
        <tbody>
          {currentQuestions!.map((question, index) => (
            <SummaryItem key={index}>
              <SummaryLabel>{index + 1}.</SummaryLabel>
              <td>{question.question}</td>
            </SummaryItem>
          ))}
        </tbody>
      </SummaryList>
    </BaseSlide>
  );
}
