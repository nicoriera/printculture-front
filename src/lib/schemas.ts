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
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une lettre majuscule")
    .regex(/[0-9]/, "Au moins un chiffre")
    .describe("Mot de passe (min. 8 caractères, 1 majuscule, 1 chiffre)"),
});

// Recommendations

/** Allowed recommendation categories. */
export const RECOMMENDATION_CATEGORIES = ["Movie", "Book", "Music", "Podcast", "Exhibition"] as const;

/** Union type of all valid recommendation categories. */
export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORIES)[number];

/** True for localhost, private ranges and link-local/cloud-metadata hosts (SSRF surface). */
function isPrivateHost(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, ""); // strip IPv6 brackets
  return (
    ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(h) ||
    /^(10|127)\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) || // 172.16.0.0/12
    /^169\.254\./.test(h) || // link-local + 169.254.169.254 cloud metadata
    h.endsWith(".internal") ||
    h.endsWith(".local")
  );
}

/** Rejects non-http(s) schemes and localhost/private/link-local hosts to prevent SSRF. */
const safeUrl = (errorMessage: string) =>
  z
    .string()
    .url(errorMessage)
    .refine((url) => {
      try {
        const { protocol, hostname } = new URL(url);
        return (protocol === "https:" || protocol === "http:") && !isPrivateHost(hostname);
      } catch {
        return false;
      }
    }, "URL non autorisée");

/** Allowed video embed hosts — limits where an `<iframe src>` can point. */
const EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
]);

/** A safe URL further restricted to known video embed providers (YouTube/Vimeo). */
const embedUrl = (errorMessage: string) =>
  safeUrl(errorMessage).refine((url) => {
    try {
      return EMBED_HOSTS.has(new URL(url).hostname);
    } catch {
      return false;
    }
  }, "Hébergeur vidéo non autorisé (YouTube ou Vimeo)");

/** Zod schema for creating a recommendation. Source of truth for the POST /api/recommendations body. */
export const RecommendationCreateSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255).describe("Titre de la recommandation"),
  description: z.string().max(5000).optional().describe("Description ou critique libre"),
  category: z.enum(RECOMMENDATION_CATEGORIES).optional().describe("Catégorie : Movie | Book | Music | Podcast | Exhibition"),
  link: safeUrl("URL invalide").optional().or(z.literal("")).describe("Lien externe (site, article…)"),
  tag: z.string().max(100).optional().describe("Tag ou mot-clé libre"),
  videoLink: embedUrl("URL de vidéo invalide").optional().or(z.literal("")).describe("URL d'embed vidéo (YouTube, Vimeo…)"),
  fileUrl: z.string().optional().describe("URL Supabase Storage du fichier attaché"),
  fileName: z.string().optional().describe("Nom original du fichier attaché"),
  // Champs éditoriaux (maquette CULTURHUB — écran de détail)
  author: z.string().max(255).optional().describe("Auteur, réalisateur, artiste…"),
  year: z.string().max(20).optional().describe("Année de parution / sortie"),
  publisher: z.string().max(255).optional().describe("Éditeur, label, studio…"),
  language: z.string().max(60).optional().describe("Langue"),
  imageUrl: safeUrl("URL d'image invalide").optional().or(z.literal("")).describe("URL de la vignette / couverture"),
  tagline: z.string().max(300).optional().describe("Accroche courte sous le titre"),
  opinion: z.string().max(2000).optional().describe("« Notre avis » — verdict partagé"),
});

/** Zod schema for partial updates — all fields from create are optional. */
export const RecommendationUpdateSchema = RecommendationCreateSchema.partial();

// Messages (chat « Échanges »)

/** Zod schema for creating a chat message. Source of truth for POST /api/messages. */
export const MessageCreateSchema = z.object({
  content: z.string().min(1, "Le message est requis").max(2000).describe("Contenu du message"),
  recommendationId: z.number().int().positive().optional().describe("Reco partagée dans le fil"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RecommendationCreateInput = z.infer<typeof RecommendationCreateSchema>;
export type RecommendationUpdateInput = z.infer<typeof RecommendationUpdateSchema>;
export type MessageCreateInput = z.infer<typeof MessageCreateSchema>;
