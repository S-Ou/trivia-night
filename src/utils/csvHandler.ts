import { Question } from "@/types/Question";
import { decode } from "iconv-lite";
import Papa from "papaparse";
import { Buffer } from "buffer";

export interface RowData {
  [key: string]: string;
}

export function parseCsvFile(
  file: File,
  callback: (data: RowData[]) => void
): void {
  const reader = new FileReader();

  reader.onload = () => {
    const buffer = reader.result as ArrayBuffer;
    const bytes = new Uint8Array(buffer);

    // Try UTF-8 first
    let decodedText = decode(Buffer.from(bytes), "utf-8");

    // If replacement chars exist, fallback to windows-1252
    if (decodedText.includes("�")) {
      decodedText = decode(Buffer.from(bytes), "windows-1252");
    }

    Papa.parse<RowData>(decodedText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        callback(results.data);
      },
    });
  };

  reader.readAsArrayBuffer(file);
}

export function convertToQuestionData(row: RowData): Question {
  const question = row["Question"];
  const correctOption = row["Correct Option"];
  const options = Object.keys(row)
    .filter((key) => key.startsWith("Option "))
    .filter((opt) => row[opt]);
  const category = row["Category"];
  const order = row["Option Order"] ? parseInt(row["Option Order"], 10) : null;

  const allOptions = [correctOption, ...options.map((opt) => row[opt])];

  console.log(row);

  if (!question || question.trim() === "") {
    throw new Error("Question field is required");
  }
  if (!correctOption || correctOption.trim() === "") {
    throw new Error(
      "Correct Option field is required" +
        (question ? ` for "${question}"` : "")
    );
  }
  if (allOptions.length === 0) {
    throw new Error(
      "At least one option is required" + (question ? ` for "${question}"` : "")
    );
  }
  if (!category || category.trim() === "") {
    throw new Error(
      "Category field is required" + (question ? ` for "${question}"` : "")
    );
  }

  const questionData: Question = {
    eventId: 0, // Default
    question: question,
    questionType: options.length > 0 ? "multiChoice" : "shortAnswer",
    imageUrl: row["Image URL"] || "",
    categoryName: category,
    options: allOptions.map((opt, index) => ({
      option: opt,
      isCorrect: opt === correctOption,
      indexWithinCategory: index,
      id: "",
      questionId: "",
    })),
    id: "",
    indexWithinCategory: -1,
    optionOrder: order ?? -1,
  };

  return questionData;
}

export const csvTemplate = {
  Category: "",
  Question: "",
  "Image URL": "",
  "Correct Option": "",
  "Option 2": "",
  "Option 3": "",
  "Option 4": "",
};

export function exportCsv(data: Array<object>, filename = "export.csv") {
  const csv = Papa.unparse(data);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
