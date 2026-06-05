import type { RecommendationCategory, RecommendationCreateInput, RecommendationUpdateInput } from "@/lib/schemas";

export type { RecommendationCategory };

/** Recommendation record as returned by the API (mirrors the Prisma model). */
export interface IRecommendation {
  id: number;
  title: string;
  description?: string | null;
  category?: RecommendationCategory | null;
  link?: string | null;
  tag?: string | null;
  videoLink?: string | null;
  /** Supabase Storage public URL. */
  fileUrl?: string | null;
  fileName?: string | null;
  // Champs éditoriaux (maquette CULTURHUB — écran de détail)
  author?: string | null;
  year?: string | null;
  publisher?: string | null;
  language?: string | null;
  imageUrl?: string | null;
  tagline?: string | null;
  opinion?: string | null;
  userId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Chat message as returned by the API (mirrors the Prisma `Message` model). */
export interface IMessage {
  id: number;
  content: string;
  userId: number;
  recommendationId?: number | null;
  recommendation?: IRecommendation | null;
  createdAt: Date;
}

/** Body for POST /api/recommendations — inferred from `RecommendationCreateSchema`. */
export type CreateRecommendationData = RecommendationCreateInput;

/** Body for PUT /api/recommendations/[id] — all fields optional plus required `id`. */
export type UpdateRecommendationData = RecommendationUpdateInput & { id: number };
