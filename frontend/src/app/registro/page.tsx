"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegistroPage() {
  const router = useRouter();

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/mapa`,
      },
    });

    if (error) {
      alert("Error al enviar el enlace: " + error.message);
    } else {
      alert("Te hemos enviado un enlace mágico a tu email. Revisa tu bandeja de entrada.");
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-stone-800 mb-2">
          Únete a Parada Viva
        </h1>
        <p className="text-stone-500 mb-6">
          Sin contraseñas. Solo introduce tu email y te enviaremos un enlace
          mágico.
        </p>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            required
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800"
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Enviar enlace mágico
          </button>
        </form>

        <a
          href="/"
          className="block text-center text-sm text-stone-400 mt-6 hover:text-stone-600"
        >
          Volver
        </a>
      </div>
    </main>
  );
}
