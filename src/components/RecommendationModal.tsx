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

export default function RecommendationModal({ isOpen, onClose, onSubmit, isMobile }: RecommendationModalProps) {
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

    const fd = new FormData();
    fd.append("file", file);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: fd });
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

  const inputClass = "w-full bg-white border border-ink/10 rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-rose transition-colors";
  const labelClass = "block mb-1.5 text-xs uppercase tracking-widest text-subtle";

  return (
    <div
      className={`fixed inset-x-0 z-50 transition-all duration-300 ease-in-out ${
        isMobile
          ? "bottom-0 bg-surface shadow-lg"
          : "inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center"
      }`}>
      <div
        className={`${
          isMobile
            ? "h-[75vh] rounded-t-3xl overflow-y-auto p-6 bg-surface"
            : "bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl"
        }`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-ink">Ajouter</h2>
            <button
              onClick={onClose}
              type="button"
              className="text-subtle hover:text-ink transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <label className={labelClass}>Catégorie</label>
            <select
              value={formData.category ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: (e.target.value as RecommendationCategory) || undefined,
                }))
              }
              className={inputClass}
              required>
              <option value="">Sélectionner</option>
              {RECOMMENDATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Tag</label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lien</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lien vidéo</label>
            <input
              type="url"
              value={formData.videoLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, videoLink: e.target.value }))}
              className={inputClass}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div>
            <label className={labelClass}>Fichier</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className={inputClass}
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
            {formData.fileName && (
              <p className="text-xs text-muted mt-1">✓ {formData.fileName}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-surface rounded-full py-3 text-sm tracking-wide hover:bg-ink-soft transition-colors disabled:opacity-50 mt-1">
            {isLoading ? "Ajout en cours..." : "Ajouter la recommandation"}
          </button>
        </form>
      </div>
    </div>
  );
}
