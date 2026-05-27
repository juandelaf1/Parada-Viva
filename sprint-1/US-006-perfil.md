---
title: US-006 - Perfil de usuario con historial
---

## Historia

**Como** caravanista  
**Quiero** ver mi historial de check-ins y valoraciones  
**Para** recordar los comercios que he visitado y cuánto he contribuido

## Criterios de aceptación

- [ ] Página /perfil que muestra:
      - Nombre y email
      - Número total de check-ins
      - Número de valoraciones dejadas
      - Últimos 10 check-ins (comercio, fecha, valoración si la dejó)
- [ ] Cada entrada del historial enlaza al comercio en el mapa
- [ ] El perfil es privado (solo lo ve el usuario)
- [ ] Opción de cerrar sesión

## Notas técnicas

- GET /api/perfil devuelve datos del usuario autenticado
- Incluir check-ins y valoraciones en la misma respuesta (joins)
