import { fetchQuestions } from "@/app/services/questionService";
import { NextResponse } from "next/server";

async function processQuestions() {
  const questions = await fetchQuestions();

  const maxOptions = Math.max(...questions.map((q) => q.Option.length));

  const csvRows = questions.map((q) => {
    const opts = q.Option;

    const correctOption = opts.find((o) => o.isCorrect)?.option || "";
    const otherOptions = opts.filter((o) => !o.isCorrect).map((o) => o.option);

    while (otherOptions.length < maxOptions - 1) {
      otherOptions.push("");
    }

    return {
      Category: q.categoryName,
      Question: q.question,
      "Correct Option": correctOption,
      ...Object.fromEntries(
        otherOptions.map((opt, i) => [`Option ${i + 2}`, opt])
      ),
      "Option Order": q.optionOrder,
    };
  });

  return csvRows;
}

export async function GET() {
  try {
    const questions = await processQuestions();

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
