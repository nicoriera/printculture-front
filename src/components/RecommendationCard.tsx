"use client";

import Link from "next/link";
import { IRecommendation } from "@/types/recommendation";
import { CATEGORY_LABELS } from "@/lib/categories";

interface RecommendationCardProps {
  recommendation: IRecommendation;
  onDelete: (id: number) => void;
}

export default function RecommendationCard({ recommendation, onDelete }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs uppercase tracking-widest text-muted bg-rose-light/60 px-3 py-1 rounded-full">
          {recommendation.category ? CATEGORY_LABELS[recommendation.category] : "—"}
        </span>
        {recommendation.tag && (
          <span className="text-xs text-subtle">#{recommendation.tag}</span>
        )}
      </div>

      <h3 className="font-serif text-lg text-ink mb-2 leading-snug">
        {recommendation.title}
      </h3>

      {recommendation.description && (
        <p className="text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
          {recommendation.description}
        </p>
      )}

      {recommendation.videoLink && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <iframe
            src={recommendation.videoLink}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-48"
          />
        </div>
      )}

      {recommendation.link && (
        <a
          href={recommendation.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose text-sm block mb-3 hover:text-ink transition-colors underline underline-offset-2">
          Voir le lien →
        </a>
      )}

      {recommendation.fileUrl && (
        <a
          href={recommendation.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted text-sm block mb-3 hover:text-ink transition-colors">
          📎 {recommendation.fileName}
        </a>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-ink/5 mt-4">
        <Link
          href={`/recommendations/${recommendation.id}`}
          className="text-sm text-ink underline underline-offset-2 hover:text-muted transition-colors">
          Détails
        </Link>
        <button
          onClick={() => recommendation.id && onDelete(recommendation.id)}
          className="text-xs text-subtle hover:text-red-400 transition-colors">
          Supprimer
        </button>
      </div>
    </div>
  );
}
