import { prisma } from "@/client";
import { Question } from "@/types/Question";
import { convertToQuestionData } from "@/utils/csvHandler";
import { NextRequest, NextResponse } from "next/server";

async function clearExistingData() {
  await prisma.category.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.option.deleteMany({});
}

async function createCategories(categories: Question["categoryName"][]) {
  const uniqueCategories = Array.from(new Set(categories));

  await prisma.category.createMany({
    data: uniqueCategories.map((c, i) => ({
      name: c,
      index: i,
    })),
  });
}

async function createQuestions(questions: Question[]) {
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
      }))
    ),
  });
}

async function uploadQuestions(questions: Question[]) {
  await clearExistingData();
  await createCategories(questions.map((q) => q.categoryName));
  await createQuestions(questions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const questions = body.questions;

    const parsedQuestions = questions.map(convertToQuestionData);

    await uploadQuestions(parsedQuestions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
