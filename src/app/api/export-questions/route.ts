import { fetchQuestions } from "@/services/questionService";
import { csvTemplate } from "@/utils/csvHandler";
import { NextResponse } from "next/server";

interface ExportQuestion {
  Category: string;
  Question: string;
  "Correct Option": string;
  "Option Order"?: number;
  [key: string]: string | number | undefined;
}

async function processQuestions(): Promise<ExportQuestion[]> {
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
    let questions = await processQuestions();

    if (questions.length === 0) {
      questions = [csvTemplate];
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
