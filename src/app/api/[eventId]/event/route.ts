import { deleteEvent, fetchEvent, updateEvent } from "@/services/eventService";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const eventId = parseInt((await params).eventId, 10);
    const event = await fetchEvent(eventId);

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const eventId = parseInt((await params).eventId, 10);
    const { data } = await request.json();

    if (!eventId || !data || typeof data.title !== "string") {
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

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const eventId = parseInt((await params).eventId, 10);

    if (!eventId) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    await deleteEvent(eventId);

    return NextResponse.json(
      { message: "Event deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error deleting event:", err);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
