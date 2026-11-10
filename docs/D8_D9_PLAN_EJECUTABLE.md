# Parada Viva — Plan ejecutable D8/D9 (producto real)

> **Objetivo:** pasar de MVP técnico robusto a MVP producto con datos/uso real, sin romper P1/P7/P8.  
> **Dependencias:** decisiones del owner, partners, infraestructura. **No mezclar con EnRuta.**  
> **Estado:** D8/D9 **pendientes** (backlog aprobado). Este plan es la secuencia ejecutable.

## D8 — Seguridad, identidad, PII y privacidad (bloqueante para datos reales)
| # | Tarea | Entregable verificable | Riesgo si se omite | Estado |
|---|---|---|---|---|
| D8.1 | **Auth real** (magic link/OIDC/Supabase Auth u otro decidido) y modelo de sesión/token | Login funcional, retiro de `x-user-email` spoofable y fallback `?usuarioId` en `mis-checkins`, tests | Suplantación, acceso a historiales | Pendiente (decisión proveedor) |
| D8.2 | **Autorización/roles** (viajero, comercio, admin) | Scopes/guards en endpoints sensibles (reports, gestión establecimiento) | Exposición operativa | Pendiente |
| D8.3 | **Reports con identidad fuerte** | Reemplazar `X-Report-Key` stopgap por rol/admin autenticado + auditoría de export | Fuga/agregados sin control | Pendiente |
| D8.4 | **Privacy zones / ofuscación aplicada** | No exponer ubicación precisa de usuarios; precisión configurable/ofuscada para check-ins si aplica; `OBFUSCATE_*` con política definida | PII ubicación (D8) | Pendiente (helper listo) |
| D8.5 | **Consentimiento, retención y borrado** | Política + implementación (TTL/anonimización/borrado a solicitud), minimización en respuestas/exports | Cumplimiento/PII | Pendiente |
| D8.6 | **Auditoría de accesos PII** | Log de accesos a datos sensibles (sin PII en log), revisable | Trazabilidad insuficiente | Pendiente |
| D8.7 | **QR producción** | Secreto en secret manager/rotación, anti-replay **distribuido** (Redis/BD) si multi-instancia, `valid_until`/nonce robusto, onboarding/verificación comercio | Fraude/replay | Parcial (HMAC+exp+jti in-memory MVP hecho) |
| D8.8 | **Hardening prod** | TLS, CORS explícito, rate limit distribuido, secret manager, sin stack traces, revisión dependencias | Exposición | Parcial |

**Gate D8:** auth real + controles PII/privacidad activos + auditoría + secretos gestionados antes de ingestar datos personales/reales de usuarios.

## D9 — Partners, datos reales e ingesta gobernada
| # | Tarea | Entregable verificable | Estado |
|---|---|---|---|
| D9.1 | **Definir alcance piloto** (Asturias interior, nº comercios, servicios) | Lista/criterios acordados | Pendiente |
| D9.2 | **Ficha de ingesta por fuente** (usar `../docs/INGESTION_SOURCE_TEMPLATE.md` + `../docs/DATA_GOVERNANCE.md`) | Ficha completa: procedencia `observado`, permisos/licencia, PII, frecuencia, calidad, `valid_until` | Pendiente |
| D9.3 | **Onboarding partners/comercios** | Proceso verificado (alta, validación ubicación/servicios, consentimiento) | Pendiente |
| D9.4 | **Separar demo vs real** | Seed `sintético/demo` aislado; datos reales etiquetados `observado` con procedencia en registros/respuestas; no mezclar KPIs | Parcial (seed etiquetado) |
| D9.5 | **Geocodificación/ubicación verificada** | Coords y direcciones validadas; política de precisión/ofuscación pública definida | Pendiente |
| D9.6 | **Moderación/validación valoraciones** | Reglas anti-abuso/spam, trazabilidad | Pendiente |

**Gate D9:** al menos 1 fuente real con ficha aprobada + datos cargados etiquetados `observado` + verificación muestral, sin claims de cobertura más allá de lo real.

## Secuencia recomendada (ejecutable)
1. **Decisiones (owner):** proveedor auth, BD/hosting (Postgres+TLS), alcance piloto y partners objetivo.
2. **D8.1–D8.3 + D8.7 (parcial→completo):** auth/roles, reports autenticados, QR secreto gestionado/anti-replay distribuido.
3. **D8.4–D8.6:** privacy/retención/consentimiento/auditoría (con revisión legal si aplica).
4. **D9.1–D9.2:** piloto + fichas de ingesta (aunque sea 1 comercio/fuente).
5. **D9.3–D9.6:** onboarding y carga real gobernada; activar mapa/check-in en alcance real.
6. **Hardening/escala:** Postgres+PostGIS, observabilidad, backups, CI/CD.

## Criterio de “MVP producto listo”
- Gates D8+D9 cumplidos en alcance piloto, tests/CI verdes, README/contratos honestos (cobertura real declarada), sin PII en exports públicos, rollback/retención definidos.
