import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, PencilLine, SquareCheck } from "lucide-react";
import styled from "styled-components";
import { Option, QuestionType } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { permutationToIndex, indexToPermutation } from "@/utils/permutations";
import { letterIndex } from "@/utils";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { toast } from "sonner";

const OptionsWrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const OptionItem = styled.div<{ $draggable?: boolean; $isDragging?: boolean }>`
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

const OptionItemContent = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.5rem;
`;

const AnimatedLabel = styled(motion.span).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
})`
  display: inline-block;
  min-width: 2ch;
  font-weight: 500;
`;

const OptionIconWrapper = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: start;
  min-width: 2ch;
`;

const OptionGrip = styled.span`
  align-items: center;
  aspect-ratio: 1 / 1;
  cursor: grab;
  display: flex;
  height: 100%;
  justify-content: center;
`;

interface OptionsProps {
  options: Option[];
  order: number;
  type: QuestionType;
  questionId: string;
  questions: Question[];
  setOrderedQuestions: (qs: Question[]) => void;
}

export function Options({
  options,
  order,
  type,
  questionId,
  questions,
  setOrderedQuestions,
}: OptionsProps) {
  const [orderedOptions, setOrderedOptions] = useState(
    indexToPermutation(order, options.length)
  );
  const [isSaving, setIsSaving] = useState(false);
  const isMultiChoice = type === "multiChoice";

  useEffect(() => {
    setOrderedOptions(indexToPermutation(order, options.length));
  }, [options, order]);

  const { updateQuestionOrders } = useQuestionContext();
  const onDragEnd = async (result: {
    source: { index: number };
    destination?: { index: number } | null;
  }) => {
    if (isSaving) return;
    if (!result.destination) return;
    setIsSaving(true);
    const newOrder = Array.from(orderedOptions);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrderedOptions(newOrder);
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? { ...q, optionOrder: permutationToIndex(newOrder) }
        : q
    );
    setOrderedQuestions(updatedQuestions);
    await updateQuestionOrders(updatedQuestions, null)
      .then(() => {
        toast.success("Options updated successfully");
      })
      .catch((error) => {
        console.error("Error updating options:", error);
        toast.error("Failed to update options");
      });
    setIsSaving(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`options-droppable-${questionId}`}>
        {(provided) => (
          <OptionsWrapper ref={provided.innerRef} {...provided.droppableProps}>
            {orderedOptions.map((optionIndex, idx) =>
              isMultiChoice ? (
                <Draggable
                  key={optionIndex}
                  draggableId={optionIndex.toString()}
                  index={idx}
                >
                  {(dragProvided, snapshot) => (
                    <OptionItem
                      $draggable
                      $isDragging={snapshot.isDragging}
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                    >
                      <OptionItemContent>
                        <AnimatePresence mode="wait">
                          <AnimatedLabel key={idx}>
                            {letterIndex(idx)}
                          </AnimatedLabel>
                        </AnimatePresence>
                        {options[optionIndex].option}
                        {options[optionIndex].isCorrect && (
                          <OptionIconWrapper>
                            <SquareCheck size={16} />
                          </OptionIconWrapper>
                        )}
                      </OptionItemContent>
                      <OptionGrip {...dragProvided.dragHandleProps}>
                        <GripVertical size={20} />
                      </OptionGrip>
                    </OptionItem>
                  )}
                </Draggable>
              ) : (
                <OptionItem key={optionIndex} $draggable={false}>
                  <OptionItemContent>
                    <OptionIconWrapper>
                      <PencilLine size={16} />
                    </OptionIconWrapper>
                    {options[optionIndex].option}
                  </OptionItemContent>
                </OptionItem>
              )
            )}
            {provided.placeholder}
          </OptionsWrapper>
        )}
      </Droppable>
    </DragDropContext>
  );
}
