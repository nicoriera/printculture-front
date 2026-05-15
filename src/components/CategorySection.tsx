"use client";

import { IRecommendation, RecommendationCategory } from "@/types/recommendation";
import { CATEGORY_LABELS } from "@/lib/categories";
import RecommendationCard from "@/components/RecommendationCard";

interface CategorySectionProps {
  category: RecommendationCategory;
  items: IRecommendation[];
  onDelete: (id: number) => void;
}

export default function CategorySection({ category, items, onDelete }: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-ink">
          {CATEGORY_LABELS[category]}
        </h2>
        <div className="w-8 h-px bg-rose mt-2" />
      </div>
      <div className="inline-flex overflow-x-auto w-full gap-4 pb-4">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-72">
            <RecommendationCard recommendation={item} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}
