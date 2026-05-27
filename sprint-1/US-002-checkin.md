---
title: US-002 - Check-in vía QR
---

## Historia

**Como** caravanista  
**Quiero** escanear un QR en el comercio para registrar mi visita  
**Para** que quede constancia de que he consumido y poder dejar valoración

## Criterios de aceptación

- [ ] Cada comercio tiene un QR único que redirige a una URL del tipo
      /check-in/:comercio-id
- [ ] Al escanear el QR, si el usuario no ha iniciado sesión, se le pide
      registro/login
- [ ] Tras login, se muestra pantalla de confirmación: "¿Estás en [nombre
      comercio]?"
- [ ] Al confirmar, se registra el check-in con: usuario, comercio, fecha,
      ubicación (opcional)
- [ ] El comercio recibe una notificación (push o email, inicialmente email)
- [ ] El usuario ve un mensaje de éxito con opción a dejar valoración

## Notas técnicas

- QR estático por comercio (no necesita rotación)
- GET /check-in/:comercio-id → renderiza página de confirmación
- POST /api/check-ins → crea el registro
- El QR se genera al dar de alta el comercio y se entrega impreso al comerciante
