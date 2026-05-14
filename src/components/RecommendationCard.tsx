"use client";

import Link from "next/link";
import { IRecommendation } from "@/types/recommendation";
import { getCategoryColor } from "@/lib/categories";

interface RecommendationCardProps {
  recommendation: IRecommendation;
  onDelete: (id: number) => void;
}

export default function RecommendationCard({
  recommendation,
  onDelete,
}: RecommendationCardProps) {
  return (
    <div
      className={`${getCategoryColor(recommendation.category)} rounded-2xl p-6 shadow-sm border border-neutral-200/20 hover:shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-neutral-600 font-medium text-sm bg-neutral-100/50 px-3 py-1 rounded-full">
          {recommendation.category}
        </span>
        <span className="text-neutral-500 text-xs bg-neutral-50 px-2 py-1 rounded-lg">
          {recommendation.tag}
        </span>
      </div>

      <h3 className="font-medium text-lg mb-3 text-neutral-800">
        {recommendation.title}
      </h3>

      <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
        {recommendation.description}
      </p>

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
          className="text-blue-600 hover:text-blue-800 block mb-3 underline decoration-blue-300 hover:decoration-blue-500 transition-all duration-200">
          Voir le lien
        </a>
      )}

      {recommendation.fileUrl && (
        <a
          href={recommendation.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 block mb-3 underline decoration-green-300 hover:decoration-green-500 transition-all duration-200">
          📎 {recommendation.fileName}
        </a>
      )}

      <div className="flex justify-between items-center pt-2">
        <Link
          href={`/recommendations/${recommendation.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
          Détails
        </Link>
        <button
          onClick={() => recommendation.id && onDelete(recommendation.id)}
          className="text-red-500 hover:text-red-700 text-sm transition-colors duration-200">
          Supprimer
        </button>
      </div>
    </div>
  );
}
