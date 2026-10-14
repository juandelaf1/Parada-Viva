"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";

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

type Props = {
  establecimientos: Establecimiento[];
};

function iconoPrincipal(s: Servicio[]) {
  const tiene = (id: string) => s.some((x) => x.id === id && x.incluido);
  if (tiene("pernocta") && tiene("bano") && tiene("agua")) return "🏠";
  if (tiene("bano") && tiene("agua")) return "🚽💧";
  if (tiene("bano")) return "🚽";
  if (tiene("agua")) return "💧";
  return "📍";
}

export default function MapaClient({ establecimientos }: Props) {
  const centro: [number, number] = [43.12, -6.22];

  return (
    <div className="flex-1">
      <MapContainer
        center={centro}
        zoom={10}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {establecimientos.map((e) => (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={divIcon({
              className: "text-2xl",
              html: iconoPrincipal(e.servicios),
            })}
          >
            <Popup>
              <div className="text-sm space-y-2 w-56">
                <strong className="text-base">{e.nombre}</strong>
                <p className="text-stone-500">{e.direccion}</p>
                {e.horario && <p>🕐 {e.horario}</p>}
                <div className="border-t pt-1 space-y-1">
                  {e.servicios.map((s) => (
                    <p key={s.id} className="flex items-center gap-1">
                      <span>{s.icono}</span>
                      <span>{s.nombre}</span>
                      {!s.incluido && s.precio !== undefined && (
                        <span className="text-stone-400 ml-auto">{s.precio}€</span>
                      )}
                    </p>
                  ))}
                </div>
                {e.valoracionMedia && (
                  <p className="text-stone-400 text-xs">
                    ⭐ {e.valoracionMedia} · {e.totalVisitas} visitas
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
