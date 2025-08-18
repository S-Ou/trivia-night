import styled from "styled-components";
import { Accordion } from "radix-ui";
import { motion } from "framer-motion";
import { Text } from "@radix-ui/themes";

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export const QuestionSetWrapper = styled.div`
  padding-inline: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding-inline: 0rem;
  }
`;

export const CategoryList = styled.div`
  display: block;
  width: 100%;
`;

export const CategoryItem = styled(Accordion.Item)`
  background-color: var(--accent-3);
  border-radius: max(var(--radius-3), var(--radius-full));
  margin-bottom: 1rem;
  width: 100%;
`;

export const CategoryHeader = styled.div`
  align-items: center;
  background-color: var(--accent-9);
  border-radius: max(var(--radius-3), var(--radius-full));
  border: none;
  display: flex;
  padding: 0.5rem;
  width: 100%;
`;

export const CategoryHeaderContent = styled.div`
  align-items: center;
  color: var(--accent-contrast);
  display: flex;
  flex: 1;
  font-size: 2rem;
  font-stretch: expanded;
  font-weight: 600;
  gap: 0.5rem;
`;

export const CategoryContent = styled(Accordion.Content)`
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const QuestionList = styled.div`
  display: block;
  width: 100%;
`;

export const QuestionItem = styled.div`
  border-radius: max(var(--radius-3), var(--radius-full));
  border: 2px solid var(--accent-7);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
`;

export const QuestionHeader = styled.div`
  align-items: center;
  background-color: inherit;
  border: none;
  display: flex;
  width: 100%;
`;

export const QuestionHeaderContent = styled.div`
  align-items: center;
  color: var(--foreground);
  display: flex;
  flex: 1;
  font-size: 1.5rem;
  font-weight: 600;
  gap: 0.5rem;
  padding-inline: 0.5rem;
  text-wrap: balance;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    gap: 0.2rem;
    padding-inline: 0.25rem;
  }
`;

export const QuestionContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 1rem;
`;

export const QuestionImage = styled.img`
  border-radius: 1rem;
  max-height: 50vh;
  max-width: 80%;
`;

export const QuestionImageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const OptionsWrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const OptionItem = styled.div<{
  $draggable?: boolean;
  $isDragging?: boolean;
}>`
  align-items: center;
  background-color: var(--accent-4);
  border-radius: max(var(--radius-3), var(--radius-full));
  color: var(--foreground);
  display: flex;
  margin-bottom: 0.5rem;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  user-select: none;
  width: 100%;
`;

export const OptionItemContent = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.5rem;
`;

export const AnimatedLabel = styled(motion.span).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
})`
  display: inline-block;
  min-width: 2ch;
  font-weight: 500;
`;

export const OptionIconWrapper = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: start;
  min-width: 2ch;
`;

export const AccordionChevron = styled.span`
  align-items: center;
  background-color: transparent;
  border: none;
  color: var(--accent-contrast);
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: transform 0.2s;

  &[data-state="open"] {
    transform: rotate(180deg);
  }
`;

export const CategoryGrip = styled.span`
  align-items: center;
  aspect-ratio: 1 / 1;
  cursor: grab;
  display: flex;
  height: 100%;
  justify-content: center;
  max-width: 2.5rem;
  min-width: 2.5rem;
  color: var(--accent-contrast);
  opacity: 0.9;
`;

export const QuestionGrip = styled.span`
  align-items: center;
  cursor: grab;
  display: flex;
  height: 100%;
  padding-inline: 0.25rem;
  justify-content: center;
`;

export const OptionGrip = styled.span`
  align-items: center;
  aspect-ratio: 1 / 1;
  cursor: grab;
  display: flex;
  height: 100%;
  justify-content: center;
`;

export const ImagePreviewContainer = styled.div`
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ImageErrorText = styled(Text)<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const PreviewImage = styled(QuestionImage)<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
`;
