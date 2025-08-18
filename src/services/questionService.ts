import { prisma } from "@/client";
import { Category, Question } from "@/generated/prisma";

export async function fetchQuestions(eventId?: number) {
  const questions = await prisma.question.findMany({
    include: {
      Option: true,
      Category: true,
    },
    orderBy: [
      {
        Category: {
          index: "asc",
        },
      },
      {
        indexWithinCategory: "asc",
      },
    ],
    where: {
      ...(eventId ? { Event: { id: eventId } } : {}),
    },
  });

  return questions;
}

export async function updateQuestionOrders(
  questions: Question[],
  categories: Category[]
) {
  const questionUpdatePromises = questions.map((question) =>
    prisma.question.update({
      where: { id: question.id },
      data: {
        indexWithinCategory: question.indexWithinCategory,
        optionOrder: question.optionOrder,
      },
    })
  );

  const categoryUpdatePromises = categories.map((category) =>
    prisma.category.update({
      where: { id: category.id },
      data: { index: category.index },
    })
  );

  await prisma.$transaction([
    ...questionUpdatePromises,
    ...categoryUpdatePromises,
  ]);
}

export async function updateQuestion(
  questionId: string,
  data: Partial<Question>
) {
  return await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.indexWithinCategory !== undefined && {
        indexWithinCategory: data.indexWithinCategory,
      }),
      ...(data.optionOrder !== undefined && { optionOrder: data.optionOrder }),
    },
  });
}
