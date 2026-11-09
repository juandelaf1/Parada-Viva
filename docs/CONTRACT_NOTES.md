# Notas de contrato y procedencia (borrador, Parada Viva)

> Alineado con P1/P8 y `docs/PROVENANCE_CONVENTION.md` (raíz workspace). Producto autónomo vendible (paradas/servicios vanlife, check-in/reputación) y acoplable a Poolar como capacidad `places/check-ins` — sin duplicar EnRuta (logística) ni Poolar (orquestación).

## Estado actual
- API Express (`/api/*`): health, auth, establecimientos, check-ins, valoraciones. Sin OpenAPI formal aún. Prisma/SQLite en dev.
- Contrato mínimo expuesto: `GET /api/health` → `contract_version="parada-viva-api/0.1"` + `capabilities`.

## Objetivo
- Formalizar OpenAPI/JSON Schema versionado para recursos `places`/`check-ins`/`ratings`.
- Procedencia: distinguir `observado` (check-in/report validado), `declarado` (comercio/usuario), `estimado`/`sintético` (nunca como observado). Consentimiento y minimización de ubicación/PII.
- Privacidad (alineado a “Strava útil”): privacy zones/ofuscación para ubicaciones sensibles; no exponer datos personales en respuestas públicas.
- Acoplamiento: contrato versionado consumible por Poolar/EnRuta (enriquecimiento de ruta) y opcionalmente por SANDAM en contexto costero; tolerante a fallos.

## Backlog
- [ ] OpenAPI + `contract_version` en respuestas.
- [ ] Auth/autorización consistente + auth m2m para integración (D5).
- [ ] Modelado de procedencia/consentimiento/retención.
- [ ] Tests de contrato y de no-exposición de PII.