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
