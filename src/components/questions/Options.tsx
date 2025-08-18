import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import { GripVertical, PencilLine, SquareCheck } from "lucide-react";
import styled from "styled-components";
import { Option, QuestionType } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { permutationToIndex, indexToPermutation } from "@/utils/permutations";
import { letterIndex } from "@/utils";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useDragDrop } from "./shared/DragDropHook";
import {
  AnimatedLabel,
  DragGrip,
  DraggableItemWrapper,
} from "./shared/SharedComponents";

const OptionsWrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const OptionItem = styled(DraggableItemWrapper)<{ $draggable?: boolean }>`
  align-items: center;
  color: var(--foreground);
  display: flex;
  margin-bottom: 0.5rem;
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  user-select: none;
`;

const OptionItemContent = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.5rem;
`;

const OptionIconWrapper = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: start;
  min-width: 2ch;
`;

const OptionGrip = styled(DragGrip)``;

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
  const isMultiChoice = type === "multiChoice";
  const { updateQuestionOrders } = useQuestionContext();

  useEffect(() => {
    setOrderedOptions(indexToPermutation(order, options.length));
  }, [options, order]);

  const { handleDragEnd, isSaving } = useDragDrop({
    items: orderedOptions,
    onReorder: (newOrder: number[]) => {
      setOrderedOptions(newOrder);
      const updatedQuestions = questions.map((q) =>
        q.id === questionId
          ? { ...q, optionOrder: permutationToIndex(newOrder) }
          : q
      );
      setOrderedQuestions(updatedQuestions);
    },
    updateFunction: async (newOrder: number[]) => {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId
          ? { ...q, optionOrder: permutationToIndex(newOrder) }
          : q
      );
      await updateQuestionOrders(updatedQuestions, null);
    },
    successMessage: "Options updated successfully",
    errorMessage: "Failed to update options",
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
