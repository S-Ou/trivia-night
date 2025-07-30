import {
  deleteResult,
  fetchResults,
  updateResults,
} from "@/services/resultsService";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const eventId = parseInt((await params).eventId, 10);
    const results = await fetchResults(eventId);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { results } = await request.json();
  const eventId = parseInt((await params).eventId, 10);

  if (!Array.isArray(results)) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const updatedResults = await updateResults(eventId, results);

    return new Response(JSON.stringify(updatedResults), { status: 200 });
  } catch (error) {
    console.error("Error saving results:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { playerId } = await request.json();
  const eventId = parseInt((await params).eventId, 10);

  if (!eventId || !playerId) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const results = await deleteResult(eventId, playerId);

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Error deleting result:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
