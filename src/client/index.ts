import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { addEventUpdatedAtMiddleware } from "./middleware";

const basePrismaClient = new PrismaClient();

addEventUpdatedAtMiddleware(basePrismaClient);

// https://console.prisma.io/cmdttwfrv01p10ajys0zfvb6g/cmdttycgw01pd0ajybeiu4ljq/cmdttyd7s01pe0ajybu0qrtyr/accelerate/setup
export const prisma = basePrismaClient.$extends(withAccelerate());
