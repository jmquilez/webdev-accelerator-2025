# Capítulo 2 · Configuración de Astro y variables

Fichero completo `astro.config.mjs` (del repositorio):

```js
// filepath: astro.config.mjs
// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  env: {
    schema: {
      N2YO_API_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "DEMO_KEY"
      })
    }
  }
});
```

## Explicación de claves
- `output: 'server'`: Permite endpoints dinámicos (como `/api/satellites`)
> Por ejemplo, con `output: 'static'` el mapa no mostraría los satélites (podéis hacer la prueba si queréis)
- `env.example`: Declara variable `N2YO_API_KEY` accesible en cliente (cuidado con exponer claves sensibles)

## Sobre variables públicas y privadas
Si quieres evitar exponer la clave directamente:
- Cambia `context: "client"` a `context: "server"`
- Pasa la info al cliente solo si es imprescindible (en este caso la clave se usa solo en backend: mejor mantenerla privada)

## Recomendación alternativa (más segura)
```js
// Reemplazo sugerido
env: {
  schema: {
    N2YO_API_KEY: envField.string({
      context: "server",
      optional: false
    })
  }
}
```

## Archivos de entorno
`.env.example`:
```env
# Copia este archivo a .env y rellena tu clave real (puedes ponerla entre comillas o sin ellas, como no tiene espacios da igual, como una variable de entorno de bash)
N2YO_API_KEY=TU_CLAVE_AQUI
```

> Para obtener claves para la API de N2YO: https://www.n2yo.com/login/register/, con username y password vale. Si te quedas si requests genera otra clave.

> ❗ Nunca subas `.env` al repo público. Para eso tenemos el .gitignore.