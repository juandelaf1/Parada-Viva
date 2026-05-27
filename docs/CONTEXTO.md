# Contexto del proyecto

## Problema

Los pueblos de interior en España pierden población y clientes. Sus bares y tiendas
necesitan tráfico para sobrevivir. Al mismo tiempo, cada vez más personas viajan
en caravana por España y necesitan servicios básicos (baño, agua potable, recarga
eléctrica) sin tener que desviarse a un camping de pago ni arriesgar una multa
por pernoctar en vía pública.

Las soluciones existentes (Park4Night, CampCircle, etc.) se centran en:
- Dónde dormir (mapas colaborativos de pernocta)
- Redes sociales para viajeros

Ninguna conecta directamente con el tejido comercial local para intercambiar
servicios básicos por consumo en el negocio.

## Decisión de producto

No construimos una app para trabajadores temporales forzados por la crisis de
vivienda. Ese es un problema social que requiere políticas públicas. Construimos
una red para **caravanistas concienciados**: personas que eligen este estilo de
vida, respetan el entorno, y quieren apoyar la economía local consumiendo en
bares y tiendas de pueblo.

Este perfil:
- Opera dentro del marco legal (pernoctar con consumo en comercio es legal)
- Genera ingresos reales para los comercios (no solo un café de mínimos)
- Tiene alta fidelidad (vuelve cada año, recomienda)
- El mercado crece año tras año

## Primer mercado: Asturias interior

Asturias tiene:
- Leyes tolerantes con el caravaning (Áreas AC municipales, poca conflictividad)
- Pueblos de interior con bares que necesitan clientes (Somiedo, Cangas del Narcea)
- Perfil de viajero concienciado (naturaleza, senderismo, gastronomía)
- Clima que filtra naturalmente al turismo de botellón

## Segundo mercado: Mallorca interior

Mallorca tiene:
- Alta densidad de caravanistas (estudio UIB: 150+ caravanas en Palma)
- Presión de alquiler muy alta (1200-1600€/mes)
- Comercios de interior necesitados
- Pero: leyes más restrictivas y conflicto vecinal creciente

Se abordará solo tras validar el modelo en Asturias.

## Modelo de negocio

- **Núcleo gratuito**: mapa de comercios + check-in QR + valoraciones
- **Ingresos**: donaciones voluntarias + publicidad local opcional
- **Futuro**: suscripción premium (5€/mes: mapas offline, alertas, historial)

Los comercios nunca pagan. El trato es: "recibes clientes que consumen a cambio
de dejarles usar tu baño y llenar su agua".

## Stack técnico

Ver README.md. Decisión intencional: sin IA, sin microservicios, sin
complejidad innecesaria. El problema no es técnico, es de adopción y acuerdos
comerciales.

## Cómo contribuir

Ver CONTRIBUTING.md.
