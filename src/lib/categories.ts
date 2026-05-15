import { RecommendationCategory } from "@/lib/schemas";

/** Tailwind background class for each category badge. */
export const CATEGORY_COLORS: Record<RecommendationCategory, string> = {
  Movie: "bg-category-movie",
  Book: "bg-category-book",
  Music: "bg-category-music",
  Podcast: "bg-category-podcast",
};

/** French display label for each category. */
export const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  Movie: "Films",
  Book: "Livres",
  Music: "Musique",
  Podcast: "Podcasts",
};

export const CATEGORY_HEADING_COLORS: Record<RecommendationCategory, string> = {
  Movie: "text-ink",
  Book: "text-ink",
  Music: "text-ink",
  Podcast: "text-ink",
};

/** Returns the Tailwind background class for a category string, defaulting to `bg-surface`. */
export function getCategoryColor(category?: string | null): string {
  return CATEGORY_COLORS[category as RecommendationCategory] ?? "bg-surface";
}
