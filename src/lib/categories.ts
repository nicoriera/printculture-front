import { RecommendationCategory } from "@/lib/schemas";

export const CATEGORY_COLORS: Record<RecommendationCategory, string> = {
  Movie: "bg-category-movie",
  Book: "bg-category-book",
  Music: "bg-category-music",
  Podcast: "bg-category-podcast",
};

export const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  Movie: "🎬 Films",
  Book: "📚 Livres",
  Music: "🎵 Musique",
  Podcast: "🎧 Podcasts",
};

export const CATEGORY_HEADING_COLORS: Record<RecommendationCategory, string> = {
  Movie: "text-orange-600",
  Book: "text-green-600",
  Music: "text-red-600",
  Podcast: "text-blue-600",
};

export function getCategoryColor(category?: string | null): string {
  return CATEGORY_COLORS[category as RecommendationCategory] ?? "bg-secondary-100";
}
