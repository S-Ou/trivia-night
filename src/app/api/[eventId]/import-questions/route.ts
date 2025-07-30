import { prisma } from "@/client";
import { Question } from "@/types/Question";
import { convertToQuestionData } from "@/utils/csvHandler";
import { randomPermutationIndex } from "@/utils/permutations";
import { NextRequest, NextResponse } from "next/server";

async function clearExistingData(eventId: number) {
  await prisma.category.deleteMany({
    where: { eventId },
  });
  await prisma.question.deleteMany({
    where: { eventId },
  });
  await prisma.option.deleteMany({
    where: { eventId },
  });
}

async function createCategories(
  categories: Question["categoryName"][],
  eventId: number
) {
  const uniqueCategories = Array.from(new Set(categories));

  await prisma.category.createMany({
    data: uniqueCategories.map((c, i) => ({
      name: c,
      index: i,
      eventId,
    })),
  });
}

async function createQuestions(questions: Question[], eventId: number) {
  const indexMap = new Map<string, number>();

  const questionData = await prisma.question.createManyAndReturn({
    data: questions.map((q) => ({
      question: q.question,
      questionType: q.questionType,
      categoryName: q.categoryName,
      imageUrl: q.imageUrl,
      indexWithinCategory: indexMap
        .set(q.categoryName, (indexMap.get(q.categoryName) ?? -1) + 1)
        .get(q.categoryName)!,
      optionOrder:
        q.optionOrder != -1
          ? q.optionOrder
          : randomPermutationIndex(q.options.length),
      eventId,
    })),
  });

  questions.forEach((q, i) => {
    q.id = questionData[i].id;
  });

  await prisma.option.createMany({
    data: questions.flatMap((q) =>
      q.options.map((o) => ({
        questionId: q.id,
        option: o.option,
        isCorrect: o.isCorrect,
        eventId,
      }))
    ),
  });
}

async function uploadQuestions(questions: Question[], eventId: number) {
  await clearExistingData(eventId);
  await createCategories(
    questions.map((q) => q.categoryName),
    eventId
  );
  await createQuestions(questions, eventId);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await req.json();
    const questions = body.questions;
    const eventId = parseInt((await params).eventId, 10);

    const parsedQuestions = questions.map(convertToQuestionData);

    await uploadQuestions(parsedQuestions, eventId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 422 }
    );
  }
}
