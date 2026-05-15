"use client";

import { useState, useRef } from "react";
import { CreateRecommendationData, RecommendationCategory } from "@/types/recommendation";
import { RECOMMENDATION_CATEGORIES } from "@/lib/schemas";
import { CATEGORY_LABELS } from "@/lib/categories";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecommendationData) => Promise<void>;
  isMobile: boolean;
}

/** Converts a YouTube watch/short URL to its embed equivalent. Passthrough for other URLs. */
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {
    // not a valid URL yet — return as-is
  }
  return url;
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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        videoLink: formData.videoLink ? toEmbedUrl(formData.videoLink) : "",
      });
      setFormData(emptyForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
      } else {
        setError(data.error ?? "Erreur lors de l'upload.");
      }
    } catch {
      setError("Erreur lors de l'upload.");
    } finally {
      setIsUploading(false);
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
              aria-label="Fermer"
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
              <option value="">Sélectionner une catégorie</option>
              {RECOMMENDATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
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
              placeholder="Ex : Parasite, 1984, Kind of Blue…"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Pourquoi cette recommandation vous a marqué ?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Tag</label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
              placeholder="Ex : thriller, jazz, classique…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lien</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              placeholder="https://…"
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
              placeholder="https://www.youtube.com/watch?v=…"
            />
            <p className="text-xs text-subtle mt-1">Lien YouTube standard — converti automatiquement</p>
          </div>

          <div>
            <label className={labelClass}>Fichier</label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className={inputClass}
                accept="image/*,application/pdf,.doc,.docx,.txt"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <svg className="animate-spin w-4 h-4 text-ink" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="ml-2 text-xs text-ink">Upload en cours…</span>
                </div>
              )}
            </div>
            {formData.fileName && !isUploading && (
              <p className="text-xs text-muted mt-1">✓ {formData.fileName}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-ink text-surface rounded-full py-3 text-sm tracking-wide hover:bg-ink-soft transition-colors disabled:opacity-50 mt-1 flex items-center justify-center gap-2">
            {isLoading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {isLoading ? "Ajout en cours…" : "Ajouter la recommandation"}
          </button>
        </form>
      </div>
    </div>
  );
}
