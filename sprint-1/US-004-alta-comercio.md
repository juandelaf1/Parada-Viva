---
title: US-004 - Alta de comercio (admin)
---

## Historia

**Como** administrador de la plataforma  
**Quiero** dar de alta un comercio con sus datos y servicios  
**Para** que aparezca en el mapa y los caravanistas puedan encontrarlo

## Criterios de aceptación

- [ ] Formulario admin con campos: nombre, dirección, coordenadas, horario,
      servicios (baño ✅, agua ✅, recarga ✅), teléfono, foto (opcional)
- [ ] Al guardar, se genera un QR único para el comercio
- [ ] El QR se muestra en pantalla listo para imprimir (PDF)
- [ ] Los datos se guardan en la BD y se sirven vía GET /api/comercios
- [ ] Solo usuarios con rol admin pueden crear/editar comercios
- [ ] El comercio puede tener estado: activo / pausado

## Notas técnicas

- Tabla: establecimientos (id, nombre, direccion, lat, lng, horario,
  tiene_bano, tiene_agua, tiene_recarga, telefono, foto_url, activo, created_at)
- El QR se genera con librería qrcode (Python) o qrcode.react (frontend)
- Proteger ruta admin con middleware de autorización
