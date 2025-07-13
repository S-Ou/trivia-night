import { prisma } from "@/client";
import { Category } from "@/generated/prisma";
import { Question } from "@/types/Question";
import { convertToQuestionData } from "@/utils/csvHandler";
import { NextRequest, NextResponse } from "next/server";

async function createCategories(categories: Category[]) {
  const categoryNames = Array.from(new Set(categories.map((c) => c.name)));

  const existingCategories = await prisma.category.findMany({
    where: {
      name: { in: categoryNames },
    },
    select: { name: true },
  });

  const existingNames = new Set(existingCategories.map((c) => c.name));

  const newCategories = categoryNames.filter((c) => !existingNames.has(c));

  if (newCategories.length > 0) {
    await prisma.category.createMany({
      data: newCategories.map((name) => ({
        name: name,
      })),
    });
  }

  await prisma.currentCategory.createMany({
    data: categoryNames.map((c, i) => ({
      categoryName: c,
      index: i,
    })),
  });
}

async function clearExistingData() {
  await prisma.questionCategory.deleteMany({});
  await prisma.currentCategory.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.option.deleteMany({});
}

async function createQuestions(questions: Question[]) {
  const questionData = await prisma.question.createManyAndReturn({
    data: questions.map((q) => ({
      question: q.question,
      questionType: q.questionType,
      imageUrl: q.imageUrl,
    })),
  });

  questions.forEach((q, i) => {
    q.id = questionData[i].id;
  });

  console.log(
    questions.flatMap((q) =>
      q.options.map((o) => ({
        questionId: q.id,
        option: o.option,
        isCorrect: o.isCorrect,
      }))
    )
  );

  await prisma.option.createMany({
    data: questions.flatMap((q) =>
      q.options.map((o) => ({
        questionId: q.id,
        option: o.option,
        isCorrect: o.isCorrect,
      }))
    ),
  });

  const questionsByCategory = questions.reduce<Record<string, Question[]>>(
    (acc, q) => {
      const catName = q.category.name;
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(q);
      return acc;
    },
    {}
  );

  const questionCategoryData = Object.entries(questionsByCategory).flatMap(
    ([categoryName, qs]) =>
      qs.map((q, idx) => ({
        questionId: q.id,
        categoryName,
        indexWithinCategory: idx,
      }))
  );

  await prisma.questionCategory.createMany({
    data: questionCategoryData,
  });
}

async function uploadQuestions(questions: Question[]) {
  await clearExistingData();
  await createCategories(Array.from(new Set(questions.map((q) => q.category))));
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
