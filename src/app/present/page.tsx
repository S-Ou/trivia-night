"use client";

import { useEventContext } from "@/contexts/EventContext";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function Present() {
  const { event, isLoading: isEventLoading, updateEvent } = useEventContext();
  const { categories, isLoading: isQuestionLoading } = useQuestionContext();

  if (isEventLoading) {
    return <p>Loading event...</p>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <h2>{event.description}</h2>

      <div>
        {isQuestionLoading ? (
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
