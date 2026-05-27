--- 
title: US-001 - Mapa con comercios adheridos
---

## Historia

**Como** caravanista  
**Quiero** ver un mapa con los comercios adheridos cerca de mi ruta  
**Para** saber dónde puedo usar baño, llenar agua o recargar batería

## Criterios de aceptación

- [ ] El mapa se renderiza con Leaflet + OpenStreetMap
- [ ] Cada comercio aparece como un marcador con icono distinto según servicio
      (baño, agua, recarga)
- [ ] Al hacer clic en un marcador se muestra: nombre, dirección, servicios,
      horario, valoración media
- [ ] El mapa se centra en Asturias interior por defecto
- [ ] El usuario puede buscar por nombre de pueblo o comercio
- [ ] Los comercios se cargan desde la API
- [ ] Funciona en móvil (responsive)

## Notas técnicas

- Usar Leaflet con tiles gratuitas de OpenStreetMap (sin API key)
- Iconos: baño 🚽 / agua 💧 / recarga 🔌 (usar Leaflet DivIcon con emoji o SVG)
- Endpoint: GET /api/comercios
- Parámetros de búsqueda: lat, lng, radio (km)
