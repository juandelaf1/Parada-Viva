---
title: US-003 - Valoración tras check-in
---

## Historia

**Como** caravanista  
**Quiero** puntuar el comercio tras usarlo  
**Para** que otros viajeros sepan si el baño está limpio, el trato es bueno,
etc.

## Criterios de aceptación

- [ ] Tras el check-in, aparece pantalla para valorar (1-5 estrellas)
- [ ] Campos: valoración global + etiquetas opcionales
      (baño limpio ✅, agua potable ✅, trato amable ✅, recarga disponible ✅)
- [ ] El usuario puede añadir comentario de texto libre (máx. 500 chars)
- [ ] La valoración se guarda asociada al check-in
- [ ] La valoración media del comercio se actualiza y se muestra en el mapa
- [ ] Un usuario no puede valorar el mismo comercio más de 1 vez al día

## Notas técnicas

- POST /api/valoraciones
- El frontend muestra la media con estrellas en el popup del mapa
- Evitar reseñas duplicadas: validar por usuario + comercio + fecha
