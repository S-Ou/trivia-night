import { prisma } from "@/client";
import { NextResponse } from "next/server";

async function fetchQuestions() {
  const questions = await prisma.questionCategory.findMany({
    include: {
      question: {
        include: {
          Option: true,
        },
      },
      category: true,
    },
  });

  const categoryOrder = await prisma.currentCategory.findMany({
    orderBy: { index: "asc" },
    select: { categoryName: true },
  });

  const orderedCategories = categoryOrder.map((c) => c.categoryName);

  const sortedQuestions = questions.sort((a, b) => {
    const catA = orderedCategories.indexOf(a.categoryName);
    const catB = orderedCategories.indexOf(b.categoryName);

    if (catA !== catB) return catA - catB;
    return a.indexWithinCategory - b.indexWithinCategory;
  });

  const maxOptions = Math.max(
    ...sortedQuestions.map((q) => q.question.Option.length)
  );

  const csvRows = sortedQuestions.map((q) => {
    const opts = q.question.Option;

    const correctOption = opts.find((o) => o.isCorrect)?.option || "";
    const otherOptions = opts.filter((o) => !o.isCorrect).map((o) => o.option);

    while (otherOptions.length < maxOptions - 1) {
      otherOptions.push("");
    }

    return {
      Category: q.categoryName,
      Question: q.question.question,
      "Correct Option": correctOption,
      ...Object.fromEntries(
        otherOptions.map((opt, i) => [`Option ${i + 2}`, opt])
      ),
    };
  });

  return csvRows;
}

export async function GET() {
  try {
    const questions = await fetchQuestions();

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(questions, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to download questions" },
      { status: 500 }
    );
  }
}
