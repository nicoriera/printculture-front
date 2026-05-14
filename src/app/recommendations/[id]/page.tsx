"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IRecommendation } from "@/types/recommendation";
import { getCategoryColor } from "@/lib/categories";

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(
    null
  );
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
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching recommendation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchRecommendation();
    }
  }, [params.id]);

  const goBack = () => {
    router.push("/recommendations");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              {error || "Recommandation non trouvée"}
            </p>
            <button
              onClick={goBack}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={goBack}
          className="mb-4 text-blue-500 hover:text-blue-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour à la liste
        </button>

        <div
          className={`${getCategoryColor(recommendation.category)} rounded-xl p-6 shadow-md`}>
          <h1 className="text-2xl font-bold mb-4">{recommendation.title}</h1>

          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 font-semibold">
              {recommendation.category}
            </p>
            {recommendation.tag && (
              <p className="text-gray-500 text-sm border rounded-lg p-1 bg-white">
                {recommendation.tag}
              </p>
            )}
          </div>

          {recommendation.description && (
            <p className="mb-4 text-gray-700">{recommendation.description}</p>
          )}

          {recommendation.link && (
            <a
              href={recommendation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline mb-4 block">
              Voir le lien
            </a>
          )}

          {recommendation.fileUrl && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Fichier joint :</p>
              <a
                href={recommendation.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-700 underline flex items-center">
                📎 {recommendation.fileName || "Fichier"}
              </a>
            </div>
          )}

          {recommendation.videoLink && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Vidéo</p>
              <iframe
                width="560"
                height="315"
                src={recommendation.videoLink}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-64 md:h-96 rounded-lg"
              />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-500">
              Créé le{" "}
              {recommendation.createdAt &&
                new Date(recommendation.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
