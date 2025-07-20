import { Category, Question } from "@/generated/prisma";

export function QuestionSlide({
  category,
  question,
}: {
  category: Category;
  question: Question;
}) {
  return (
    <div>
      <h1>{category.name}</h1>
      <p>
        Q{question.indexWithinCategory + 1}: {question.question}
      </p>
    </div>
  );
}
