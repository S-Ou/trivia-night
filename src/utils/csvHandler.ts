import { Question } from "@/types/Question";
import { decode } from "iconv-lite";
import Papa from "papaparse";
import { Buffer } from "buffer";
import { setImageUrls } from "./imageUtils";

export interface RowData {
  [key: string]: string;
}

// Custom parser to handle duplicate column names
export function parseCsvFileWithDuplicateColumns(
  file: File,
  callback: (data: RowData[], headers: string[]) => void
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

    // Parse CSV manually to handle duplicate headers
    const lines = decodedText.split("\n");
    if (lines.length === 0) {
      callback([], []);
      return;
    }

    // Parse first line as headers
    const headerLine = lines[0];
    const headerResult = Papa.parse<string[]>(headerLine);
    const headers = headerResult.data[0] || [];

    // Parse data rows
    const dataRows: RowData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const rowResult = Papa.parse<string[]>(line);
      const rowData = rowResult.data[0] || [];

      const row: RowData = {};
      headers.forEach((header, index) => {
        const value = rowData[index] || "";
        if (!row[header]) {
          row[header] = value;
        } else {
          // Handle duplicate column names by creating arrays
          if (Array.isArray(row[header])) {
            (row[header] as string[]).push(value);
          } else {
            row[header] = [row[header], value] as unknown as string;
          }
        }
      });

      dataRows.push(row);
    }

    callback(dataRows, headers);
  };

  reader.readAsArrayBuffer(file);
}

export function parseCsvFile(
  file: File,
  callback: (data: RowData[]) => void
): void {
  parseCsvFileWithDuplicateColumns(file, (data) => callback(data));
}

export function convertToQuestionData(row: RowData): Question {
  const question = row["Question"];
  const correctOption = row["Correct Option"];
  const options = Object.keys(row)
    .filter((key) => key.startsWith("Option "))
    .filter((opt) => row[opt]);
  const category = row["Category"];
  const order = row["Option Order"] ? parseInt(row["Option Order"], 10) : null;

  // Handle multiple Image URL columns
  const imageUrlValue = row["Image URL"];
  let imageUrls: string[] = [];

  if (imageUrlValue) {
    if (Array.isArray(imageUrlValue)) {
      imageUrls = imageUrlValue.filter((url) => url && url.trim());
    } else if (imageUrlValue.trim()) {
      imageUrls = [imageUrlValue.trim()];
    }
  }

  const allOptions = [correctOption, ...options.map((opt) => row[opt])];

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
    imageUrl: null, // Deprecated - use imageUrls instead
    imageUrls: imageUrls.length > 0 ? setImageUrls(imageUrls) : null,
    categoryId: 0, // Default
    category: {
      id: 0, // Default
      name: category,
      index: 0, // Default
      eventId: 0, // Default
    },
    options: allOptions.map((opt, index) => ({
      option: opt,
      isCorrect: opt === correctOption,
      indexWithinCategory: index,
      id: "",
      questionId: "",
      eventId: 0, // Default
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

  // Add UTF-8 BOM for better Excel compatibility
  const csvWithBOM = "\uFEFF" + csv;

  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
