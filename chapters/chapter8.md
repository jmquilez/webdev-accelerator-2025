# Capítulo 8 · Ejecución

## Desarrollo local
> Recuerda ejecutar `npm install` si no lo has hecho todavía
```bash
npm run dev
```
Abre: http://localhost:4321

## Variables de entorno
Crea `.env` (`.env.example` es únicamente una plantilla, la app sólo os va a reconocer el `.env`):
```env
N2YO_API_KEY=TU_CLAVE_REAL
```

## Comandos útiles (esto es PARA PRODUCCIÓN)
```bash
npm run build
npm run preview
```

## Rendimiento
- Evita bajar intervalo < 10s para no saturar API (especialmente para no agotar las peticiones/hora)

## Si os puede la curiosidad y lo queréis desplegar
- Vercel. O alquilad un servidor y blv (aquí son muy baratos): https://www.ovhcloud.com/es-es/