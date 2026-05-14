import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Print Culture",
  description: "Partagez vos coups de cœur culturels entre amis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-background">
        <AuthWrapper>
          <Navigation />
          <main className="min-h-screen pt-20">{children}</main>
        </AuthWrapper>
      </body>
    </html>
  );
}
