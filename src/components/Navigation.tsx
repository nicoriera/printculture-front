"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full fixed top-0 z-20">
      <nav className="bg-blue-50/80 backdrop-blur-sm w-full border-b border-blue-200/20 px-6 py-4">
        <div className="flex justify-between items-center mx-auto max-w-6xl">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-blue-500 tracking-wide">
              PRINTCULTURE
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 font-medium rounded-full text-sm px-4 py-2 transition-all duration-200">
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                className="text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 font-medium rounded-full text-sm px-4 py-2 transition-all duration-200">
                Connexion
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center p-2 text-neutral-500 rounded-full lg:hidden hover:bg-neutral-100 transition-all duration-200"
              aria-controls="mobile-menu-2"
              aria-expanded={isMobileMenuOpen}>
              <span className="sr-only">Ouvrir le menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          <div
            className={`${
              isMobileMenuOpen ? "flex" : "hidden"
            } absolute top-full left-0 right-0 bg-blue-50/95 backdrop-blur-sm border-b border-blue-200/30 lg:static lg:bg-transparent lg:border-0 lg:flex`}
            id="mobile-menu-2">
            <ul className="flex flex-col w-full px-6 py-4 font-medium lg:flex-row lg:space-x-8 lg:px-0 lg:py-0">
              <li>
                <Link
                  href="/"
                  className="block py-3 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 lg:hover:bg-transparent lg:p-0 rounded-lg transition-all duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className="block py-3 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 lg:hover:bg-transparent lg:p-0 rounded-lg transition-all duration-200">
                  Recommandations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
