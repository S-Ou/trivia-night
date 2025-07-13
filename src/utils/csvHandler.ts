import { Question } from "@/types/Question";
import Papa from "papaparse";

export interface RowData {
  [key: string]: string;
}

export function parseCsvFile(
  file: File,
  callback: (data: RowData[]) => void
): void {
  Papa.parse<RowData>(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      await callback(results.data);
    },
    error: (err) => {
      console.error("Error parsing CSV:", err);
    },
  });
}

export function downloadCsv(data: RowData[], filename = "export.csv") {
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

export function convertToQuestionData(row: RowData): Question {
  const question = row["Question"];
  const correctOption = row["Correct Option"];
  const options = Object.keys(row)
    .filter((key) => key.startsWith("Option "))
    .filter((opt) => row[opt]);
  const category = row["Category"];

  if (!question || !correctOption || !category) {
    throw new Error("Missing required fields in row data");
  }

  const questionData: Question = {
    question: question,
    questionType: options ? "multiChoice" : "shortAnswer",
    imageUrl: row["Image URL"] || "",
    category: { name: category, createdAt: new Date() },
    options: options.map((opt, index) => ({
      option: row[opt],
      isCorrect: row[opt] === correctOption,
      indexWithinCategory: index,
      id: "",
      questionId: "",
    })),
    id: "",
    createdAt: new Date(),
  };

  return questionData;
}

export function downloadBlankCsvTemplate(filename = "questions-template.csv") {
  const headers = [
    {
      Category: "",
      Question: "",
      "Correct Option": "",
      "Option 2": "",
      "Option 3": "",
      "Option 4": "",
    },
  ];

  const csv = Papa.unparse(headers);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
