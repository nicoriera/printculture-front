"use client";

import { useState, useRef } from "react";
import { CreateRecommendationData, RecommendationCategory } from "@/types/recommendation";
import { RECOMMENDATION_CATEGORIES } from "@/lib/schemas";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecommendationData) => Promise<void>;
  isMobile: boolean;
}

export default function RecommendationModal({
  isOpen,
  onClose,
  onSubmit,
  isMobile,
}: RecommendationModalProps) {
  const emptyForm: CreateRecommendationData = {
    title: "",
    description: "",
    category: undefined,
    link: "",
    tag: "",
    videoLink: "",
    fileName: "",
    fileUrl: "",
  };
  const [formData, setFormData] = useState<CreateRecommendationData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      setFormData(emptyForm);
      onClose();
    } catch (error) {
      console.error("Error creating recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          fileName: data.data.fileName,
          fileUrl: data.data.fileUrl,
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-x-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isMobile
          ? "bottom-0 h-2/3 rounded-t-3xl"
          : "inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      }`}>
      <div
        className={`${
          isMobile
            ? "h-full overflow-y-auto p-6"
            : "bg-white rounded-2xl p-6 w-full max-w-md border border-neutral-200/30"
        }`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-700">
              Ajouter une recommandation
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="font-medium text-neutral-700">
              Catégorie
            </label>
            <select
              value={formData.category ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: (e.target.value as RecommendationCategory) || undefined,
                }))
              }
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              required>
              <option value="">Sélectionner une catégorie</option>
              {RECOMMENDATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-medium text-neutral-700">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="font-medium text-neutral-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tag" className="font-medium text-neutral-700">
              Tag
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tag: e.target.value }))
              }
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="link" className="font-medium text-neutral-700">
              Lien
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="videoLink" className="font-medium text-neutral-700">
              Lien vidéo
            </label>
            <input
              type="url"
              value={formData.videoLink}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, videoLink: e.target.value }))
              }
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="https://www.youtube.com/embed/your-video-id"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="file" className="font-medium text-neutral-700">
              Fichier
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
            {formData.fileName && (
              <p className="text-sm text-green-600">✓ {formData.fileName}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-white rounded-lg py-3 px-4 hover:bg-orange-600 transition duration-300 mt-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-50">
            {isLoading ? "Ajout en cours..." : "Ajouter la recommandation"}
          </button>
        </form>
      </div>
    </div>
  );
}
