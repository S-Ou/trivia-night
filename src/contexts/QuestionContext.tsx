"use client";

import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface QuestionContextType {
  questions: Question[];
  categories: Category[];
  combinedQuestions: Record<string, Question[]>;
  fetchQuestions: () => Promise<void>;
  isLoading: boolean;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [],
  categories: [],
  combinedQuestions: {},
  fetchQuestions: async () => {},
  isLoading: false,
});

interface QuestionProviderProps {
  children: React.ReactNode;
}

export const QuestionProvider = ({ children }: QuestionProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  return (
    <QuestionContext.Provider
      value={{
        questions,
        categories,
        combinedQuestions,
        fetchQuestions,
        isLoading,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
