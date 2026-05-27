# ADR-001: Caravanista concienciado como perfil de usuario objetivo

**Estado:** Aceptado  
**Fecha:** 2026-05-27  
**Autores:** [equipo fundador]

## Contexto

Durante la fase de descubrimiento exploramos dos perfiles de usuario:
- Trabajador temporal (hostelería, agricultura) forzado a vivir en caravana por
  la crisis de vivienda
- Caravanista concienciado que elige este estilo de vida

Ambos necesitan servicios básicos (baño, agua, recarga), pero el perfil, los
riesgos legales, la disposición a pagar y el valor para el comercio son
diferentes.

## Decisión

Construimos para el **caravanista concienciado** como perfil primario.

## Argumentos a favor

- **Marco legal favorable**: el caravanista concienciado pernocta con consumo en
  comercio, actividad legal en toda España
- **Valor para el comercio**: consume más que el mínimo forzado (come, cena,
  compra producto local)
- **Fidelidad**: vuelve cada temporada, recomienda la red a otros viajeros
- **Crecimiento del mercado**: el caravaning no para de crecer
- **Bajo conflicto vecinal**: viajeros que quieren ser bienvenidos, no
  "ocupar" espacio público

## Argumentos en contra (desestimados)

- **El trabajador temporal tiene más urgencia**: sí, pero el proyecto no puede
  resolver un problema de vivienda sin políticas públicas. Empezar por ahí es
  insostenible para un MVP.
- **El caravanista concienciado paga menos**: compensa con fidelidad y mayor
  valor por transacción para el comercio.

## Consecuencias

- No desarrollaremos funcionalidades específicas para residencia permanente
  (ej.: sistema de turnos para zonas de estacionamiento fijo)
- El sistema de reputación será clave para mantener el perfil concienciado
- Asturias como primer mercado (no Baleares, donde el conflicto legal es alto)

## Alternativas consideradas

- **Trabajador temporal como perfil primario**: descartado por riesgo legal y
  necesidad de políticas públicas
- **Ambos perfiles simultáneamente**: descartado por diluir el enfoque del MVP
