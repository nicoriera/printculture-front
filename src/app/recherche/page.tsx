"use client";

import { useMemo, useState } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import FeedCard from "@/components/FeedCard";
import { RECOMMENDATION_CATEGORIES, RecommendationCategory } from "@/lib/schemas";
import { CATEGORY_LABELS } from "@/lib/categories";

export default function RecherchePage() {
  const { recommendations, isLoading } = useRecommendations();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RecommendationCategory | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recommendations.filter((rec) => {
      if (category !== "all" && rec.category !== category) return false;
      if (!q) return true;
      return [rec.title, rec.author, rec.tag, rec.description]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [recommendations, query, category]);

  return (
    <div className="bg-surface min-h-screen">
      <section className="px-6 pt-8 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-6">Recherche</h1>

        {/* Search field */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, auteur, mot-clé…"
            autoFocus
            className="w-full bg-white border border-rose-light rounded-full pl-12 pr-5 py-3 text-ink text-sm focus:outline-none focus:border-rose focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-1 transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            Tout
          </FilterChip>
          {RECOMMENDATION_CATEGORIES.map((cat) => (
            <FilterChip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
              {CATEGORY_LABELS[cat]}
            </FilterChip>
          ))}
        </div>

        {/* Results */}
        {isLoading && recommendations.length === 0 ? (
          <p className="text-muted text-sm">Chargement…</p>
        ) : results.length === 0 ? (
          <p className="text-muted text-sm py-10 text-center">Aucun résultat.</p>
        ) : (
          <div className="space-y-3 pb-4">
            {results.map((rec) => (
              <FeedCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition-colors ${
        active
          ? "bg-ink text-surface border-ink"
          : "bg-white/60 text-muted border-ink/10 hover:border-ink/30"
      }`}>
      {children}
    </button>
  );
}
