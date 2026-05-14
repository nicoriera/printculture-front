import { z } from "zod";

// Auth
export const LoginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Recommendations
export const RECOMMENDATION_CATEGORIES = ["Movie", "Book", "Music", "Podcast"] as const;
export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORIES)[number];

export const RecommendationCreateSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255),
  description: z.string().max(5000).optional(),
  category: z.enum(RECOMMENDATION_CATEGORIES).optional(),
  link: z.string().url("URL invalide").optional().or(z.literal("")),
  tag: z.string().max(100).optional(),
  videoLink: z.string().url("URL de vidéo invalide").optional().or(z.literal("")),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export const RecommendationUpdateSchema = RecommendationCreateSchema.partial();

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RecommendationCreateInput = z.infer<typeof RecommendationCreateSchema>;
export type RecommendationUpdateInput = z.infer<typeof RecommendationUpdateSchema>;
