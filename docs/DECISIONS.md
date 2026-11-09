# Parada Viva — Decisiones (vivas)

> Registrar **qué, por qué, evidencia, estado**. No borrar historial (marcar reemplazadas). Sin secretos/PII.

## Principios (heredados del ecosistema)
- **P1 Veracidad:** datos reales o claramente etiquetados (`observado/estimado/sintético`), sin claims falsos.
- **P7 Seguridad/PII:** minimización, sin secretos/PII en repo/logs; cumplimiento/privacidad por diseño.
- **P8 Sin mezclar:** Parada Viva es producto independiente. Integraciones (si las hay) solo por contratos/APIs/adapters; **no fusión con EnRuta** ni DB compartida.

## Decisiones
| ID | Fecha | Decisión | Por qué | Consecuencias | Estado |
|---|---|---|---|---|---|
| PV-D1 | 2026-11-09 | MVP robusto incremental sobre base revivida (Express/TS/Prisma), sin partners/datos reales aún | Entregar valor técnico verificable y escalable sin bloquear por externos | Mantener README/contratos honestos; etiquetar demo como sintético | Activa |
| PV-D2 | 2026-11-09 | Hardening base: correlation-id, `/health`+`/ready` (probe BD), JSON 404, error handler, `asyncHandler` en rutas | Robustez real (Express 4 async) y operabilidad | Base para escalar; `READY_CHECK_DB`/test safe | Activa |
| PV-D3 | 2026-11-09 | Validación **Zod** + **rate limit** in-memory en endpoints sensibles; `contract_version`/procedencia en respuestas clave | Calidad de entrada, abuso, consistencia de contrato | Límites ajustables; rate limit no distribuido (Redis a escalar) | Activa |
| PV-D4 | 2026-11-09 | Privacidad en `mis-checkins`: preferir `x-user-email` (alcance propio) con fallback legacy `?usuarioId` temporal | Reducir fuga PII de historiales; compatibilidad transitoria | Eliminar fallback cuando exista auth real (D8) | Activa (transitoria) |
| PV-D5 | 2026-11-09 | QR check-in MVP: payload abierto + **endpoint QR**; evolución a **token HMAC firmado+exp** (sin mezclar productos) | Alinear con visión QR; seguridad incremental | Añadir verificación firmada/anti-replay antes de prod | Activa |
| PV-D8 | pendiente | **Auth real + PII/privacidad completa** (privacy zones/ofuscación ubicación, retención/consentimiento, auditoría accesos) | D8 bloquea producto real con datos de ubicación/personas | Requerido antes de partners/datos reales | Pendiente |
| PV-D9 | pendiente | Datos/partners reales (Asturias interior), seed demo etiquetado `sintético` separado | P1 | Go/no-go operativo | Pendiente |
| PV-D10 | pendiente | BD Postgres (+ PostGIS cuando escale geo) y despliegue TLS/secret manager | Escala/producción | Plantilla cuando haya infra | Pendiente |
