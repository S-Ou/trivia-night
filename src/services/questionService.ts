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
