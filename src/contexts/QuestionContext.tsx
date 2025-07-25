"use client";

import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface CategoryBundle {
  category: Category;
  questions: Question[];
}

interface QuestionContextType {
  questions: Question[];
  categories: Category[];
  combinedQuestions: Record<string, Question[]>;
  fetchQuestions: () => Promise<void>;
  getCategory: (index: number) => CategoryBundle;
  isLoading: boolean;
  nextCategoryIndex: number | null;
  setNextCategoryIndex: (index: number | null) => void;
  updateQuestionOrders: (
    updatedQuestions: Question[] | null,
    updatedCategories: Category[] | null
  ) => Promise<void>;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [],
  categories: [],
  combinedQuestions: {},
  fetchQuestions: async () => {},
  getCategory: () => {
    throw new Error("getCategory not implemented in default context");
  },
  isLoading: false,
  nextCategoryIndex: null,
  setNextCategoryIndex: () => {
    throw new Error("setNextCategoryIndex not implemented in default context");
  },
  updateQuestionOrders: async () => {
    throw new Error("updateQuestionOrders not implemented in default context");
  },
});

interface QuestionProviderProps {
  children: React.ReactNode;
}

export const QuestionProvider = ({ children }: QuestionProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [nextCategoryIndex, setNextCategoryIndex] = useState<number | null>(0);

  const combinedQuestions = useMemo(
    () => ({
      ...questions.reduce((acc, question) => {
        if (!acc[question.categoryName]) {
          acc[question.categoryName] = [];
        }
        acc[question.categoryName].push(question);
        return acc;
      }, {} as Record<string, Question[]>),
    }),
    [questions]
  );

  async function fetchQuestions() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data.questions);
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateQuestionOrders(
    updatedQuestions: Question[] | null,
    updatedCategories: Category[] | null
  ) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: (updatedQuestions ?? questions).map((q) => ({
            id: q.id,
            indexWithinCategory: q.indexWithinCategory,
            optionOrder: q.optionOrder,
            eventId: q.eventId,
          })),
          categories: (updatedCategories ?? categories).map((c) => ({
            name: c.name,
            index: c.index,
            eventId: c.eventId,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update questions");
      }
      await fetchQuestions();
    } catch (error) {
      console.error("Error updating questions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function getCategory(index: number): CategoryBundle {
    if (index < 0 || index >= categories.length) {
      throw new Error("Category index out of bounds");
    }
    const category = categories[index];
    const questionsForCategory = combinedQuestions[category.name] || [];
    return { category, questions: questionsForCategory };
  }

  return (
    <QuestionContext.Provider
      value={{
        questions,
        categories,
        combinedQuestions,
        fetchQuestions,
        getCategory,
        isLoading,
        nextCategoryIndex,
        setNextCategoryIndex,
        updateQuestionOrders,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
