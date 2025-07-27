import { prisma } from "@/client";

export interface UpdateEventDTO {
  title: string;
  description?: string;
  hideResults?: boolean;
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
  let uniqueId: number;
  while (true) {
    uniqueId = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    const existing = await prisma.event.findUnique({ where: { id: uniqueId } });
    if (!existing) break;
  }

  const newEvent = await prisma.event.create({
    data: {
      id: uniqueId,
      title: "Trivia Night",
      description: "",
      hideResults: false,
    },
  });
  return newEvent;
}

export async function deleteEvent(eventId: number) {
  const deletedEvent = await prisma.event.delete({
    where: { id: eventId },
  });
  return deletedEvent;
}
