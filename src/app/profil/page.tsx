"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRecommendations } from "@/hooks/useRecommendations";
import { getInitial } from "@/lib/user";

export default function ProfilPage() {
  const { user, isLoading, logout } = useAuth();
  const { recommendations } = useRecommendations();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (!user) return null;

  const initial = getInitial(user.email);
  const mine = recommendations.filter((r) => r.userId === user.id).length;
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-surface min-h-screen">
      <section className="px-6 pt-8 max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl tracking-[0.2em] text-ink mb-10">PROFIL</h1>

        {/* Identity */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-rose-light flex items-center justify-center text-ink font-serif text-3xl mb-4">
            {initial}
          </div>
          <p className="text-ink text-lg">{user.email}</p>
          <p className="text-muted text-xs uppercase tracking-widest mt-1">Membre depuis {memberSince}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="bg-white/70 border border-ink/5 rounded-2xl px-5 py-5 text-center">
            <p className="font-serif text-3xl text-ink">{mine}</p>
            <p className="text-xs uppercase tracking-widest text-muted mt-1">Mes partages</p>
          </div>
          <div className="bg-white/70 border border-ink/5 rounded-2xl px-5 py-5 text-center">
            <p className="font-serif text-3xl text-ink">{recommendations.length}</p>
            <p className="text-xs uppercase tracking-widest text-muted mt-1">Dans la bulle</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full border border-ink/15 text-ink rounded-full py-3.5 text-sm tracking-[0.15em] uppercase hover:border-ink/40 transition-colors">
          Déconnexion
        </button>
      </section>
    </div>
  );
}
