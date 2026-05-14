"use client";

import { useState, useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import CategorySection from "@/components/CategorySection";
import RecommendationModal from "@/components/RecommendationModal";
import { RECOMMENDATION_CATEGORIES, RecommendationCategory } from "@/lib/schemas";

export default function RecommendationsPage() {
  const { recommendations, isLoading, createRecommendation, deleteRecommendation } =
    useRecommendations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const getByCategory = (category: RecommendationCategory) =>
    recommendations.filter((rec) => rec.category === category);

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="w-full pt-14 flex items-center justify-center min-h-screen">
        <p className="text-neutral-500">Chargement des recommandations...</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-14" style={{ overflow: isModalOpen ? "hidden" : "auto" }}>
      <section className="flex flex-col gap-4 p-4 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-700">Mes Recommandations</h1>
          {isMobile && !isModalOpen && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 h-12 w-12 text-white rounded-xl hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 flex items-center justify-center">
              <PlusIcon />
            </button>
          )}
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
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-neutral-500 text-lg mb-4">
              Aucune recommandation pour le moment
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300">
              Ajouter votre première recommandation
            </button>
          </div>
        )}

        <RecommendationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createRecommendation}
          isMobile={isMobile}
        />

        {!isMobile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-4 right-4 z-40 bg-orange-500 text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">
            <PlusIcon className="w-8 h-8" />
          </button>
        )}
      </section>
    </div>
  );
}

function PlusIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );
}
