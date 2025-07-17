import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedConfig() {
  const defaults = [{ name: "title", value: "Trivia Night" }];

  for (const config of defaults) {
    await prisma.event.upsert({
      where: { name: config.name },
      update: {},
      create: config,
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
