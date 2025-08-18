import { updateQuestion } from "@/services/questionService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string; questionId: string }> }
) {
  const { questionId } = await params;
  const data = await request.json();

  try {
    const updatedQuestion = await updateQuestion(questionId, data);

    return new Response(
      JSON.stringify({
        message: "Question updated successfully",
        question: updatedQuestion,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
