"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "register";
}

const CONFIG = {
  login: {
    title: "Bon retour",
    subtitle: "Connectez-vous pour retrouver vos découvertes",
    submitLabel: "Se connecter",
    loadingLabel: "Connexion...",
    linkText: "Pas encore de compte ?",
    linkLabel: "Rejoindre",
    linkHref: "/register",
  },
  register: {
    title: "Rejoindre",
    subtitle: "Créez votre espace de partage culturel",
    submitLabel: "Créer mon compte",
    loadingLabel: "Création...",
    linkText: "Déjà un compte ?",
    linkLabel: "Se connecter",
    linkHref: "/login",
  },
} as const;

export default function AuthForm({ mode }: AuthFormProps) {
  const cfg = CONFIG[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-surface w-dvw h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-ink mb-2">{cfg.title}</h1>
          <p className="text-muted text-sm">{cfg.subtitle}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-xs uppercase tracking-widest text-subtle">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-rose-light rounded-full px-5 py-3 text-ink text-sm focus:outline-none focus:border-rose transition-colors"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-xs uppercase tracking-widest text-subtle">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-rose-light rounded-full px-5 py-3 text-ink text-sm focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-xs uppercase tracking-widest text-subtle">
                Confirmer
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-rose-light rounded-full px-5 py-3 text-ink text-sm focus:outline-none focus:border-rose transition-colors"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-surface rounded-full py-3 text-sm tracking-wide hover:bg-ink-soft transition-colors disabled:opacity-50 mt-2">
            {isLoading ? cfg.loadingLabel : cfg.submitLabel}
          </button>

          <p className="text-center text-sm text-muted pt-2">
            {cfg.linkText}{" "}
            <Link href={cfg.linkHref} className="text-ink underline underline-offset-2 hover:text-ink-soft transition-colors">
              {cfg.linkLabel}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
