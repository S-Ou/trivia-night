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
  console.time("total-request");
  console.time("parse-request");
  const { results } = await request.json();
  const eventId = parseInt((await params).eventId, 10);
  console.timeEnd("parse-request");

  if (!Array.isArray(results)) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    console.log(`Updating ${results.length} results for event ${eventId}`);
    console.time("updateResults");
    const updatedResults = await updateResults(eventId, results);
    console.timeEnd("updateResults");

    console.time("serialize-response");
    const response = new Response(JSON.stringify(updatedResults), {
      status: 200,
    });
    console.timeEnd("serialize-response");
    console.timeEnd("total-request");

    return response;
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
