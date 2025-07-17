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

export function convertToQuestionData(row: RowData): Question {
  const question = row["Question"];
  const correctOption = row["Correct Option"];
  const options = Object.keys(row)
    .filter((key) => key.startsWith("Option "))
    .filter((opt) => row[opt]);
  const category = row["Category"];
  const order = row["Option Order"] ? parseInt(row["Option Order"], 10) : null;

  const allOptions = [correctOption, ...options.map((opt) => row[opt])];

  if (!question || allOptions.length <= 0 || !category) {
    throw new Error("Missing required fields in row data");
  }

  const questionData: Question = {
    eventId: 0, // Default
    question: question,
    questionType: options ? "multiChoice" : "shortAnswer",
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

export function exportCsvTemplate() {
  const headers = [
    {
      Category: "",
      Question: "",
      "Image URL": "",
      "Correct Option": "",
      "Option 2": "",
      "Option 3": "",
      "Option 4": "",
    },
  ];

  exportCsv(headers, "blank_template.csv");
}

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
