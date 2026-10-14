"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUsuario } from "@/lib/auth";

const API = "http://localhost:3001";

type Servicio = {
  id: string;
  nombre: string;
  icono: string;
  incluido: boolean;
  precio?: number;
  descripcion: string;
};

type Establecimiento = {
  id: string;
  nombre: string;
  direccion: string;
  servicios: Servicio[];
  valoracionMedia: number | null;
};

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [establecimiento, setEstablecimiento] = useState<Establecimiento | null>(null);
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const establecimientoId = params.id as string;
  const usuario = getUsuario();

  useEffect(() => {
    if (!usuario) {
      router.push(`/registro?redirect=/check-in/${establecimientoId}`);
      return;
    }

    fetch(`${API}/api/establecimientos/${establecimientoId}`)
      .then((res) => res.json())
      .then((data) => {
        setEstablecimiento(data);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo cargar el establecimiento");
        setCargando(false);
      });
  }, [establecimientoId, router, usuario]);

  const handleCheckIn = async () => {
    if (!usuario || !establecimiento) return;

    const res = await fetch(`${API}/api/check-ins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: usuario.id,
        establecimientoId: establecimiento.id,
      }),
    });

    if (res.status === 409) {
      setError("Ya has hecho check-in aquí hoy");
      return;
    }

    if (!res.ok) {
      setError("Error al registrar check-in");
      return;
    }

    const data = await res.json();
    setCheckInId(data.id);
  };

  const handleValoracion = async (puntuacion: number) => {
    if (!checkInId || !establecimiento) return;

    await fetch(`${API}/api/valoraciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkInId,
        establecimientoId: establecimiento.id,
        puntuacion,
      }),
    });

    router.push("/mapa");
  };

  if (!usuario) return null;

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center text-stone-400">
        Cargando...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <a href="/mapa" className="text-emerald-600 underline">
            Volver al mapa
          </a>
        </div>
      </main>
    );
  }

  if (checkInId) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-emerald-700">
            Check-in completado
          </h1>
          <p className="text-stone-600">
            Como fue tu experiencia en {establecimiento?.nombre}?
          </p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleValoracion(n)}
                className="text-3xl hover:scale-125 transition"
              >
                {n <= 3 ? "\u{1F610}" : "\u{1F60A}"}
              </button>
            ))}
          </div>
          <a
            href="/mapa"
            className="block text-sm text-stone-400 hover:text-stone-600"
          >
            Saltar y volver al mapa
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-stone-800">
          {establecimiento?.nombre}
        </h1>
        <p className="text-stone-500">{establecimiento?.direccion}</p>
        <button
          onClick={handleCheckIn}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition"
        >
          Estoy aqui
        </button>
        <a
          href="/mapa"
          className="block text-sm text-stone-400 hover:text-stone-600"
        >
          Cancelar
        </a>
      </div>
    </main>
  );
}
