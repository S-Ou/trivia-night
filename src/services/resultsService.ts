import { prisma } from "@/client";
import { Results } from "@/generated/prisma";

export async function fetchResults(eventId: number) {
  const results = await prisma.results.findMany({
    where: { eventId },
    orderBy: {
      score: "desc",
    },
  });

  return results;
}

export async function updateResults(eventId: number, results: Results[]) {
  const updatePromises = results.map((result) => {
    return prisma.results.upsert({
      where: { playerId: result.playerId },
      update: { score: result.score, playerName: result.playerName },
      create: {
        eventId,
        playerName: result.playerName,
        score: result.score,
      },
    });
  });

  await Promise.all(updatePromises);

  return fetchResults(eventId);
}

export async function updateResult(eventId: number, result: Results) {
  const updatedResult = await prisma.results.upsert({
    where: { playerId: result.playerId },
    update: { score: result.score, playerName: result.playerName },
    create: {
      eventId,
      playerId: result.playerId,
      playerName: result.playerName,
      score: result.score,
    },
  });

  return updatedResult;
}

export async function createResult(eventId: number, playerName: string) {
  const newResult = await prisma.results.create({
    data: {
      eventId,
      playerName,
      score: 0,
    },
  });
  return newResult;
}

export async function deleteResult(eventId: number, playerId: string) {
  await prisma.results.deleteMany({
    where: { eventId, playerId },
  });

  return fetchResults(eventId);
}
