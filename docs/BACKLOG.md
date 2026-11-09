# Parada Viva — Backlog (MVP robusto)

> Priorizado. Marcar `[x]` solo con evidencia (commit/test). Etiquetar procedencia de datos demo como `sintético/demo`.

## Hecho (evidencia)
- [x] Base revivida + contratos mínimos (`/api/health`,`/api/ready`,`contract_version`) — `342330c,7e273a1,e7cb4aa`
- [x] CORS configurable, headers seguridad/HSTS env, backend `.env.example` — `4b30a29,c883d51`
- [x] Correlation-id, ready probe BD, 404 JSON, error handler, `asyncHandler` — `f98991e,d80df88`
- [x] Zod + rate limit (auth/check-ins/valoraciones), privacidad `mis-checkins` (fallback legacy) — `a9cf509`
- [x] QR check-in MVP (generación + procedencia; sin firma) — `6b633c9`
- [x] README honesto (estado real) — `d7a4c4e`
- [x] Documentación: decisiones/backlog/roadmap/agentes — (este lote)

## En curso / siguiente (incremental, seguro)
- [ ] **Nearby**: `GET /api/establecimientos/nearby?lat=&lng=&radiusKm=&limit=` (Haversine+bbox), `contract_version`/procedencia.
- [ ] **Ofuscación de coordenadas** (helper configurable) + política de precisión en respuestas sensibles.
- [ ] **QR firmado** HMAC+`exp` (env secret) + verificación en check-in; compat con QR actual.
- [ ] Zod/validación consistente en rutas restantes; límites/paginación.
- [ ] Contrato/procedencia aditivo en respuestas de dominio; OpenAPI stub actualizado.
- [ ] Tests API (supertest/vitest): health/ready, validación 400, 429, QR, nearby, privacidad.
- [ ] Seed/fixtures etiquetados `sintético/demo` (separados de reales).

## MVP producto (requiere D8/D9/decisiones)
- [ ] Auth real (magic link/OIDC), eliminar `x-user-email` spoofable y fallback `usuarioId`.
- [ ] Privacy zones/ofuscación ubicación usuario/comercio, consentimiento, retención/borrado, auditoría accesos PII.
- [ ] Flujo QR verificado (comercio/onboarding, anti-replay, rotación secretos).
- [ ] Filtros mapa/servicios (`agua,baño,electricidad`), búsqueda por zona, UX móvil/PWA (frontend).
- [ ] Partners + datos reales (Asturias), geocodificación verificada, moderación; ingesta con ficha `INGESTION_SOURCE_TEMPLATE`.
- [ ] Observabilidad prod (logs estructurados, métricas, alertas), rate limit distribuido si multi-instancia.

## Escalado (post-MVP, cuando haya tracción)
- [ ] Postgres gestionada + migraciones; PostGIS (`ST_DWithin`/geography), índices geo.
- [ ] Heatmaps/agregados **anonimizados** (nunca tracking individual expuesto), si aplica.
- [ ] Despliegue TLS/secret manager, CI/CD, backups/restore.
- [ ] Integración por contratos (si aplica) — **nunca mezclar con EnRuta**.
