"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ImportButton, ExportButton } from "../../components/csvButtons";
import { PageTemplate, Page } from "../pageTemplate";
import styled from "styled-components";
import { Separator, Text } from "@radix-ui/themes";
import { Question } from "@/types/Question";
import { Option, QuestionType } from "@/generated/prisma";
import { motion } from "framer-motion";
import { indexToPermutation } from "@/utils/permutations";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { letterIndex } from "@/utils";

const MotionContent = motion.div;

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

const CategoryItem = styled.div`
  background-color: var(--accent-3);
  border-radius: max(var(--radius-3), var(--radius-full));
  width: 100%;
  margin-bottom: 1rem;
`;

const CategoryHeader = styled.div`
  background-color: var(--accent-9);
  border-radius: max(var(--radius-3), var(--radius-full));
  border: none;
  font-size: 2rem;
  font-stretch: expanded;
  font-weight: 600;
  padding: 0.5rem;
  width: 100%;
  cursor: grab;
`;

const CategoryContent = styled(MotionContent)`
  padding: 1rem;
`;

const QuestionList = styled.div`
  display: block;
  width: 100%;
`;

const QuestionItem = styled.div`
  border-radius: max(var(--radius-3), var(--radius-full));
  border: 2px solid var(--accent-7);
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const QuestionHeader = styled.div`
  background-color: inherit;
  border: none;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
  cursor: grab;
`;

const QuestionContent = styled(MotionContent)``;

const OptionsWrapper = styled.div`
  background-color: var(--accent-4);
  border-radius: max(var(--radius-3), var(--radius-full));
  color: var(--foreground);
  display: block;
  font-size: 1rem;
  padding: 0.5rem;
`;

const OptionItem = styled.div<{ $draggable?: boolean }>`
  cursor: ${({ $draggable }) => ($draggable ? "grab" : "default")};
  margin-bottom: 0.25rem;
  user-select: none;
  width: 100%;
`;

function Categories() {
  const { combinedQuestions, categories, isLoading } = useQuestionContext();
  const [orderedCategories, setOrderedCategories] = useState(categories);

  useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(orderedCategories);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrderedCategories(newOrder);
  };

  if (isLoading) {
    return <Text size="2">Loading...</Text>;
  }

  if (orderedCategories.length === 0) {
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
            <CategoryList ref={provided.innerRef} {...provided.droppableProps}>
              {orderedCategories.map((category, idx) => (
                <Draggable
                  key={category.name}
                  draggableId={category.name}
                  index={idx}
                >
                  {(dragProvided, snapshot) => (
                    <CategoryItem
                      ref={dragProvided.innerRef}
                      style={snapshot.isDragging ? { opacity: 0.5 } : {}}
                      {...dragProvided.draggableProps}
                    >
                      <CategoryHeader {...dragProvided.dragHandleProps}>
                        {category.name}
                      </CategoryHeader>
                      <CategoryContent>
                        <Questions
                          questions={combinedQuestions[category.name] || []}
                          categoryName={category.name}
                        />
                      </CategoryContent>
                    </CategoryItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CategoryList>
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

  useEffect(() => {
    setOrderedQuestions(questions);
  }, [questions]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(orderedQuestions);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrderedQuestions(newOrder);
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
                    <QuestionHeader {...dragProvided.dragHandleProps}>
                      {idx + 1}. {question.question}
                    </QuestionHeader>
                    <QuestionContent>
                      <Options
                        options={question.options}
                        order={question.optionOrder}
                        type={question.questionType}
                        questionId={question.id}
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
}: {
  options: Option[];
  order: number;
  type: QuestionType;
  questionId: string;
}) {
  const [orderedOptions, setOrderedOptions] = useState(
    indexToPermutation(order, options.length)
  );
  const isMultiChoice = type === "multiChoice";

  useEffect(() => {
    setOrderedOptions(indexToPermutation(order, options.length));
  }, [options, order]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(orderedOptions);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrderedOptions(newOrder);
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
                      ref={dragProvided.innerRef}
                      style={snapshot.isDragging ? { opacity: 0.5 } : {}}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      {letterIndex(idx) + ": "}
                      {options[optionIndex].option}
                      {options[optionIndex].isCorrect ? " (Correct)" : ""}
                    </OptionItem>
                  )}
                </Draggable>
              ) : (
                <OptionItem key={optionIndex} $draggable={false}>
                  {options[optionIndex].option}
                  {options[optionIndex].isCorrect ? " (Correct)" : ""}
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
    <PageTemplate currentPage={Page.Questions}>
      <ButtonWrapper>
        <ImportButton />
        <ExportButton />
      </ButtonWrapper>
      <Text size={"2"}>
        Click &quot;Export&quot; to obtain the CSV file format
      </Text>
      <Separator size="4" />
      <Text size="4" weight="bold" style={{ textAlign: "center" }}>
        Reorder categories, questions, and options by dragging and dropping them
        below.
      </Text>
      <Categories />
    </PageTemplate>
  );
}
