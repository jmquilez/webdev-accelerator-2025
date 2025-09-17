# Capítulo 3 · Dependencias y estructura del proyecto

Fichero `package.json` completo:

```json
// filepath: package.json
{
  "name": "webdev-2025",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/node": "^9.4.3",
    "astro": "^5.13.7",
    "leaflet": "^1.9.4"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.20",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9"
  }
}
```

> 📝 Ya puedes ejecutar `npm install` instalar todas estas dependencias en el proyecto

## Para qué sirve cada una (resumen)
- `astro`: Framework base
- `leaflet` / `@types/leaflet`: Mapa
- `@astrojs/node`: Para el adapter (en caso de que ejecutemos la build de producción)
- `@types/leaflet, @types/...`: Definiciones de tipos para typescript. Se añaden sólo en `"devDependencies"` porque para la build de producción (`npm run build`) se traduce todo a Javascript, y ahí ya no sirven de nada los tipos

## Estructura actual del repo
```
public/              # Recursos estáticos
src/
  assets/            # Archivos varios (generalmente imágenes, svgs, etc)
  layouts/           # Layout principal
  components/        # LeafletMap + otros
  pages/
    api/             # Endpoints (satellites.ts)
    index.astro      # Página principal
.env.example
astro.config.mjs
tsconfig.json
```

> 🧩 Mantén dependencias alineadas con lo que realmente usas para reducir superficie de mantenimiento. Cuantas más dependencias, menos sabes lo que tiene tu proyecto y más probabilidades de verte afectado por vulnerabilidades (ver supply chain attacks)