"use client";

import { useState } from "react";
import Link from "next/link";
import { IRecommendation } from "@/types/recommendation";
import { CATEGORY_LABELS, getCategoryColor } from "@/lib/categories";
import RecoThumbnail from "@/components/RecoThumbnail";

interface FeedCardProps {
  recommendation: IRecommendation;
}

/**
 * Feed row used on the home & search screens (maquette CULTURHUB).
 * Thumbnail (cover image or a category-tinted placeholder) + editorial text.
 */
export default function FeedCard({ recommendation: rec }: FeedCardProps) {
  const [saved, setSaved] = useState(false);
  const categoryBg = getCategoryColor(rec.category);
  const label = rec.category ? CATEGORY_LABELS[rec.category] : null;

  return (
    <Link
      href={`/recommendations/${rec.id}`}
      className="group flex gap-4 rounded-2xl bg-white/70 border border-ink/5 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail */}
      <RecoThumbnail
        rec={rec}
        className={`w-24 h-24 rounded-xl ${categoryBg}`}
        textClassName="text-2xl text-ink/40"
      />

      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          {label && (
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-subtle">{label}</span>
          )}
          <button
            type="button"
            aria-label={saved ? "Retirer des favoris" : "Enregistrer"}
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            className="-mt-0.5 text-subtle hover:text-ink transition-colors shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <h3 className="font-serif text-lg text-ink leading-snug truncate">{rec.title}</h3>
        {rec.author && <p className="text-sm text-muted truncate">{rec.author}</p>}
        {rec.description && (
          <p className="text-xs text-muted/90 mt-1 line-clamp-2 leading-relaxed">{rec.description}</p>
        )}
      </div>
    </Link>
  );
}
