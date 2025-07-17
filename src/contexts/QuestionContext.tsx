"use client";

import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { createContext, useContext, useEffect, useState } from "react";

interface QuestionContextType {
  questions: Question[];
  categories: Category[];
  fetchQuestions: () => Promise<void>;
  isLoading: boolean;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [],
  categories: [],
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
      value={{ questions, categories, fetchQuestions, isLoading }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => useContext(QuestionContext);
