<p align="center">
  <img src="docs/Parada_viva_banner.png" alt="Parada Viva Banner" width="800">
</p>

# Parada Viva

Concepto de red colaborativa para conectar comercios/servicios rurales con viajeros (autocaravana/vanlife) mediante intercambio simple y acuerdos comerciales claros.

> **Estado actual (verificado, honesto):** base técnica **revivida** (no MVP operativo con partners/datos reales). El repositorio contiene estructura backend (Node.js + Express + TypeScript + Prisma) y utilidades de arranque; se añadieron contratos/ops mínimos (`/api/health`, `/api/ready`, `contract_version`, CORS configurable, headers de seguridad/HSTS opcional) y documentación de contrato/OpenAPI stub. **No afirmar** despliegue, partners, cobertura geográfica operativa ni datos reales sin evidencia.

## Visión (backlog, no implementado por completo)

- Descubrimiento en mapa + check-in (p. ej. QR) + valoraciones, con foco en simplicidad (sin complejidad innecesaria).
- Fases propuestas (Asturias interior → reputación/suscripción → expansión): **pendientes**; requieren partners, datos reales, auth/PII, privacidad (zonas/ofuscación) y pruebas de producto.

## Stack (actual en repo / objetivo)

| Capa | Estado |
|---|---|
| Backend API | Node.js + Express + TypeScript + Prisma (presente en `backend/`) |
| Base de datos | Prisma/SQLite en desarrollo local (según config); PostgreSQL/Supabase como objetivo — verificar antes de afirmar operativo |
| Frontend / PWA / mapas / auth / pagos | **objetivo/planeado** en partes; no asumir implementado sin verificación |

## Uso rápido (backend, local)

```bash
cd backend
npm install
cp .env.example .env   # ajustar DATABASE_URL/CORS_ORIGINS/HSTS
npm run dev            # o scripts definidos en package.json
# Health: GET /api/health  Ready: GET /api/ready
```

Contratos/notas: `docs/CONTRACT_NOTES.md`, `docs/openapi-stub.yaml`.

## Limitaciones

- Sin partners/datos reales ni cobertura operativa verificada.
- Requiere decisiones de producto (D8): auth/PII, privacidad/ofuscación, modelo de datos real, pruebas y despliegue.
- Seguridad endurecida a nivel básico de headers/probes; no sustituye gestión de secretos, TLS, auditoría central ni controles completos de producción.

## Autoría

**Juan de la Fuente** — [@juandelaf1](https://github.com/juandelaf1)

Licencia: MIT (ver `LICENSE` si aplica).
