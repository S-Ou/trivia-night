import BaseSlide from "./baseSlide";
import styled from "styled-components";
import { Separator } from "@radix-ui/themes";
import { indexToPermutation } from "@/utils/permutations";
import { PencilLine } from "lucide-react";
import { SlideProps } from "../slideProps";
import { letterIndex } from "@/utils";

const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-stretch: expanded;
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
  border-radius: 1rem;
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

const OptionDenominator = styled.strong<{ $isCorrect?: boolean }>`
  font-size: 5rem;
  font-weight: 1000;
  opacity: 0.5;

  ${({ $isCorrect }) =>
    $isCorrect === true
      ? `
        color: var(--accent-10);
        opacity: 0.8;
      `
      : ""}
`;

const OptionContent = styled.span<{ $isCorrect?: boolean }>`
  font-size: 2.5rem;
  line-height: 1.2;
  max-width: 100%;
  overflow-wrap: break-word;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: 0.005em;
  font-weight: 300;

  ${({ $isCorrect }) =>
    $isCorrect === true
      ? `
        color: var(--accent-10);
        font-weight: 600;
      `
      : $isCorrect === false
      ? `
        opacity: 0.5;
      `
      : ""}
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
  isCorrect = undefined,
}: {
  denominator: string | null;
  content: string;
  isCorrect?: boolean | undefined;
}) {
  return (
    <OptionWrapper>
      {denominator !== null && (
        <OptionDenominator $isCorrect={isCorrect}>
          {denominator}
        </OptionDenominator>
      )}
      <OptionContent $isCorrect={isCorrect}>{content}</OptionContent>
    </OptionWrapper>
  );
}

export function QuestionSlide({
  category: { currentCategory },
  question: { currentQuestions, currentQuestionIndex },
  showAnswers = false,
}: SlideProps & { showAnswers: boolean }) {
  const category = currentCategory!;
  const question = currentQuestions![currentQuestionIndex ?? 0];

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
              isCorrect={showAnswers ? option.isCorrect : undefined}
            />
          ))
        ) : (
          <ShortAnswerWrapper>
            {!showAnswers ? (
              <>
                <PencilLine size={48} />
                <p>Write your answer</p>
              </>
            ) : (
              <Option
                denominator={null}
                content={question.options?.[0]?.option}
                isCorrect={true}
              />
            )}
          </ShortAnswerWrapper>
        )}
      </OptionsWrapper>
    </BaseSlide>
  );
}
