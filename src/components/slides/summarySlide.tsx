import { Category, Question } from "@/generated/prisma";

export function SummarySlide({category, questions}: {
  category: Category;
  questions: Question[];
}) {
  return (
    <div>
      <h1>{category.name}</h1>
      <h2>Summary of Questions</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            {index + 1}. {question.question}
          </li>
        ))}
      </ul>
    </div>
  );
}