import { fetchQuestions } from "@/services/questionService";
import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";

interface Response {
  questions: Question[];
  categories: Category[];
}

export async function GET() {
  const questions = await fetchQuestions();

  const categories = questions.reduce((acc, question) => {
    if (!acc.some((cat) => cat.name === question.categoryName)) {
      acc.push(question.Category);
    }
    return acc;
  }, [] as Category[]);

  const processedQuestions = questions.map((q) => ({
    ...q,
    options: q.Option.map((o) => ({
      ...o,
      isCorrect: o.isCorrect || false,
    })),
    categoryName: q.Category.name,
  }));

  return new Response(
    JSON.stringify({ questions: processedQuestions, categories } as Response),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
