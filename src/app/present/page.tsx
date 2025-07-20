"use client";

import { useQuestionContext } from "@/contexts/QuestionContext";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function Present() {
  const { categories, isLoading } = useQuestionContext();

  return (
    <div>
      <h1>Trivia Night</h1>
      <h2>Presented by our generous sponsor</h2>

      <div>
        {isLoading ? (
          <p>Loading questions...</p>
        ) : (
          categories.map((category, index) => (
            <div key={category.name || index}>
              <h3>
                <Link href={`./category/${index}`}>{category.name}</Link>
                <Link href={`./category/${index}?answers=true`}>
                  <CircleCheckBig />
                </Link>
              </h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
