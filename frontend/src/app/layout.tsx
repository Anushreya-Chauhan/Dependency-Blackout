import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Dependency Blackout — AI-Powered Supply Chain Protection",
  description:
    "Detect compromised packages, trace their blast radius, and auto-migrate to safe alternatives before your users find out.",
  openGraph: {
    title: "Dependency Blackout",
    description: "AI-powered dependency failure protection for software teams.",
    type: "website",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-text-primary bg-surface-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
