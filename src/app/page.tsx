"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useModal } from "@/contexts/ModalContext";
import { RECOMMENDATION_CATEGORIES } from "@/lib/schemas";
import { CATEGORY_LABELS, getCategoryColor } from "@/lib/categories";
import { RecommendationCategory } from "@/types/recommendation";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const CATEGORY_ICONS: Record<RecommendationCategory, React.ReactNode> = {
  Movie: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
  Book: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Music: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  Podcast: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
};

function HomeConnected() {
  const { recommendations, isLoading, fetchRecommendations } = useRecommendations();
  const { open: openModal } = useModal();

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countByCategory = (cat: RecommendationCategory) =>
    recommendations.filter((r) => r.category === cat).length;

  const recent = [...recommendations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const total = recommendations.length;

  return (
    <div className="bg-surface min-h-screen">
      <section className="px-6 py-10 max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="mb-10">
          <p className="text-subtle text-xs uppercase tracking-widest mb-2">{getGreeting()}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-2">
            Votre espace culturel
          </h1>
          <p className="text-muted text-sm">
            {total === 0
              ? "Commencez par ajouter votre première recommandation."
              : `${total} recommandation${total > 1 ? "s" : ""} partagée${total > 1 ? "s" : ""} avec soin.`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {RECOMMENDATION_CATEGORIES.map((cat) => {
            const count = countByCategory(cat);
            return (
              <div
                key={cat}
                className={`${getCategoryColor(cat)} rounded-2xl px-5 py-4 border border-ink/5`}>
                <p className="text-2xl font-serif text-ink mb-1">
                  {isLoading ? "—" : count}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted">
                  {CATEGORY_LABELS[cat]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Category tiles */}
        <div className="mb-10">
          <h2 className="font-serif text-xl text-ink mb-4">Parcourir par univers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RECOMMENDATION_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href="/recommendations"
                className={`${getCategoryColor(cat)} rounded-2xl p-5 border border-ink/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3`}>
                <span className="text-muted">{CATEGORY_ICONS[cat]}</span>
                <span className="font-medium text-ink text-sm">{CATEGORY_LABELS[cat]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-serif text-xl text-ink">Récemment ajoutés</h2>
            {total > 4 && (
              <Link href="/recommendations" className="text-xs text-muted hover:text-ink transition-colors underline underline-offset-2">
                Tout voir
              </Link>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/60 rounded-2xl h-24 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && recent.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink/10 rounded-2xl">
              <p className="text-muted text-sm mb-4">Aucune recommandation pour l&apos;instant</p>
              <button
                onClick={openModal}
                className="bg-ink text-surface px-6 py-2.5 rounded-full text-sm tracking-wide hover:bg-ink-soft transition-colors">
                Ajouter la première
              </button>
            </div>
          )}

          {!isLoading && recent.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recent.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/recommendations/${rec.id}`}
                  className={`${getCategoryColor(rec.category)} rounded-2xl px-5 py-4 border border-ink/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs uppercase tracking-widest text-muted">
                      {rec.category ? CATEGORY_LABELS[rec.category] : "—"}
                    </span>
                    {rec.tag && <span className="text-xs text-subtle shrink-0">#{rec.tag}</span>}
                  </div>
                  <p className="font-serif text-ink leading-snug line-clamp-1">{rec.title}</p>
                  {rec.description && (
                    <p className="text-xs text-muted mt-1 line-clamp-1">{rec.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

function HomeLanding() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-subtle text-xs uppercase tracking-widest mb-8">
          Un espace pour deux
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-ink leading-tight mb-6 max-w-2xl">
          Vos découvertes,<br />partagées avec soin
        </h1>
        <p className="text-muted max-w-sm mx-auto leading-relaxed mb-12 text-sm">
          Films, livres, musiques, podcasts — un espace intime pour échanger ce qui compte vraiment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/register"
            className="bg-ink text-surface px-8 py-3 rounded-full text-sm tracking-wide hover:bg-ink-soft transition-colors">
            Commencer
          </Link>
          <Link
            href="/login"
            className="border border-ink/20 text-ink px-8 py-3 rounded-full text-sm tracking-wide hover:border-ink/40 transition-colors">
            Se connecter
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl text-ink text-center mb-16">
          Comment ça marche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { n: "1", title: "Partagez", desc: "Ajoutez une recommandation en quelques secondes — un film, un livre, une chanson." },
            { n: "2", title: "Explorez", desc: "Retrouvez les découvertes de vos proches, organisées par univers." },
            { n: "3", title: "Échangez", desc: "Un espace privé, sans algorithme. Juste vous et vos coups de cœur." },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-ink text-lg">{step.n}</span>
              </div>
              <h3 className="font-medium text-ink mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return user ? <HomeConnected /> : <HomeLanding />;
}
