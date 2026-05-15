"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/contexts/ModalContext";

export default function Navigation() {
  const { user, logout } = useAuth();
  const { open: openModal } = useModal();
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden lg:block w-full fixed top-0 z-20">
        <nav className="bg-surface/90 backdrop-blur-sm border-b border-ink/5 px-8 py-5">
          <div className="flex justify-between items-center mx-auto max-w-5xl">
            <Link href="/" className="font-serif text-2xl text-ink tracking-wide">
              Printculture
            </Link>

            <div className="flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm transition-colors ${isActive("/") ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
                Accueil
              </Link>
              <Link
                href="/recommendations"
                className={`text-sm transition-colors ${isActive("/recommendations") ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
                Recommandations
              </Link>
            </div>

            <div className="flex items-center gap-5">
              {user && (
                <button
                  onClick={openModal}
                  className="bg-ink text-surface text-sm px-5 py-2 rounded-full hover:bg-ink-soft transition-colors">
                  + Ajouter
                </button>
              )}
              {user ? (
                <button
                  onClick={logout}
                  className="text-sm text-muted hover:text-ink transition-colors">
                  Déconnexion
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-muted hover:text-ink transition-colors">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile top bar — logo + auth link only */}
      <header className="lg:hidden w-full fixed top-0 z-20">
        <div className="bg-surface/90 backdrop-blur-sm border-b border-ink/5 px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-ink">
            Printculture
          </Link>
          {!user && (
            <Link href="/login" className="text-sm text-muted hover:text-ink transition-colors">
              Connexion
            </Link>
          )}
          {user && (
            <button
              onClick={logout}
              className="text-sm text-muted hover:text-ink transition-colors">
              Déconnexion
            </button>
          )}
        </div>
      </header>

      {/* Mobile bottom nav — visible only when logged in */}
      {user && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur-sm border-t border-ink/5">
          <div className="flex items-end justify-around px-8 pt-2 pb-5">
            <Link
              href="/"
              className={`flex flex-col items-center gap-1 transition-colors ${isActive("/") ? "text-ink" : "text-subtle"}`}>
              <HomeIcon />
              <span className="text-xs">Accueil</span>
            </Link>

            <button
              onClick={openModal}
              className="flex flex-col items-center -mt-6 outline-none">
              <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center shadow-lg hover:bg-ink-soft transition-colors">
                <PlusIcon />
              </div>
              <span className="text-xs text-subtle mt-1">Ajouter</span>
            </button>

            <Link
              href="/recommendations"
              className={`flex flex-col items-center gap-1 transition-colors ${isActive("/recommendations") ? "text-ink" : "text-subtle"}`}>
              <BookmarkIcon />
              <span className="text-xs">Mes coups de cœur</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
