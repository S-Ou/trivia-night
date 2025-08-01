import { Results } from "@/generated/prisma/wasm";
import {
  createResult,
  deleteResult,
  fetchResults,
  updateResult,
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
    var updatedResults: Results[];
    if (results.length === 0) {
      return new Response("No results to update", { status: 400 });
    } else if (results.length === 1) {
      updatedResults = [await updateResult(eventId, results[0])];
    } else {
      updatedResults = await updateResults(eventId, results);
    }

    const response = new Response(JSON.stringify(updatedResults), {
      status: 200,
    });

    return response;
  } catch (error) {
    console.error("Error saving results:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  console.log("Creating result...");
  const eventId = parseInt((await params).eventId, 10);
  const { playerName } = await request.json();

  console.log(
    "Creating result for eventId:",
    eventId,
    "with playerName:",
    playerName
  );

  if (!eventId || !playerName) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const newResult = await createResult(eventId, playerName);
    return new Response(JSON.stringify(newResult), { status: 201 });
  } catch (error) {
    console.error("Error creating result:", error);
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
