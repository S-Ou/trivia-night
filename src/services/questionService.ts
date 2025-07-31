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
  console.log("Updating question orders", { questions, categories });
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
