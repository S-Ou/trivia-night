import { PrismaClient } from "@/generated/prisma";
import { addEventUpdatedAtMiddleware } from "./middleware";

const prismaClient = new PrismaClient();

addEventUpdatedAtMiddleware(prismaClient);

export const prisma = prismaClient;
