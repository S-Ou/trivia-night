import { prisma } from "@/client";

export interface UpdateEventDTO {
  title: string;
  description?: string;
  hideResults?: boolean;
  themeId?: string;
  themeBackgroundColor?: string;
  themeForegroundColor?: string;
  themeAccentColor?: string;
}

export async function fetchEvent(eventId: number) {
  const config = await prisma.event.findFirst({
    where: { id: eventId },
  });
  return config;
}

export async function updateEvent(eventId: number, data: UpdateEventDTO) {
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data,
  });
  return updatedEvent;
}

export async function createEvent() {
  while (true) {
    const uniqueId = Math.floor(10000 + Math.random() * 90000); // 5-digit number

    try {
      const newEvent = await prisma.event.create({
        data: {
          id: uniqueId,
          title: "Trivia Night",
          description: "",
          hideResults: false,
        },
      });
      return newEvent;
    } catch (error) {
      // If it's a unique constraint violation, try again with a new ID
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        continue;
      }
      throw error;
    }
  }
}

export async function deleteEvent(eventId: number) {
  const deletedEvent = await prisma.event.delete({
    where: { id: eventId },
  });
  return deletedEvent;
}
