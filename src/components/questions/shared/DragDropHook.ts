import { useState } from "react";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { toast } from "sonner";

interface DragDropResult {
  source: { index: number };
  destination?: { index: number } | null;
}

interface UseDragDropOptions<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  updateFunction: (items: T[], categories?: any) => Promise<void>;
  successMessage: string;
  errorMessage: string;
}

export function useDragDrop<T>({
  items,
  onReorder,
  updateFunction,
  successMessage,
  errorMessage,
}: UseDragDropOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = async (result: DragDropResult) => {
    if (isSaving) return;
    if (!result.destination) return;

    setIsSaving(true);

    try {
      const newOrder = Array.from(items);
      const [removed] = newOrder.splice(result.source.index, 1);
      newOrder.splice(result.destination.index, 0, removed);

      onReorder(newOrder);
      await updateFunction(newOrder);
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error updating items:`, error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleDragEnd,
    isSaving,
  };
}

interface UseCategoryDragDropOptions<T> {
  categories: T[];
  onReorder: (newCategories: T[]) => void;
  updateFunction: (questions: any, categories: T[]) => Promise<void>;
  successMessage: string;
  errorMessage: string;
}

export function useCategoryDragDrop<T>({
  categories,
  onReorder,
  updateFunction,
  successMessage,
  errorMessage,
}: UseCategoryDragDropOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = async (result: DragDropResult) => {
    if (isSaving) return;
    if (!result.destination) return;

    setIsSaving(true);

    try {
      const newOrder = Array.from(categories);
      const [removed] = newOrder.splice(result.source.index, 1);
      newOrder.splice(result.destination.index, 0, removed);

      onReorder(newOrder);
      await updateFunction(null, newOrder);
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error updating categories:`, error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleDragEnd,
    isSaving,
  };
}
