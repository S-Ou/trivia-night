import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Accordion } from "radix-ui";
import { ChevronDown, GripVertical } from "lucide-react";
import { Text } from "@radix-ui/themes";
import styled from "styled-components";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { useCategoryDragDrop } from "./shared/DragDropHook";
import { DragGrip } from "./shared/SharedComponents";
import { Questions } from "./Questions";

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const QuestionSetWrapper = styled.div`
  padding-inline: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding-inline: 0rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
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

const CategoryGrip = styled(DragGrip)<{ $size?: number }>`
  color: var(--accent-contrast);
  opacity: 0.9;
  max-width: 2.5rem;
  min-width: 2.5rem;
`;

export function Categories() {
  const {
    combinedQuestions,
    categories,
    isLoading,
    updateQuestionOrders,
    fetchQuestions,
  } = useQuestionContext();
  const [localCategories, setLocalCategories] = useState(categories);
  const [localCombinedQuestions, setLocalCombinedQuestions] =
    useState(combinedQuestions);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    setLocalCategories(categories);
    setLocalCombinedQuestions(combinedQuestions);
  }, [categories, combinedQuestions]);

  const { handleDragEnd } = useCategoryDragDrop({
    categories: localCategories,
    onReorder: setLocalCategories,
    updateFunction: async (questions: any, newCategories: any[]) => {
      const categoriesWithIndex = newCategories.map((cat, idx) => ({
        ...cat,
        index: idx,
      }));
      await updateQuestionOrders(null, categoriesWithIndex);
    },
    successMessage: "Categories updated successfully",
    errorMessage: "Failed to update categories",
  });

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
      <DragDropContext onDragEnd={handleDragEnd}>
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
                              localCombinedQuestions[category.id] || []
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
