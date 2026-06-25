"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useModal } from "@/contexts/ModalContext";
import BrandMark from "@/components/BrandMark";
import FeedCard from "@/components/FeedCard";
import Tabs from "@/components/Tabs";
import { displayName, getInitial } from "@/lib/user";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

/* ------------------------------------------------------------------ */
/* Onboarding (logged out)                                            */
/* ------------------------------------------------------------------ */

function Onboarding() {
  return (
    <div className="bg-ink min-h-screen flex flex-col items-center justify-between px-8 py-16 text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-rose mb-10">
          <BrandMark className="w-16 h-16" />
        </span>

        <h1 className="font-serif text-[clamp(1.5rem,8vw,2.5rem)] tracking-[0.18em] text-surface mb-6 pl-[0.18em] whitespace-nowrap">
          CULTURHUB
        </h1>
        <p className="text-subtle text-xs uppercase tracking-[0.3em] leading-relaxed mb-10">
          Votre bulle culturelle
          <br />à deux
        </p>

        <span className="block w-px h-12 bg-surface/20 mb-10" />

        <p className="text-subtle text-xs uppercase tracking-[0.25em] leading-loose">
          Partagez, découvrez,
          <br />inspirez-vous.
        </p>

        {/* carousel dots (statiques) */}
        <div className="flex items-center gap-2 mt-12">
          <span className="w-2 h-2 rounded-full bg-rose" />
          <span className="w-2 h-2 rounded-full bg-surface/25" />
          <span className="w-2 h-2 rounded-full bg-surface/25" />
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <Link
          href="/register"
          className="w-full bg-rose text-ink rounded-full py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-rose-light transition-colors text-center">
          Commencer
        </Link>
        <Link
          href="/login"
          className="text-subtle text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-surface transition-colors">
          J&apos;ai déjà un compte
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feed (logged in)                                                   */
/* ------------------------------------------------------------------ */

const TABS = ["Pour vous", "Pour moi"] as const;
type Tab = (typeof TABS)[number];

function Feed() {
  const { user } = useAuth();
  const { recommendations, isLoading, fetchRecommendations } = useRecommendations();
  const { open: openModal, lastCreated } = useModal();
  const [tab, setTab] = useState<Tab>("Pour vous");

  useEffect(() => {
    if (lastCreated) fetchRecommendations();
    // Refetch only when a reco is created; `fetchRecommendations` is intentionally
    // excluded (new identity each render → would loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCreated]);

  const visible = useMemo(() => {
    const sorted = [...recommendations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (tab === "Pour moi") return sorted.filter((r) => r.userId === user?.id);
    // « Pour vous » : tout ce qui ne vient pas de moi (recos du partenaire / partagées).
    return sorted.filter((r) => r.userId !== user?.id);
  }, [recommendations, tab, user?.id]);

  return (
    <div className="bg-surface min-h-screen">
      <section className="px-6 pt-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <span className="font-serif text-2xl tracking-[0.25em] text-ink">CULTURHUB</span>
          <Link
            href="/profil"
            className="w-9 h-9 rounded-full bg-rose-light flex items-center justify-center text-ink text-sm font-medium">
            {getInitial(user?.email)}
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        {/* Greeting */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ink leading-tight mb-1">
              {getGreeting()}, {user ? displayName(user.email) : ""} <span className="align-middle">👋</span>
            </h1>
            <p className="text-muted text-sm">Voici vos nouveautés culturelles</p>
          </div>
          <Link
            href="/recherche"
            aria-label="Filtrer"
            className="w-10 h-10 rounded-full bg-white/70 border border-ink/5 flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4" />
            </svg>
          </Link>
        </div>

        {/* Section label */}
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted mb-4">
          {tab === "Pour vous" ? "Aujourd'hui" : "Mes partages"}
        </p>

        {/* List */}
        {isLoading && recommendations.length === 0 && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-ink/10 rounded-2xl">
            <p className="text-muted text-sm mb-5">
              {tab === "Pour moi"
                ? "Vous n'avez encore rien partagé."
                : "Aucune nouveauté pour l'instant."}
            </p>
            <button
              onClick={openModal}
              className="bg-ink text-surface px-6 py-2.5 rounded-full text-sm tracking-wide hover:bg-ink-soft transition-colors">
              Ajouter une recommandation
            </button>
          </div>
        )}

        <div className="space-y-3 pb-4">
          {visible.map((rec) => (
            <FeedCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return user ? <Feed /> : <Onboarding />;
}
