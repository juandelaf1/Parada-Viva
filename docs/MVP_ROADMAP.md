# Parada Viva — Roadmap MVP robusto

> Objetivo: MVP **verificable, seguro a nivel base y honesto** (sin partners/datos reales aún), listo para escalar a producto real cuando se resuelvan D8/D9. **Sin mezclar con EnRuta.**

## Fase 0 — Base (hecha, verificada)
API revivida (Express/TS/Prisma), contratos mínimos, hardening (correlation-id, ready, errores, async), CORS/headers, docs honestas. Evidencia en `BACKLOG.md`/commits.

## Fase 1 — MVP técnico robusto (en progreso, sin datos reales)
**Meta:** backend confiable para mapa + check-in QR + valoraciones, con gobernanza.
- Contrato y calidad: validación Zod, rate limit, `contract_version`/procedencia, 400/404/429 consistentes.
- Geo MVP: **nearby** (Haversine+bbox), filtros servicios; ofuscación de precisión configurable.
- Check-in: QR generado + **QR firmado/expirable** (verificación), sin PII innecesaria.
- Privacidad base: scoping por usuario, minimización en selects, sin exponer ubicaciones precisas de usuarios.
- Calidad: tests API (supertest/vitest), OpenAPI stub alineado, seed `sintético/demo`.
- Ops: logs estructurados (correlation id, sin PII), `.env.example` completo.

**Gate de salida Fase 1:** CI verde, endpoints core probados, README/contratos/OpenAPI honestos, datos demo etiquetados.

## Fase 2 — MVP producto (bloqueado por D8/D9; decisiones+partners)
**Meta:** utilizable con usuarios/comercios reales en alcance limitado (Asturias interior).
- Auth real + identidad; retiro de auth stub/fallbacks inseguros.
- PII/privacidad completa: privacy zones, consentimiento, retención/borrado, auditoría accesos.
- QR verificado en producción (anti-replay, rotación secretos, onboarding comercio).
- Partners y **datos reales** con ficha de ingesta (permisos/licencia/calidad/PII).
- Frontend PWA/mapa integrado (Leaflet/MapLibre) consumiendo contratos.

**Gate de salida Fase 2:** datos reales gobernados, controles D8 activos, flujo QR/check-in verificado end-to-end, sin claims no verificables.

## Fase 3 — Escala
Postgres+PostGIS, rate limit distribuido (Redis), observabilidad/alertas, despliegue TLS/secret manager, agregados anonimizados. Integraciones externas solo por **contratos** (nunca mezcla con EnRuta).

## Dependencias / riesgos
- **D8 (seguridad/PII/privacy)** y **D9 (partners/datos reales)** son críticos.
- Ubicación = dato sensible: aplicar minimización/ofuscación desde ya.
- No afirmar cobertura/partners/tiempo real sin evidencia (P1).
