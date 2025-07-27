import { createEvent } from "@/services/eventService";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const newEvent = await createEvent();

    return NextResponse.json(newEvent, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
