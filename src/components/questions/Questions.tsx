import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";
import styled from "styled-components";
import { Question } from "@/types/Question";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useDragDrop } from "./shared/DragDropHook";
import { AnimatedLabel, DragGrip } from "./shared/SharedComponents";
import { Options } from "./Options";
import { ImageTrigger } from "./ImageTrigger";

const QuestionList = styled.div`
  display: block;
  width: 100%;
`;

const QuestionItem = styled.div`
  border-radius: max(var(--radius-3), var(--radius-full));
  border: 2px solid var(--accent-7);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
`;

const QuestionHeader = styled.div`
  align-items: center;
  background-color: inherit;
  border: none;
  display: flex;
  width: 100%;
`;

const QuestionHeaderContent = styled.div`
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

const QuestionContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 1rem;
`;

const QuestionGrip = styled(DragGrip)`
  padding-inline: 0.25rem;
  flex-shrink: 0;
  width: 2.5rem;
  min-width: 2.5rem;
  max-width: 2.5rem;
`;

interface QuestionsProps {
  questions: Question[];
  categoryName: string;
}

export function Questions({ questions, categoryName }: QuestionsProps) {
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const { updateQuestionOrders } = useQuestionContext();

  useEffect(() => {
    setOrderedQuestions(questions);
  }, [questions]);

  const { handleDragEnd, isSaving } = useDragDrop({
    items: orderedQuestions,
    onReorder: setOrderedQuestions,
    updateFunction: async (newOrder: Question[]) => {
      const updatedQuestions = newOrder.map((q, idx) => ({
        ...q,
        indexWithinCategory: idx,
      }));
      await updateQuestionOrders(updatedQuestions, null);
    },
    successMessage: "Questions updated successfully",
    errorMessage: "Failed to update questions",
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`questions-droppable-${categoryName}`}>
        {(provided) => (
          <QuestionList ref={provided.innerRef} {...provided.droppableProps}>
            {orderedQuestions.map((question, idx) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={idx}
              >
                {(dragProvided, snapshot) => (
                  <QuestionItem
                    ref={dragProvided.innerRef}
                    style={snapshot.isDragging ? { opacity: 0.5 } : {}}
                    {...dragProvided.draggableProps}
                  >
                    <QuestionHeader>
                      <QuestionHeaderContent>
                        <AnimatePresence mode="wait">
                          <AnimatedLabel key={idx}>{idx + 1}.</AnimatedLabel>
                        </AnimatePresence>{" "}
                        {question.question}
                      </QuestionHeaderContent>
                      <QuestionGrip {...dragProvided.dragHandleProps}>
                        <GripVertical size={24} />
                      </QuestionGrip>
                    </QuestionHeader>
                    <QuestionContent>
                      <Options
                        options={question.options}
                        order={question.optionOrder}
                        type={question.questionType}
                        questionId={question.id}
                        questions={orderedQuestions}
                        setOrderedQuestions={setOrderedQuestions}
                      />
                      <ImageTrigger question={question} />
                    </QuestionContent>
                  </QuestionItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </QuestionList>
        )}
      </Droppable>
    </DragDropContext>
  );
}
