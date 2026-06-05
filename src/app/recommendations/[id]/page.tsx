"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { IRecommendation } from "@/types/recommendation";
import { CATEGORY_LABELS } from "@/lib/categories";

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center flex-1 gap-2">
      <span className="text-rose">{icon}</span>
      <span className="text-surface text-sm font-medium leading-tight">{value}</span>
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-subtle">{label}</span>
    </div>
  );
}

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`/api/recommendations/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch recommendation");
        setRecommendation(data.data.recommendation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchRecommendation();
  }, [params.id]);

  const goBack = () => router.back();

  /** Partage la reco dans le fil « Échanges » puis y redirige. */
  const share = async () => {
    if (!recommendation) return;
    setSharing(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Je te partage « ${recommendation.title} »`,
          recommendationId: recommendation.id,
        }),
      });
      router.push("/echanges");
    } catch {
      setSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-subtle text-sm">Chargement...</p>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4">
        <p className="text-subtle text-sm">{error || "Recommandation non trouvée"}</p>
        <button
          onClick={goBack}
          className="text-surface text-sm underline underline-offset-2 hover:text-rose transition-colors">
          Retour
        </button>
      </div>
    );
  }

  const rec = recommendation;
  const hasMeta = rec.year || rec.publisher || rec.language;

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 max-w-2xl w-full mx-auto">
        <button onClick={goBack} aria-label="Retour" className="text-surface hover:text-rose transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-5 text-surface">
          <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Enregistrer"
            className="hover:text-rose transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button aria-label="Plus d'options" className="hover:text-rose transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 pt-6 max-w-2xl w-full mx-auto flex-1">
        {/* Category */}
        {rec.category && (
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-subtle mb-5">
            {CATEGORY_LABELS[rec.category]}
          </p>
        )}

        {/* Optional cover */}
        {rec.imageUrl && (
          <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6">
            <Image src={rec.imageUrl} alt={rec.title} fill sizes="(max-width: 672px) 100vw, 672px" unoptimized className="object-cover" />
          </div>
        )}

        {/* Title + author */}
        <h1 className="font-serif text-4xl text-surface leading-tight mb-3">{rec.title}</h1>
        {rec.author && <p className="font-serif text-xl text-rose mb-5">{rec.author}</p>}
        {rec.tagline && <p className="text-subtle leading-relaxed mb-8 max-w-md">{rec.tagline}</p>}

        {/* Meta row */}
        {hasMeta && (
          <>
            <div className="w-10 h-px bg-surface/15 mb-6" />
            <div className="flex justify-between gap-2 mb-2">
              {rec.year && (
                <MetaItem
                  label="Année"
                  value={rec.year}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M3 9h18M8 3v4M16 3v4" />
                    </svg>
                  }
                />
              )}
              {rec.publisher && (
                <MetaItem
                  label="Éditeur"
                  value={rec.publisher}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.25v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.25m0-13C13.2 5.5 14.8 5 16.5 5S19.8 5.5 21 6.25v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.25m0-13v13" />
                    </svg>
                  }
                />
              )}
              {rec.language && (
                <MetaItem
                  label="Langue"
                  value={rec.language}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
                    </svg>
                  }
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Light card */}
      <div className="mt-8 bg-surface rounded-t-3xl px-6 pt-8 pb-10">
        <div className="max-w-2xl mx-auto">
          {rec.description && (
            <>
              <h2 className="text-rose text-xs uppercase tracking-[0.25em] mb-3">À propos</h2>
              <p className="text-muted leading-relaxed mb-8">{rec.description}</p>
            </>
          )}

          {rec.link && (
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-rose text-sm underline underline-offset-2 hover:text-ink transition-colors mb-8">
              Voir le lien →
            </a>
          )}

          {rec.videoLink && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <iframe
                src={rec.videoLink}
                title="Vidéo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-56 md:h-72"
              />
            </div>
          )}

          {rec.opinion && (
            <>
              <h2 className="text-rose text-xs uppercase tracking-[0.25em] mb-4">Notre avis</h2>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-rose-light border-2 border-surface" />
                  <span className="w-8 h-8 rounded-full bg-ink border-2 border-surface" />
                </div>
                <p className="text-ink text-sm">{rec.opinion}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              aria-label="Partager (autre)"
              className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center text-ink hover:bg-rose transition-colors shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" />
              </svg>
            </button>
            <button
              onClick={share}
              disabled={sharing}
              className="flex-1 bg-rose text-ink rounded-full py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-rose-light transition-colors disabled:opacity-60">
              {sharing ? "Partage…" : "Partager"}
            </button>
          </div>

          <p className="text-xs text-subtle uppercase tracking-widest mt-8">
            Ajouté le{" "}
            {rec.createdAt &&
              new Date(rec.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
          </p>
        </div>
      </div>
    </div>
  );
}
