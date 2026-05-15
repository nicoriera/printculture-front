import { z } from "zod";

// Auth

/** Zod schema for login requests. */
export const LoginSchema = z.object({
  email: z.string().email("Adresse email invalide").describe("Adresse email de l'utilisateur"),
  password: z.string().min(1, "Le mot de passe est requis").describe("Mot de passe en clair"),
});

/** Zod schema for registration requests. */
export const RegisterSchema = z.object({
  email: z.string().email("Adresse email invalide").describe("Adresse email de l'utilisateur"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .describe("Mot de passe en clair (min. 6 caractères)"),
});

// Recommendations

/** Allowed recommendation categories. */
export const RECOMMENDATION_CATEGORIES = ["Movie", "Book", "Music", "Podcast"] as const;

/** Union type of all valid recommendation categories. */
export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORIES)[number];

/** Zod schema for creating a recommendation. Source of truth for the POST /api/recommendations body. */
export const RecommendationCreateSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255).describe("Titre de la recommandation"),
  description: z.string().max(5000).optional().describe("Description ou critique libre"),
  category: z.enum(RECOMMENDATION_CATEGORIES).optional().describe("Catégorie : Movie | Book | Music | Podcast"),
  link: z.string().url("URL invalide").optional().or(z.literal("")).describe("Lien externe (site, article…)"),
  tag: z.string().max(100).optional().describe("Tag ou mot-clé libre"),
  videoLink: z.string().url("URL de vidéo invalide").optional().or(z.literal("")).describe("URL d'embed vidéo (YouTube, Vimeo…)"),
  fileUrl: z.string().optional().describe("URL Supabase Storage du fichier attaché"),
  fileName: z.string().optional().describe("Nom original du fichier attaché"),
});

/** Zod schema for partial updates — all fields from create are optional. */
export const RecommendationUpdateSchema = RecommendationCreateSchema.partial();

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RecommendationCreateInput = z.infer<typeof RecommendationCreateSchema>;
export type RecommendationUpdateInput = z.infer<typeof RecommendationUpdateSchema>;
