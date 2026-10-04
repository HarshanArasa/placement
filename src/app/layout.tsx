import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OpportunityHub — Internship & Placement Intelligence Platform",
    template: "%s | OpportunityHub",
  },
  description:
    "Discover internships and placement opportunities from verified sources. Search, filter, save, and get notified.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .md\\:hidden { display: flex !important; }
            .hidden.md\\:block { display: none !important; }
            .main-content { padding-top: 5rem !important; margin-left: 0 !important; }
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
