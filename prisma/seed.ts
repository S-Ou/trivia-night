import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedConfig() {
  const defaults = [{ id: 1, title: "Trivia Night" }];

  for (const event of defaults) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }
}

async function main() {
  console.log("Seeding database...");

  await seedConfig();

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
