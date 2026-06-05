import { RecommendationCategory } from "@/lib/schemas";

/** Tailwind background class for each category badge. */
export const CATEGORY_COLORS: Record<RecommendationCategory, string> = {
  Movie: "bg-category-movie",
  Book: "bg-category-book",
  Music: "bg-category-music",
  Podcast: "bg-category-podcast",
  Exhibition: "bg-category-exhibition",
};

/** French display label for each category. */
export const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  Movie: "Films",
  Book: "Livres",
  Music: "Musique",
  Podcast: "Podcasts",
  Exhibition: "Expositions",
};

/** Returns the Tailwind background class for a category string, defaulting to `bg-surface`. */
export function getCategoryColor(category?: string | null): string {
  return CATEGORY_COLORS[category as RecommendationCategory] ?? "bg-surface";
}
