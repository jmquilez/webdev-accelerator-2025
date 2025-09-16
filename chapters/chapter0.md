# Capítulo 0 · Introducción y Objetivos

Este tutorial te guía para crear una app que muestra satélites en tiempo (casi) real sobre un mapa interactivo usando:
- Astro 5 (output server -> contenido dinámico)
- Leaflet (visualización cartográfica)
- API pública de N2YO (datos de satélites)
- Un endpoint propio (nuestro backend) que filtra y limita resultados

## Qué aprenderás
- Arquitectura mínima con Astro + endpoints
- Diferencia entre código cliente y servidor
- Cómo consumir una API externa de forma segura (usando nuestro backend como proxy)
- Gestión de parámetros dinámicos en UI (categorías, límite, radio)
- Buenas prácticas básicas (limitación de resultados, limpieza de timers, mantener credenciales e información sensible fuera del ojo público)

## Requisitos previos
- Node.js LTS instalado (si no lo tienes puedes seguir las instrucciones en https://nodejs.org/en/download)
- Conocimientos básicos de JavaScript/TypeScript
- Curiosidad técnica 🙂

## Flujo general
1. El usuario abre la página → se renderiza layout + componente `LeafletMap`
2. El script del mapa hace `fetch` a `/api/satellites?latitude=...`
3. El endpoint llama a N2YO → transforma → limita → responde JSON
4. El componente pinta marcadores y popups

## Licencias y uso responsable
- Leaflet: BSD 2-Clause
- OpenStreetMap tiles: Respeta condiciones de uso (atribución obligatoria)
- API N2YO: Tiene límites (rate limit); evita refrescar excesivamente

> Nota: Este proyecto es educativo. Ni se te ocurra ponerlo en producción tal y como está.