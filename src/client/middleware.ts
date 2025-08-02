import { PrismaClient } from "@prisma/client/edge";

export function addEventUpdatedAtMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    // Check if we're modifying Question or Category
    if (
      (params.model === "Question" || params.model === "Category") &&
      (params.action === "create" ||
        params.action === "update" ||
        params.action === "delete" ||
        params.action === "upsert")
    ) {
      let eventId: number | undefined;

      // For delete operations, we need to get the eventId BEFORE deleting
      if (params.action === "delete") {
        if (params.model === "Question") {
          const questionId = params.args?.where?.id;
          if (questionId) {
            const question = await prisma.question.findUnique({
              where: { id: questionId },
              select: { eventId: true },
            });
            eventId = question?.eventId;
          }
        } else if (params.model === "Category") {
          const categoryId = params.args?.where?.id;
          if (categoryId) {
            const category = await prisma.category.findUnique({
              where: { id: categoryId },
              select: { eventId: true },
            });
            eventId = category?.eventId;
          }
        }
      }

      // Execute the original operation
      const result = await next(params);

      // For non-delete operations, get eventId from the data or result
      if (params.action !== "delete") {
        eventId = params.args?.data?.eventId || result?.eventId;
      }

      // Update the Event's updatedAt field
      if (eventId) {
        try {
          await prisma.event.update({
            where: { id: eventId },
            data: { updatedAt: new Date() },
          });
        } catch (error) {
          // Log error but don't fail the original operation
          console.warn(
            `Failed to update Event updatedAt for eventId ${eventId}:`,
            error
          );
        }
      }

      return result;
    }

    return next(params);
  });
}
