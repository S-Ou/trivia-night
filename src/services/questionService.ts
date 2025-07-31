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
  categories: Category[],
  eventId: number
) {
  const questionUpdatePromises = questions.map((question) =>
    prisma.question.update({
      where: { eventId: eventId, id: question.id },
      data: {
        indexWithinCategory: question.indexWithinCategory,
        optionOrder: question.optionOrder,
      },
    })
  );

  const categoryUpdatePromises = categories.map((category) =>
    prisma.category.update({
      where: { id: category.id, eventId: eventId },
      data: { index: category.index },
    })
  );

  await prisma.$transaction([
    ...questionUpdatePromises,
    ...categoryUpdatePromises,
  ]);
}
