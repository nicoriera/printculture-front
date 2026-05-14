"use client";

import { useState, useEffect } from "react";
import {
  IRecommendation,
  CreateRecommendationData,
  UpdateRecommendationData,
  RecommendationCategory,
} from "@/types/recommendation";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recommendations");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommendations");
      }

      setRecommendations(data.data.recommendations);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecommendation = async (
    recommendationData: CreateRecommendationData
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recommendationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create recommendation");
      }

      // Add the new recommendation to the list
      setRecommendations((prev) => [data.data.recommendation, ...prev]);
      return data.data.recommendation;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error creating recommendation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecommendation = async (
    id: number,
    recommendationData: Partial<UpdateRecommendationData>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recommendationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update recommendation");
      }

      // Update the recommendation in the list
      setRecommendations((prev) =>
        prev.map((rec) => (rec.id === id ? data.data.recommendation : rec))
      );
      return data.data.recommendation;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error updating recommendation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecommendation = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete recommendation");
      }

      // Remove the recommendation from the list
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error deleting recommendation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationsByCategory = (category: RecommendationCategory) => {
    return recommendations.filter((rec) => rec.category === category);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getRecommendationsByCategory,
  };
}
