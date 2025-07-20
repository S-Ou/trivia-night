import { fetchEvent, updateEvent } from "@/services/eventService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const event = await fetchEvent(1);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { eventId, data } = await request.json();

    if (!eventId || !data || typeof data.name !== "string") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const updatedEvent = await updateEvent(eventId, data);

    return NextResponse.json(updatedEvent, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error updating event:", err);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
