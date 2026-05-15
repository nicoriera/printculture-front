"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IRecommendation } from "@/types/recommendation";
import { CATEGORY_LABELS } from "@/lib/categories";

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`/api/recommendations/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recommendation");
        }

        setRecommendation(data.data.recommendation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchRecommendation();
  }, [params.id]);

  const goBack = () => router.push("/recommendations");

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
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-subtle hover:text-surface transition-colors mb-12 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour
        </button>

        <div className="flex items-center gap-3 mb-8">
          {recommendation.category && (
            <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-rose/20 text-rose-light">
              {CATEGORY_LABELS[recommendation.category]}
            </span>
          )}
          {recommendation.tag && (
            <span className="text-xs text-subtle">#{recommendation.tag}</span>
          )}
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-surface leading-tight mb-6">
          {recommendation.title}
        </h1>

        {recommendation.description && (
          <p className="text-subtle leading-relaxed mb-8">{recommendation.description}</p>
        )}

        {recommendation.link && (
          <a
            href={recommendation.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose text-sm underline underline-offset-2 hover:text-rose-light transition-colors block mb-4">
            Voir le lien →
          </a>
        )}

        {recommendation.fileUrl && (
          <a
            href={recommendation.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-subtle text-sm hover:text-surface transition-colors block mb-4">
            📎 {recommendation.fileName || "Fichier joint"}
          </a>
        )}

        {recommendation.videoLink && (
          <div className="mt-8 rounded-2xl overflow-hidden">
            <iframe
              width="560"
              height="315"
              src={recommendation.videoLink}
              title="Vidéo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-56 md:h-80"
            />
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-surface/10">
          <p className="text-xs text-subtle uppercase tracking-widest">
            Ajouté le{" "}
            {recommendation.createdAt &&
              new Date(recommendation.createdAt).toLocaleDateString("fr-FR", {
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
