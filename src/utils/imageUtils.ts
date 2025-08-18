import { Question } from "@/types/Question";

/**
 * Utility functions for handling multiple image URLs in questions.
 *
 * The system supports both:
 * - Legacy single imageUrl field (for backward compatibility)
 * - New imageUrls field (JSON array stored as string)
 *
 * Functions automatically merge and deduplicate URLs from both sources.
 */

export function getImageUrls(question: Question): string[] {
  const urls: string[] = [];

  // Prioritize new imageUrls field
  if (question.imageUrls) {
    try {
      const parsed = JSON.parse(question.imageUrls);
      if (Array.isArray(parsed)) {
        urls.push(
          ...parsed.filter((url) => url && url.trim()).map((url) => url.trim())
        );
      }
    } catch (error) {
      console.warn("Failed to parse imageUrls JSON:", error);
    }
  }

  // Fallback to legacy imageUrl only if imageUrls is empty or invalid
  if (urls.length === 0 && question.imageUrl && question.imageUrl.trim()) {
    urls.push(question.imageUrl.trim());
  }

  // Remove duplicates and return
  return [...new Set(urls)];
}

export function setImageUrls(imageUrls: string[]): string {
  const validUrls = imageUrls
    .filter((url) => url && url.trim())
    .map((url) => url.trim());
  return JSON.stringify(validUrls);
}

export function hasImages(question: Question): boolean {
  return getImageUrls(question).length > 0;
}
