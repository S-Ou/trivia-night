import {
  Category,
  Option,
  Question as PrismaQuestion,
} from "@/generated/prisma";

export interface Question extends PrismaQuestion {
  category: Category;
  options: Option[];
}
