<p align="center">
  <img src="docs/img/parada_viva_banner.png" alt="Parada Viva Banner" width="800">
</p>

# PARADA VIVA — Rural Commerce Network for Conscious Travelers

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **Connecting rural businesses with vanlifers. Consume minimum 1€, use bathroom, water, and power.**

---

## Elevator Pitch

**Problem**: Rural bars, shops, and gas stations struggle with low foot traffic. Vanlifers and caravan travelers need basic services (bathrooms, water, electricity) but often pass through without stopping. Both sides lose — businesses lack customers, travelers lack services.

**Hypothesis**: A simple PWA with map-based discovery and QR check-in can create a fair exchange: travelers find services, businesses get customers. No AI, no complexity — just human connection and simple commercial agreements.

**Solution**: Parada Viva — a collaborative network connecting rural businesses with caravan travelers. MVP covers **Asturias interior** with plans to expand to **Mallorca interior**. Built with Next.js + Tailwind + PWA for mobile-first experience.

---

## Philosophy

- **Give life to villages without customers**: rural bars need traffic, vanlifers need services. The exchange benefits both.
- **Conscious traveler**: our user chooses this lifestyle, respects the environment, and wants to support local economy.
- **No AI, no unnecessary complexity**: the problem is human connection and simple commercial agreements, not algorithms.

## Roadmap

| Phase | What | Where | Status |
|-------|------|-------|--------|
| Sprint 1 | MVP: map + QR check-in + ratings | Asturias interior | **In progress** |
| Sprint 2 | Reputation system + premium subscription | Asturias interior | Pending |
| Sprint 3 | Expansion | Mallorca interior | Pending |

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js + Tailwind + PWA | Single codebase, works as mobile app |
| Backend | Node.js + Express + Prisma | Fast development, type-safe |
| Database | PostgreSQL (Supabase) | Scalable, free to start |
| Maps | Leaflet + OpenStreetMap | No API costs, open data |
| Auth | Supabase Auth | Magic link (no passwords) |
| Payments | Stripe | Premium subscription only |
| Testing | Vitest (unit) + Playwright (e2e) | |

---

## Author

**Juan de la Fuente** — [@juandelaf1](https://github.com/juandelaf1)

juandelafuentelarrocca@gmail.com
