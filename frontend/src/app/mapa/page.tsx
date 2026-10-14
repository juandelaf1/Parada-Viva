"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapaClient = dynamic(() => import("@/components/MapaClient"), {
  ssr: false,
});

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
  lat: number;
  lng: number;
  horario: string | null;
  servicios: Servicio[];
  valoracionMedia: number | null;
  totalVisitas: number;
};

export default function MapaPage() {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/establecimientos")
      .then((res) => res.json())
      .then((data) => {
        setEstablecimientos(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  return (
    <main className="h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg text-stone-800">Parada Viva</h1>
        <a
          href="/"
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          Inicio
        </a>
      </header>

      {cargando ? (
        <div className="flex-1 flex items-center justify-center text-stone-400">
          Cargando mapa...
        </div>
      ) : (
        <MapaClient establecimientos={establecimientos} />
      )}
    </main>
  );
}
