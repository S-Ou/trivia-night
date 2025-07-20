import { Category } from "@/generated/prisma";
import BaseSlide from "./baseSlide";
import styled from "styled-components";
import { Separator } from "@radix-ui/themes";
import { indexToPermutation } from "@/utils/permutations";
import { Question } from "@/types/Question";
import { letterIndex } from "@/utils";
import { PencilLine } from "lucide-react";

const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
`;

const QuestionWrapper = styled.div<{ $hasImage?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${(props) => (props.$hasImage ? "0rem" : "8rem")};
  margin-bottom: ${(props) => (props.$hasImage ? "0rem" : "3rem")};
  min-height: 20vh;
  padding-inline: 10rem;
`;

const QuestionText = styled.h2`
  font-size: 8rem;
  line-height: 1.1;
  text-align: center;
  text-wrap: balance;
`;

const Image = styled.img`
  height: auto;
  max-height: 30vh;
  max-width: 800%;
`;

const OptionsWrapper = styled.div`
  display: grid;
  gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40rem, max-content));
  justify-content: center;
  margin-top: 2rem;
  max-width: 100%;
  padding-inline: 15vw;
`;

const OptionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

const OptionDenominator = styled.strong`
  font-size: 5rem;
  font-weight: 1000;
  opacity: 0.5;
`;

const OptionContent = styled.span`
  font-size: 2.5rem;
  line-height: 1.2;
  max-width: 100%;
  overflow-wrap: break-word;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: 0.005em;
  font-weight: 300;
`;

const ShortAnswerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 400;
  padding-top: 2rem;
`;

function Option({
  denominator,
  content,
}: {
  denominator: string;
  content: string;
}) {
  return (
    <OptionWrapper>
      <OptionDenominator>{denominator}</OptionDenominator>
      <OptionContent>{content}</OptionContent>
    </OptionWrapper>
  );
}

export function QuestionSlide({
  category,
  question,
}: {
  category: Category;
  question: Question;
}) {
  const order = question.options
    ? indexToPermutation(question.optionOrder, question.options.length)
    : [];

  const options = question.options
    ? question.options
        .map((option, index) => ({
          ...option,
          index,
        }))
        .sort((a, b) => order.indexOf(a.index) - order.indexOf(b.index))
    : [];

  return (
    <BaseSlide>
      <CategoryTitle>{category.name}</CategoryTitle>
      <Separator size="3" />
      <QuestionWrapper $hasImage={!!question.imageUrl}>
        <QuestionText>{question.question}</QuestionText>
      </QuestionWrapper>
      {question.imageUrl && (
        <Image src={question.imageUrl} alt="Question Image" />
      )}
      <OptionsWrapper>
        {question.questionType === "multiChoice" ? (
          options.map((option, index) => (
            <Option
              key={option.id}
              denominator={letterIndex(index)}
              content={option.option}
            />
          ))
        ) : (
          <ShortAnswerWrapper>
            <PencilLine size={48} />
            <p>Write your answer</p>
          </ShortAnswerWrapper>
        )}
      </OptionsWrapper>
    </BaseSlide>
  );
}
