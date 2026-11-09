// Utilidades geo MVP (Haversine + ofuscación). Sin mezclar con EnRuta.

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Aproxima bbox para prefiltrar (1° lat ~ 111km)
export function bbox(lat: number, lng: number, radiusKm: number) {
  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 1);
  return { minLat: lat - dLat, maxLat: lat + dLat, minLng: lng - dLng, maxLng: lng + dLng };
}

// Ofuscación configurable (privacidad D8): reduce precisión. decimals=2 ~1.1km, 3 ~110m.
export function obfuscateCoord(value: number, decimals = Number(process.env.COORD_OBFUSCATE_DECIMALS ?? 3)): number {
  const d = Math.max(0, Math.min(6, Math.floor(decimals)));
  const f = 10 ** d;
  return Math.round(value * f) / f;
}

export function obfuscateLatLng(lat: number, lng: number, decimals?: number) {
  return { lat: obfuscateCoord(lat, decimals), lng: obfuscateCoord(lng, decimals) };
}
