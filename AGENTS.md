# AGENTS — Parada Viva (instrucciones para agentes)

> Alcance: **solo este repositorio** (`parada-viva`). No mezclar con EnRuta ni otros productos (P8). Mantener P1 (veracidad) y P7 (seguridad/PII).

## Qué es (y qué no es)
- Red colaborativa: comercios/servicios rurales ↔ viajeros vanlife (intercambio justo: consumo mínimo por servicios). Mapa + QR check-in + valoraciones.
- **Estado actual:** backend revivido (Express/TS/Prisma), **sin partners/datos reales**. No afirmar MVP operativo/cobertura.

## Reglas de trabajo (obligatorias)
1. **No romper lo existente.** Cambios incrementales; compatibilidad/backward-compat cuando haya duda; correr `cd backend && npx tsc --noEmit && npx vitest run` antes de commitear.
2. **P1 Veracidad:** etiqueta procedencia (`observado/estimado/sintético/demo`), `contract_version`; nada de “tiempo real/partners/cobertura” sin evidencia. Seed/fixtures = `sintético/demo`.
3. **P7 PII/privacidad:** minimización; no exponer ubicación precisa de usuarios; no secretos/PII en repo/logs/respuestas públicas. `x-user-email` es stub inseguro — no fortalecer “de mentira”; cambios reales de auth van con D8.
4. **Contratos aditivos:** preferir campos/headers opcionales y versionado; documentar breaking changes (evitarlos en MVP).
5. **Express 4:** envolver handlers async con `backend/src/utils/asyncHandler.ts` y usar el error handler centralizado.
6. **Validación/abuso:** Zod en entradas (`utils/validate`), rate limit (`utils/rateLimit`) en endpoints sensibles.

## Dónde mirar
- Decisiones/backlog/roadmap: `docs/DECISIONS.md`, `docs/BACKLOG.md`, `docs/MVP_ROADMAP.md`, `docs/CONTRACT_NOTES.md`.
- Gobernanza común (workspace): `../docs/DATA_GOVERNANCE.md`, `../docs/INGESTION_SOURCE_TEMPLATE.md`.
- API: `backend/src/index.ts`, `backend/src/routes/*`, `backend/prisma/schema.prisma`.

## Comandos verificados
```bash
cd backend
npm install
cp .env.example .env           # ajustar; sin secretos reales
npx tsc --noEmit               # tipos
npx vitest run                 # tests
npm run dev                    # http://localhost:3001 ; /api/health /api/ready
```

## “Skills”/capacidades a aplicar (patrones)
- **Geobúsqueda tipo Strava (selectiva):** nearby Haversine+bbox ahora; PostGIS al escalar. Privacy zones/ofuscación (D8).
- **QR check-in:** MVP payload + evolución a HMAC firmado/`valid_until`/anti-replay.
- **Gobernanza de ingesta:** toda fuente real requiere ficha (`INGESTION_SOURCE_TEMPLATE`) antes de activar.

## Definition of Done (cambio típico)
Implementado + `tsc`/tests verdes + sin PII/secretos + contrato/procedencia considerado + docs/backlog actualizados si cambia alcance. No “production ready” sin D8/D9/infra.