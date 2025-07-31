import { Result } from "@/contexts/ResultsContext";
import { Event, Category } from "@/generated/prisma";
import { Question } from "@/types/Question";

export interface HomeSlideProps {
  event: Event;
  categories: Category[];
  isEventLoading: boolean;
  isQuestionLoading: boolean;
  nextCategoryIndex: number | null;
  results: Result[];
}

export interface TitleSlideProps {
  category: Category;
  questions: Question[];
  showAnswers?: boolean;
}

export interface QuestionSlideProps {
  category: Category;
  question: Question;
  showAnswers?: boolean;
}

export interface SummarySlideProps {
  category: Category;
  questions: Question[];
}
