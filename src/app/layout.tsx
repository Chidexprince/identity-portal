/**
 * Root application layout.
 *
 * Server Component by default. Client-side providers are delegated to providers.tsx
 * so the app can use TanStack Query without turning the entire layout into a
 * Client Component.
 */

import type { Metadata } from "next";
import { QueryProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Identity Directory",
  description:
    "Enterprise identity directory dashboard with BFF cache strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
