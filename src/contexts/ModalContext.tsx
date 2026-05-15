"use client";

import { createContext, useContext, useState, useEffect } from "react";
import RecommendationModal from "@/components/RecommendationModal";
import { CreateRecommendationData } from "@/types/recommendation";

interface ModalContextValue {
  open: () => void;
  close: () => void;
  lastCreated: number;
}

const ModalContext = createContext<ModalContextValue>({
  open: () => {},
  close: () => {},
  lastCreated: 0,
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastCreated, setLastCreated] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (data: CreateRecommendationData) => {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setLastCreated(Date.now());
      setIsOpen(false);
    }
  };

  return (
    <ModalContext.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false), lastCreated }}>
      {children}
      <RecommendationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        isMobile={isMobile}
      />
    </ModalContext.Provider>
  );
}
