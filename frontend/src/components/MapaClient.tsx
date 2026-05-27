"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";

type Establecimiento = {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  horario: string | null;
  servicios: {
    bano: boolean;
    agua: boolean;
    recarga: boolean;
  };
  valoracionMedia: number | null;
  totalVisitas: number;
};

type Props = {
  establecimientos: Establecimiento[];
};

function iconoPorServicios(s: { bano: boolean; agua: boolean; recarga: boolean }) {
  let icon = "📍";
  if (s.bano && s.agua && s.recarga) icon = "🏪";
  else if (s.bano && s.agua) icon = "🚽💧";
  else if (s.bano) icon = "🚽";
  else if (s.agua) icon = "💧";
  return icon;
}

export default function MapaClient({ establecimientos }: Props) {
  // Centro por defecto: Asturias interior
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
              html: iconoPorServicios(e.servicios),
            })}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <strong className="text-base">{e.nombre}</strong>
                <p className="text-stone-500">{e.direccion}</p>
                {e.horario && <p>🕐 {e.horario}</p>}
                <p>
                  {e.servicios.bano && "🚽 "}
                  {e.servicios.agua && "💧 "}
                  {e.servicios.recarga && "🔌 "}
                </p>
                {e.valoracionMedia && (
                  <p>⭐ {e.valoracionMedia} · {e.totalVisitas} visitas</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
