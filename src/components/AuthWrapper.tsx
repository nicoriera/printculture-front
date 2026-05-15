"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { ModalProvider } from "@/contexts/ModalContext";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </AuthProvider>
  );
}
