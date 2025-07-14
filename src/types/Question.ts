import { Option, Question as PrismaQuestion } from "@/generated/prisma";

export interface Question extends PrismaQuestion {
  options: Option[];
}
