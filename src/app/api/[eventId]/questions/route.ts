import {
  fetchQuestions,
  updateQuestionOrders,
} from "@/services/questionService";
import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";

interface Response {
  questions: Question[];
  categories: Category[];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const eventId = parseInt((await params).eventId, 10);
  const questions = await fetchQuestions(eventId);

  const categories = questions.reduce((acc, question) => {
    if (!acc.some((cat) => cat.id === question.Category.id)) {
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
    category: q.Category,
  }));

  return new Response(
    JSON.stringify({ questions: processedQuestions, categories } as Response),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { questions, categories } = await request.json();
  const eventId = parseInt((await params).eventId, 10);

  if (!Array.isArray(questions) || !Array.isArray(categories)) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await updateQuestionOrders(questions, categories, eventId);

    return new Response(
      JSON.stringify({ message: "Questions updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving questions:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
