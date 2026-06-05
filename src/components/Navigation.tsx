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
            <Link href="/" className="font-serif text-2xl tracking-[0.25em] text-ink">
              CULTURHUB
            </Link>

            {user && (
              <div className="flex items-center gap-8">
                <NavLink href="/" active={isActive("/")} label="Accueil" />
                <NavLink href="/recherche" active={isActive("/recherche")} label="Recherche" />
                <NavLink href="/echanges" active={isActive("/echanges")} label="Échanges" />
                <NavLink href="/profil" active={isActive("/profil")} label="Profil" />
              </div>
            )}

            <div className="flex items-center gap-5">
              {user ? (
                <>
                  <button
                    onClick={openModal}
                    className="bg-ink text-surface text-sm px-5 py-2 rounded-full hover:bg-ink-soft transition-colors">
                    + Ajouter
                  </button>
                  <button
                    onClick={logout}
                    className="text-sm text-muted hover:text-ink transition-colors">
                    Déconnexion
                  </button>
                </>
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

      {/* Mobile bottom nav — visible only when logged in (5 onglets de la maquette) */}
      {user && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur-sm border-t border-ink/5">
          <div className="grid grid-cols-5 items-end px-4 pt-2 pb-5">
            <TabItem href="/" active={isActive("/")} label="Accueil" icon={<HomeIcon />} />
            <TabItem href="/recherche" active={isActive("/recherche")} label="Recherche" icon={<SearchIcon />} />

            <button
              onClick={openModal}
              className="flex flex-col items-center -mt-6 outline-none"
              aria-label="Ajouter">
              <div className="w-14 h-14 rounded-full bg-rose flex items-center justify-center shadow-lg hover:bg-rose-light transition-colors">
                <PlusIcon />
              </div>
            </button>

            <TabItem href="/echanges" active={isActive("/echanges")} label="Échanges" icon={<ChatIcon />} />
            <TabItem href="/profil" active={isActive("/profil")} label="Profil" icon={<UserIcon />} />
          </div>
        </nav>
      )}
    </>
  );
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${active ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
      {label}
    </Link>
  );
}

function TabItem({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-ink" : "text-subtle"}`}>
      {icon}
      <span className="text-[0.65rem] tracking-wide">{label}</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h8M8 8h8m-8 8h5m6-4a8 8 0 01-11.5 7.2L3 21l1.8-4.5A8 8 0 1121 12z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 0112 0v1" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
