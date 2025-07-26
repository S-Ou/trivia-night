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
  const updatePromises = results.map((result) =>
    prisma.results.upsert({
      where: { eventId, playerId: result.playerId },
      update: { score: result.score, playerName: result.playerName },
      create: {
        eventId,
        playerName: result.playerName,
        score: result.score,
      },
    })
  );

  await Promise.all(updatePromises);

  return fetchResults(eventId);
}
