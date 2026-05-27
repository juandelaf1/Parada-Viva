# ADR-002: Stack técnico sin IA ni complejidad anticipada

**Estado:** Aceptado  
**Fecha:** 2026-05-27  

## Contexto

Durante la etapa de ideación se plantearon: LangChain, LangGraph, modelos de ML,
series temporales, redes neuronales, fine-tuning de LLMs, etc.

## Decisión

No usamos ninguna de esas tecnologías. El stack es:

- Frontend: Next.js + Tailwind + PWA
- Backend: Node.js + Express + Prisma
- BD: PostgreSQL (Supabase)
- Mapas: Leaflet + OpenStreetMap
- Auth: Supabase Auth
- Tests: Vitest + Playwright

## Argumentos

- El problema central es de conexión humana y acuerdos comerciales, no de
  algoritmos
- No tenemos datos históricos para entrenar ningún modelo
- No hay tarea de generación de texto, clasificación, ni predicción compleja
- Cada tecnología añadida es un coste de mantenimiento sin beneficio

## Cuándo reconsiderar

- Si llegamos a 10.000+ usuarios activos y queremos predecir saturación de
  comercios en temporada alta: modelo estadístico simple (regresión), no DL
- Si necesitamos moderar reseñas automáticamente: API de OpenAI, no
  fine-tuning
