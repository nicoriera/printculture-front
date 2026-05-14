import type { RecommendationCategory, RecommendationCreateInput, RecommendationUpdateInput } from "@/lib/schemas";

export type { RecommendationCategory };

export interface IRecommendation {
  id: number;
  title: string;
  description?: string | null;
  category?: RecommendationCategory | null;
  link?: string | null;
  tag?: string | null;
  videoLink?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  userId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRecommendationData = RecommendationCreateInput;
export type UpdateRecommendationData = RecommendationUpdateInput & { id: number };
