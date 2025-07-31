"use client";

import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { createContext, useContext, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEventId } from "./EventIdContext";

interface CategoryBundle {
  category: Category;
  questions: Question[];
}

interface QuestionContextType {
  questions: Question[];
  categories: Category[];
  combinedQuestions: Record<number, Question[]>;
  fetchQuestions: () => void;
  getCategory: (index: number) => CategoryBundle;
  isLoading: boolean;
  error: Error | null;
  nextCategoryIndex: number | null;
  setNextCategoryIndex: (index: number | null) => void;
  updateQuestionOrders: (
    updatedQuestions: Question[] | null,
    updatedCategories: Category[] | null
  ) => Promise<void>;
  isUpdating: boolean;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [],
  categories: [],
  combinedQuestions: {},
  fetchQuestions: () => {},
  getCategory: () => {
    throw new Error("getCategory not implemented in default context");
  },
  isLoading: false,
  error: null,
  nextCategoryIndex: null,
  setNextCategoryIndex: () => {
    throw new Error("setNextCategoryIndex not implemented in default context");
  },
  updateQuestionOrders: async () => {
    throw new Error("updateQuestionOrders not implemented in default context");
  },
  isUpdating: false,
});

// API Functions
async function fetchQuestionsData(eventId: string) {
  const response = await fetch(`/api/${eventId}/questions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`);
  }
  return await response.json();
}

async function updateQuestionsData(
  eventId: string,
  questions: Question[],
  categories: Category[]
) {
  const response = await fetch(`/api/${eventId}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questions: questions.map((q) => ({
        id: q.id,
        indexWithinCategory: q.indexWithinCategory,
        optionOrder: q.optionOrder,
        eventId: q.eventId,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        index: c.index,
        eventId: c.eventId,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update questions: ${response.statusText}`);
  }
  return response.json();
}

interface QuestionProviderProps {
  children: React.ReactNode;
}

export const QuestionProvider = ({ children }: QuestionProviderProps) => {
  const { eventId } = useEventId();
  const queryClient = useQueryClient();
  const [nextCategoryIndex, setNextCategoryIndex] = useState<number | null>(0);

  // Query for questions and categories
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["questions", eventId],
    queryFn: () => fetchQuestionsData(eventId.toString()),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating question orders
  const updateMutation = useMutation({
    mutationFn: ({
      updatedQuestions,
      updatedCategories,
    }: {
      updatedQuestions: Question[];
      updatedCategories: Category[];
    }) =>
      updateQuestionsData(
        eventId.toString(),
        updatedQuestions,
        updatedCategories
      ),
    onSuccess: () => {
      // Invalidate and refetch questions data
      queryClient.invalidateQueries({ queryKey: ["questions", eventId] });
    },
    onError: (error) => {
      console.error("Error updating questions:", error);
    },
  });

  const questions: Question[] = useMemo(
    () => data?.questions || [],
    [data?.questions]
  );
  const categories: Category[] = useMemo(
    () => data?.categories || [],
    [data?.categories]
  );

  const combinedQuestions = useMemo(
    () => ({
      ...questions.reduce((acc, question) => {
        if (!acc[question.categoryId]) {
          acc[question.categoryId] = [];
        }
        acc[question.categoryId].push(question);
        return acc;
      }, {} as Record<number, Question[]>),
    }),
    [questions]
  );

  async function updateQuestionOrders(
    updatedQuestions: Question[] | null,
    updatedCategories: Category[] | null
  ) {
    await updateMutation.mutateAsync({
      updatedQuestions: updatedQuestions ?? questions,
      updatedCategories: updatedCategories ?? categories,
    });
  }

  function getCategory(index: number): CategoryBundle {
    if (index < 0 || index >= categories.length) {
      throw new Error("Category index out of bounds");
    }
    const category = categories[index];
    const questionsForCategory = combinedQuestions[category.id] || [];
    return { category, questions: questionsForCategory };
  }

  return (
    <QuestionContext.Provider
      value={{
        questions,
        categories,
        combinedQuestions,
        fetchQuestions: () => refetch(),
        getCategory,
        isLoading,
        error,
        nextCategoryIndex,
        setNextCategoryIndex,
        updateQuestionOrders,
        isUpdating: updateMutation.isPending,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
