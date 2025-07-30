"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ImportButton, ExportButton } from "../../../components/csvButtons";
import styled from "styled-components";
import { Separator, Text } from "@radix-ui/themes";
import {
  ChevronDown,
  GripVertical,
  PencilLine,
  SquareCheck,
} from "lucide-react";
import { Accordion } from "radix-ui";
import { Question } from "@/types/Question";
import { Option, QuestionType } from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import { indexToPermutation } from "@/utils/permutations";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { letterIndex } from "@/utils";
import { toast } from "sonner";
import { EventPageTemplate, Page } from "../pageTemplate";

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const QuestionSetWrapper = styled.div`
  padding-inline: 1rem;
  width: 100%;
`;

const CategoryList = styled.div`
  display: block;
  width: 100%;
`;

const CategoryItem = styled(Accordion.Item)`
  background-color: var(--accent-3);
  border-radius: max(var(--radius-3), var(--radius-full));
  margin-bottom: 1rem;
  width: 100%;
`;

const CategoryHeader = styled.div`
  align-items: center;
  background-color: var(--accent-9);
  border-radius: max(var(--radius-3), var(--radius-full));
  border: none;
  display: flex;
  padding: 0.5rem;
  width: 100%;
`;

const CategoryHeaderContent = styled.div`
  align-items: center;
  color: var(--accent-contrast);
  display: flex;
  flex: 1;
  font-size: 2rem;
  font-stretch: expanded;
  font-weight: 600;
  gap: 0.5rem;
`;

const CategoryContent = styled(Accordion.Content)`
  padding: 1rem;
`;

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
  color: var(--accent-contrast);
  display: flex;
  flex: 1;
  font-size: 1.5rem;
  font-weight: 600;
  gap: 0.5rem;
  padding-inline: 0.5rem;
  text-wrap: balance;
`;

const QuestionContent = styled.div``;

const OptionsWrapper = styled.div`
  display: block;
  font-size: 1rem;
`;

const OptionItem = styled.div<{ $draggable?: boolean; $isDragging?: boolean }>`
  align-items: center;
  background-color: var(--accent-4);
  border-radius: max(var(--radius-3), var(--radius-full));
  color: var(--accent-contrast);
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

const AccordionChevron = styled.span`
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

const CategoryGrip = styled.span`
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

const QuestionGrip = styled.span`
  align-items: center;
  cursor: grab;
  display: flex;
  height: 100%;
  padding-inline: 0.25rem;
  justify-content: center;
`;

const OptionGrip = styled.span`
  align-items: center;
  aspect-ratio: 1 / 1;
  cursor: grab;
  display: flex;
  height: 100%;
  justify-content: center;
`;

function Categories() {
  const { combinedQuestions, categories, isLoading, updateQuestionOrders } =
    useQuestionContext();
  const [localCategories, setLocalCategories] = useState(categories);
  const [localCombinedQuestions, setLocalCombinedQuestions] =
    useState(combinedQuestions);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalCategories(categories);
    setLocalCombinedQuestions(combinedQuestions);
  }, [categories, combinedQuestions]);

  const onDragEnd = async (result: any) => {
    if (isSaving) return;
    if (!result.destination) return;
    setIsSaving(true);
    const newOrder = Array.from(localCategories);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setLocalCategories(newOrder);
    await updateQuestionOrders(
      null,
      newOrder.map((cat, idx) => ({ ...cat, index: idx }))
    )
      .then(() => {
        toast.success("Categories updated successfully");
      })
      .catch((error) => {
        console.error("Error updating categories:", error);
        toast.error("Failed to update categories");
      });
    setIsSaving(false);
  };

  if (isLoading && localCategories.length === 0) {
    return <Text size="2">Loading...</Text>;
  }

  if (categories.length === 0) {
    return (
      <Text size="2">
        No questions uploaded. Import them using the button above! You can
        download the template from the export button.
      </Text>
    );
  }

  return (
    <QuestionSetWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories-droppable">
          {(provided) => (
            <Accordion.Root
              type="multiple"
              asChild
              defaultValue={categories.map((cat) => cat.name)}
            >
              <CategoryList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {localCategories.map((category, idx) => (
                  <Draggable
                    key={category.name}
                    draggableId={category.name}
                    index={idx}
                  >
                    {(dragProvided, snapshot) => (
                      <CategoryItem
                        value={category.name}
                        ref={dragProvided.innerRef}
                        style={snapshot.isDragging ? { opacity: 0.5 } : {}}
                        {...dragProvided.draggableProps}
                      >
                        <CategoryHeader>
                          <CategoryHeaderContent>
                            <AccordionChevron
                              as={Accordion.Trigger}
                              value={category.name}
                            >
                              <ChevronDown size={28} />
                            </AccordionChevron>
                            {category.name}
                          </CategoryHeaderContent>
                          <CategoryGrip {...dragProvided.dragHandleProps}>
                            <GripVertical size={24} />
                          </CategoryGrip>
                        </CategoryHeader>
                        <CategoryContent>
                          <Questions
                            questions={
                              localCombinedQuestions[category.name] || []
                            }
                            categoryName={category.name}
                          />
                        </CategoryContent>
                      </CategoryItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </CategoryList>
            </Accordion.Root>
          )}
        </Droppable>
      </DragDropContext>
    </QuestionSetWrapper>
  );
}

function Questions({
  questions,
  categoryName,
}: {
  questions: Question[];
  categoryName: string;
}) {
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOrderedQuestions(questions);
  }, [questions]);

  const { updateQuestionOrders } = useQuestionContext();
  const onDragEnd = async (result: any) => {
    if (isSaving) return;
    if (!result.destination) return;
    setIsSaving(true);
    const newOrder = Array.from(orderedQuestions);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    const updatedQuestions = newOrder.map((q, idx) => ({
      ...q,
      indexWithinCategory: idx,
    }));
    setOrderedQuestions(updatedQuestions);
    await updateQuestionOrders(updatedQuestions, null)
      .then(() => {
        toast.success("Questions updated successfully");
      })
      .catch((error) => {
        console.error("Error updating questions:", error);
        toast.error("Failed to update questions");
      });
    setIsSaving(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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

function Options({
  options,
  order,
  type,
  questionId,
  questions,
  setOrderedQuestions,
}: {
  options: Option[];
  order: number;
  type: QuestionType;
  questionId: string;
  questions: Question[];
  setOrderedQuestions: (qs: Question[]) => void;
}) {
  const [orderedOptions, setOrderedOptions] = useState(
    indexToPermutation(order, options.length)
  );
  const [isSaving, setIsSaving] = useState(false);
  const isMultiChoice = type === "multiChoice";

  useEffect(() => {
    setOrderedOptions(indexToPermutation(order, options.length));
  }, [options, order]);

  const { updateQuestionOrders } = useQuestionContext();
  const { permutationToIndex } = require("@/utils/permutations");
  const onDragEnd = async (result: any) => {
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

export default function QuestionsPage() {
  return (
    <EventPageTemplate currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton />
        <ExportButton />
      </ButtonWrapper>
      <Text size={"2"}>
        Click &quot;Export&quot; to obtain the CSV file format
      </Text>
      <Separator size="4" />
      <Text size="4" style={{ textAlign: "center" }}>
        Reorder categories, questions, and options by dragging and dropping them
        below.
      </Text>
      <Categories />
    </EventPageTemplate>
  );
}
