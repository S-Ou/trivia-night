import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { addEventUpdatedAtMiddleware } from "./middleware";

const prismaClient = new PrismaClient();

addEventUpdatedAtMiddleware(prismaClient);

// https://console.prisma.io/cmdttwfrv01p10ajys0zfvb6g/cmdttycgw01pd0ajybeiu4ljq/cmdttyd7s01pe0ajybu0qrtyr/accelerate/setup
export const prisma = prismaClient.$extends(withAccelerate());
