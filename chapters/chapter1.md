# Capítulo 1 · Inicializar el proyecto Astro

## Crear base del proyecto
```bash
npm create astro@latest my-map-app
cd my-map-app
npm install
```

Selecciona:
- Template: minimal (o vacío)
- TypeScript: sí (recomendado)

## Ajustes recomendados tras crear
- Borrar archivos de ejemplo que no uses
- Crear carpeta `src/components`, `src/layouts`, `src/pages/api`
- Añadir `.env` y `.env.example`

## Diferencias clave Astro vs frameworks SPA (Single Page Applications)
| Aspecto | Astro | React SPA |
|---------|-------|----------|
| Render | Parcial/estático/híbrido | Cliente |
| Island Architecture (las partes interactivas se renderizan independientemente) | Sí (más optimizado) | No por defecto (muy pesado) |
| Código que llega al cliente | Solo lo necesario | Casi todo el bundle |

> Nuestra web usa SSR (el servidor renderiza las páginas de forma dinámica)

## Buen hábito (muy recomendado)
Crea de inmediato un repositorio de git para tener control de versiones (si la lías en algún punto puedes volver a un estado anterior haciendo un `git checkout <COMMIT_HASH_ANTES_DE_LIARLA>` 😎):
```bash
git init
git add .
git commit -m "Init Astro + base proyecto"
```

> 🧠 Mantén commits pequeños y descriptivos. Hazlos con frecuencia, así tendrás más "snapshots" grabadas por si pasa algo.