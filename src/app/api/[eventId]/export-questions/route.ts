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

async function processQuestions(eventId: number): Promise<ExportQuestion[]> {
  const questions = await fetchQuestions(eventId);

  const maxOptions = Math.max(...questions.map((q) => q.Option.length));

  // Find the maximum number of image URLs across all questions
  const maxImages = Math.max(
    1, // At least one Image URL column
    ...questions.map((q) => {
      const urls = [];
      if (q.imageUrl) urls.push(q.imageUrl);
      if (q.imageUrls) {
        try {
          const parsed = JSON.parse(q.imageUrls);
          if (Array.isArray(parsed)) urls.push(...parsed);
        } catch (e) {
          // ignore parsing errors
        }
      }
      return [...new Set(urls)].length;
    })
  );

  const csvRows = questions.map((q) => {
    const opts = q.Option;

    // Get image URLs manually for this context
    const imageUrls = [];
    if (q.imageUrl) imageUrls.push(q.imageUrl);
    if (q.imageUrls) {
      try {
        const parsed = JSON.parse(q.imageUrls);
        if (Array.isArray(parsed)) imageUrls.push(...parsed);
      } catch (e) {
        // ignore parsing errors
      }
    }
    const uniqueImageUrls = [
      ...new Set(imageUrls.filter((url) => url && url.trim())),
    ];

    const correctOption = opts.find((o) => o.isCorrect)?.option || "";
    const otherOptions = opts.filter((o) => !o.isCorrect).map((o) => o.option);

    while (otherOptions.length < maxOptions - 1) {
      otherOptions.push("");
    }

    const row: ExportQuestion = {
      Category: q.Category.name,
      Question: q.question,
      "Correct Option": correctOption,
      ...Object.fromEntries(
        otherOptions.map((opt, i) => [`Option ${i + 2}`, opt])
      ),
      "Option Order": q.optionOrder,
    };

    // Add image URLs - use multiple columns with same name for multiple images
    uniqueImageUrls.forEach((url, index) => {
      if (index === 0) {
        row["Image URL"] = url;
      } else {
        // For CSV export with multiple Image URL columns, we'll add them with indices
        row[`Image URL ${index + 1}`] = url;
      }
    });

    return row;
  });

  return csvRows;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const eventId = parseInt((await params).eventId, 10);

    let questions = await processQuestions(eventId);

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
