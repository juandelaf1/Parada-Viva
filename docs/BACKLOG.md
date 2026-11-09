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
- [x] **Nearby**: `GET /api/establecimientos/nearby?lat=&lng=&radiusKm=&limit=` (Haversine+bbox), `contract_version`/procedencia. — `7b0e441`
- [x] **Ofuscación de coordenadas** (helper configurable `utils/geo.ts`, `COORD_OBFUSCATE_DECIMALS`; toggle `OBFUSCATE_PUBLIC_COORDS`, **off por defecto** para no romper mapa) — `7b0e441`,(este lote) *(aplicar política D8 en ubicaciones sensibles)*
- [x] **QR firmado** HMAC+`exp`+`jti` (`utils/qrToken.ts`, `QR_SIGNING_SECRET`) + verificación+consumo (anti-replay in-memory MVP) en `POST /api/check-ins`; compat legacy. — `163b689`,(este lote) *(distribuido/nonce robusto en D8)*
- [x] Validación/paginación/filtros servicios en listados (general + nearby, compat, headers `X-Total-Count`/`X-Contract-Version`). — (este lote)
- [x] Contrato/procedencia aditivo en respuestas de dominio; OpenAPI stub alineado. — `c6e8f71`
- [x] **Volcado/informes agregados (sin PII):** `/api/reports/summary`, `/api/reports/establishments`, `/api/reports/checkins` (rango `from/to`) en JSON/CSV, protegidos por `X-Report-Key` (stopgap D8); `procedencia`/`pii:none`. — `7fceae6`,(este lote)
- [x] Tests API: health/ready, 400, 401/503 reports, 404, privacidad, **429**, + DB-backed (nearby+filtros, QR firmado/404, reports summary/CSV sin PII). — `7fceae6`,(este lote)
- [x] Seed/fixtures etiquetados `sintético/demo` (manifest + logs P1). — `c6e8f71`
- [x] OpenAPI stub alineado (nearby/ready/reports/QR/token). — `c6e8f71`

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
