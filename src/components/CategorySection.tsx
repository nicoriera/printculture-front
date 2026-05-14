"use client";

import { IRecommendation, RecommendationCategory } from "@/types/recommendation";
import { CATEGORY_LABELS, CATEGORY_HEADING_COLORS } from "@/lib/categories";
import RecommendationCard from "@/components/RecommendationCard";

interface CategorySectionProps {
  category: RecommendationCategory;
  items: IRecommendation[];
  onDelete: (id: number) => void;
}

export default function CategorySection({ category, items, onDelete }: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className={`text-xl font-semibold mb-4 ${CATEGORY_HEADING_COLORS[category]}`}>
        {CATEGORY_LABELS[category]}
      </h2>
      <div className="inline-flex overflow-x-auto w-full gap-4 pb-4">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-80">
            <RecommendationCard recommendation={item} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}
