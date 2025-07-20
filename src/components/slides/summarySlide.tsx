import { Category } from "@/generated/prisma";
import BaseSlide from "./baseSlide";
import { Question } from "@/types/Question";

export function SummarySlide({
  category,
  questions,
}: {
  category: Category;
  questions: Question[];
}) {
  return (
    <BaseSlide>
      <h1>{category.name}</h1>
      <h2>Summary of Questions</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            {index + 1}. {question.question}
          </li>
        ))}
      </ul>
    </BaseSlide>
  );
}
