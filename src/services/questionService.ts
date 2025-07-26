import { prisma } from "@/client";

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
  questions: {
    id: string;
    indexWithinCategory: number;
    optionOrder: number;
    eventId: number;
  }[],
  categories: { name: string; index: number; eventId: number }[]
) {
  const questionUpdatePromises = questions.map((question) =>
    prisma.question.update({
      where: { eventId: question.eventId, id: question.id },
      data: {
        indexWithinCategory: question.indexWithinCategory,
        optionOrder: question.optionOrder,
      },
    })
  );

  const categoryUpdatePromises = categories.map((category) =>
    prisma.category.update({
      where: { name: category.name, eventId: category.eventId },
      data: { index: category.index },
    })
  );

  await prisma.$transaction([
    ...questionUpdatePromises,
    ...categoryUpdatePromises,
  ]);
}
