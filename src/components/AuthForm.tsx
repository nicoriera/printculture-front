"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "register";
}

const CONFIG = {
  login: {
    accent: "blue",
    title: "Connectez-vous à votre compte",
    submitLabel: "Se connecter",
    loadingLabel: "Connexion...",
    linkText: "Vous n'avez pas encore de compte ?",
    linkLabel: "S'inscrire",
    linkHref: "/register",
  },
  register: {
    accent: "green",
    title: "Créez votre compte",
    submitLabel: "S'inscrire",
    loadingLabel: "Création du compte...",
    linkText: "Vous avez déjà un compte ?",
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

  const a = cfg.accent;

  return (
    <section className={`bg-${a}-50 w-dvw h-dvh flex`}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className={`w-full bg-white rounded-2xl shadow-sm border border-${a}-200/30 md:mt-0 sm:max-w-md xl:p-0`}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className={`text-xl font-bold leading-tight tracking-tight text-${a}-600 md:text-2xl`}>
              {cfg.title}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-700">
                  Votre email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-${a}-500 focus:border-${a}-500 block w-full p-2.5 transition-all duration-200`}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-neutral-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-${a}-500 focus:border-${a}-500 block w-full p-2.5 transition-all duration-200`}
                  required
                />
              </div>
              {mode === "register" && (
                <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-neutral-700">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-${a}-500 focus:border-${a}-500 block w-full p-2.5 transition-all duration-200`}
                    required
                  />
                </div>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white bg-${a}-500 hover:bg-${a}-600 focus:ring-4 focus:outline-none focus:ring-${a}-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 transition-all duration-200`}>
                {isLoading ? cfg.loadingLabel : cfg.submitLabel}
              </button>
              <p className="text-sm font-light text-neutral-500">
                {cfg.linkText}{" "}
                <Link href={cfg.linkHref} className={`font-medium text-${a}-600 hover:underline transition-colors duration-200`}>
                  {cfg.linkLabel}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
