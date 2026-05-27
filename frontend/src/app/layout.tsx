import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Parada Viva",
  description: "Red de comercios rurales para viajeros en caravana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
