"use client";

import { useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import CategorySection from "@/components/CategorySection";
import { RECOMMENDATION_CATEGORIES, RecommendationCategory } from "@/lib/schemas";
import { useModal } from "@/contexts/ModalContext";

export default function RecommendationsPage() {
  const { recommendations, isLoading, fetchRecommendations, deleteRecommendation } =
    useRecommendations();
  const { lastCreated, open: openModal } = useModal();

  useEffect(() => {
    if (lastCreated) fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCreated]);

  const getByCategory = (category: RecommendationCategory) =>
    recommendations.filter((rec) => rec.category === category);

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="text-subtle text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ink mb-1">Mes recommandations</h1>
          <p className="text-muted text-sm">Ce qui compte, partagé avec soin.</p>
        </div>

        {RECOMMENDATION_CATEGORIES.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            items={getByCategory(cat)}
            onDelete={deleteRecommendation}
          />
        ))}

        {recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-light flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="font-serif text-2xl text-ink mb-3">Votre espace est prêt</p>
            <p className="text-muted text-sm max-w-xs leading-relaxed mb-8">
              Partagez votre premier film, livre, musique ou podcast avec le bouton ci-dessous.
            </p>
            <button
              onClick={openModal}
              className="bg-ink text-surface px-8 py-3 rounded-full text-sm tracking-wide hover:bg-ink-soft transition-colors">
              Ajouter ma première recommandation
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
