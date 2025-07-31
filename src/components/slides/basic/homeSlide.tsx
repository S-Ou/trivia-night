import Link from "next/link";
import styled from "styled-components";
import { ChevronRight, CircleCheckBig, Trophy } from "lucide-react";
import { HomeSlideProps } from "../slideProps";

const BaseWrapper = styled.div`
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  justify-content: center;
  padding-block: 8rem;
  padding-inline: 10rem;
`;

const Title = styled.h1`
  font-size: 12rem;
  font-stretch: expanded;
  font-weight: 1000;
  margin-left: -2rem;
`;

const Description = styled.h2`
  font-size: 2rem;
  font-weight: 300;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 2rem;
`;

const StyledCategory = styled.div`
  align-items: center;
  display: flex;
  gap: 2rem;
  justify-content: start;
`;

const CategoryLabel = styled.h3`
  font-size: 2.5rem;
  font-stretch: expanded;
  font-variation-settings: "slnt" -10;
  font-weight: 600;
`;

const CategoryLink = styled(Link)<{ $isNextLink: boolean }>`
  align-items: center;
  color: inherit;
  display: flex;
  font-size: 3rem;
  font-weight: 600;
  gap: 0.5rem;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.2s ease;

  ${({ $isNextLink }) =>
    $isNextLink &&
    `
    color: var(--accent-10);
    svg {
      transform: translateX(-0.5rem);
    }
  `}

  &:hover {
    text-decoration: underline;
    transform: translateX(0.25rem);
  }
`;

const CategoryAnswersLink = styled(Link)`
  align-items: center;
  display: flex;
  font-size: 1rem;
  gap: 0.25rem;
  opacity: 0.8;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultsLink = styled(Link)`
  align-items: center;
  display: flex;
  font-size: 2.5rem;
  gap: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default function HomeSlide({
  event,
  categories,
  isEventLoading,
  isQuestionLoading,
  nextCategoryIndex,
  results,
}: HomeSlideProps) {
  return (
    <BaseWrapper>
      <Title>{!isEventLoading ? event.title : "Loading..."}</Title>
      <Description>
        {!isEventLoading ? event.description : "Loading..."}
      </Description>

      <CategoryWrapper>
        <CategoryLabel>Today&apos;s Categories</CategoryLabel>
        {isQuestionLoading ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((category, index) => (
            <StyledCategory key={category.name || index}>
              <CategoryLink
                href={`./category/${index}`}
                $isNextLink={nextCategoryIndex === index}
              >
                <ChevronRight size={32} />
                {category.name}
              </CategoryLink>
              {(nextCategoryIndex === null || nextCategoryIndex > index) && (
                <CategoryAnswersLink href={`./category/${index}?answers=true`}>
                  <CircleCheckBig size={16} /> Answers
                </CategoryAnswersLink>
              )}
            </StyledCategory>
          ))
        )}
      </CategoryWrapper>

      {results && results.length > 0 && (
        <ResultsLink href="./results">
          <Trophy size={32} />
          Current Results
        </ResultsLink>
      )}
    </BaseWrapper>
  );
}
