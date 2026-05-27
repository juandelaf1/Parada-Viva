# Parada Viva

Red de comercios rurales para viajeros en caravana. Conectamos establecimientos locales (bares, tiendas, gasolineras) con caravanistas concienciados que buscan servicios básicos dignos (baño, agua, recarga) a cambio de consumo en el negocio.

## Filosofía

- **Dar vida a pueblos sin clientes**: los bares de interior necesitan tráfico. Los caravanistas necesitan servicios. El trueque beneficia a ambos.
- **Caravanista concienciado**: nuestro usuario elige este estilo de vida, respeta el entorno y quiere apoyar la economía local.
- **Sin IA, sin complejidad innecesaria**: el problema es de conexión humana y acuerdos comerciales simples, no de algoritmos.

## Hoja de ruta

| Fase | Qué | Dónde | Estado |
|------|-----|-------|--------|
| Sprint 1 | Red de comercios MVP (mapa + QR + valoraciones) | Asturias interior | En curso |
| Sprint 2 | Sistema de reputación + suscripción premium | Asturias interior | Pendiente |
| Sprint 3 | Expansión | Mallorca interior | Pendiente |

## Stack técnico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | Next.js + Tailwind + PWA | Un solo código, funciona en móvil como app |
| Backend | Node.js + Express + Prisma | Rápido de desarrollar, tipado seguro |
| Base de datos | PostgreSQL (Supabase) | Escalable, gratis para empezar |
| Mapas | Leaflet + OpenStreetMap | Sin costes de API, datos abiertos |
| Autenticación | Supabase Auth | Magic link (sin contraseñas) |
| Pagos | Stripe | Solo si se activa suscripción premium |
| Tests | Vitest (unit) + Playwright (e2e) | |

## Estructura del repositorio

```
parada-viva/
├── frontend/          # Next.js app
├── backend/           # Express API
├── docs/              # Decisiones, contexto, ADRs
├── .github/           # Issues templates y CI/CD
├── README.md
└── LICENSE
```

## Licencia

MIT
