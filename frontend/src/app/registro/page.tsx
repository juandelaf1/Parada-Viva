"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const nombre = form.get("nombre") as string;

    try {
      await login(email, nombre || undefined);
      const redirect = searchParams.get("redirect") || "/mapa";
      router.push(redirect);
    } catch {
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">
        Únete a Parada Viva
      </h1>
      <p className="text-stone-500 mb-6">
        Introduce tu email para empezar. Sin contraseñas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="tu@email.com"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800"
        />
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre (opcional)"
          className="w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <a
        href="/"
        className="block text-center text-sm text-stone-400 mt-6 hover:text-stone-600"
      >
        Volver
      </a>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-stone-400">Cargando...</div>}>
        <RegistroForm />
      </Suspense>
    </main>
  );
}
