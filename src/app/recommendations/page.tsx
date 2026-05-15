"use client";

import { useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import CategorySection from "@/components/CategorySection";
import { RECOMMENDATION_CATEGORIES, RecommendationCategory } from "@/lib/schemas";
import { useModal } from "@/contexts/ModalContext";

export default function RecommendationsPage() {
  const { recommendations, isLoading, fetchRecommendations, deleteRecommendation } =
    useRecommendations();
  const { lastCreated } = useModal();

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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-serif text-2xl text-ink mb-2">Rien encore</p>
            <p className="text-muted text-sm">
              Ajoutez votre première recommandation avec le bouton +
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
