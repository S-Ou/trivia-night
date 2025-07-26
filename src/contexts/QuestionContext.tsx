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
});

interface QuestionProviderProps {
  children: React.ReactNode;
}

export const QuestionProvider = ({ children }: QuestionProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
