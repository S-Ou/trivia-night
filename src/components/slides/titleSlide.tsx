import { Category } from "@/generated/prisma";
import styled from "styled-components";
import BaseSlide from "./baseSlide";
import { Separator } from "@radix-ui/themes";
import { Question } from "@/types/Question";

const Title = styled.h1`
  font-size: 10rem;
  font-stretch: expanded;
  font-weight: 800;
  margin-top: 20vh;
`;

const Subtitle = styled.p`
  font-size: 2rem;
  margin-top: 1rem;
`;

export function TitleSlide({
  category,
  questions,
  showAnswers = false,
}: {
  category: Category;
  questions: Question[];
  showAnswers?: boolean;
}) {
  return (
    <BaseSlide>
      <Title>{category.name}</Title>
      <Separator size="3" />
      <Subtitle>
        {showAnswers
          ? "Answers"
          : `${questions.length} question${questions.length !== 1 ? "s" : ""}`}
      </Subtitle>
    </BaseSlide>
  );
}
