---
title: US-005 - Registro con magic link
---

## Historia

**Como** caravanista  
**Quiero** registrarme con solo mi email (sin contraseña)  
**Para** no tener que recordar otra contraseña más

## Criterios de aceptación

- [ ] Formulario de registro: solo email
- [ ] Al enviar, llega un email con un enlace mágico
- [ ] Al hacer clic, el usuario queda autenticado
- [ ] Si el email ya existe, se envía login (no error)
- [ ] El enlace expira en 15 minutos
- [ ] Funciona con Supabase Auth (magic link)

## Notas técnicas

- Supabase Auth soporta magic link nativamente
- Configurar plantilla de email personalizada con marca Parada Viva
- Al primer registro, crear perfil en tabla usuarios (id, email, nombre opcional,
  fecha_registro)
