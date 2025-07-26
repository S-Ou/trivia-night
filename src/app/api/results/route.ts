import { fetchResults, updateResults } from "@/services/resultsService";

export async function GET() {
  try {
    const results = await fetchResults(1);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { results } = await request.json();

  if (!Array.isArray(results)) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const updatedResults = await updateResults(1, results);

    return new Response(JSON.stringify(updatedResults), { status: 200 });
  } catch (error) {
    console.error("Error saving results:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
