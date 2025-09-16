# Capítulo 6 · Endpoint /api/satellites

Fichero completo `src/pages/api/satellites.ts`:

```ts
// filepath: src/pages/api/satellites.ts
import type { APIRoute } from 'astro';
import { N2YO_API_KEY as apiKey } from 'astro:env/client';

export const GET: APIRoute = async ({ url, request }) => {
  // Try multiple ways to get the parameters
  const searchParams = url.searchParams;
  const requestUrl = new URL(request.url);
  
  // Try to get parameters from both sources
  const latitude = searchParams.get('latitude') || requestUrl.searchParams.get('latitude');
  const longitude = searchParams.get('longitude') || requestUrl.searchParams.get('longitude');
  const searchRadius = searchParams.get('searchRadius') || requestUrl.searchParams.get('searchRadius') || '90';
  const satelliteCategory = searchParams.get('satelliteCategory') || requestUrl.searchParams.get('satelliteCategory') || '0';
  const limit = parseInt(searchParams.get('limit') || requestUrl.searchParams.get('limit') || '20'); // Default limit of 20 satellites
  
  console.log('Extracted params:', { latitude, longitude, searchRadius, satelliteCategory, limit });
  
  // Get API key from environment
  //////////COMENTAR ESTA OPCION
  //const apiKey = import.meta.env.N2YO_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  if (!latitude || !longitude) {
    console.log('Missing latitude or longitude');
    return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  try {
    // Make request to N2YO API
    const n2yoUrl = `https://api.n2yo.com/rest/v1/satellite/above/${latitude}/${longitude}/0/${searchRadius}/${satelliteCategory}/&apiKey=${apiKey}`;
    
    const response = await fetch(n2yoUrl);
    
    if (!response.ok) {
      throw new Error(`N2YO API error: ${response.status}`);
    }
    
    const data = await response.json();

    console.log(`N2YO API returned ${data.info?.satcount || 0} satellites`);
    
    // Limit the number of satellites returned
    let limitedData = { ...data };
    if (data.above && data.above.length > 0) {
      // Sort satellites by altitude (lower altitude = more interesting/visible)
      const sortedSatellites = data.above.sort((a: any, b: any) => a.satalt - b.satalt);
      
      // Limit the results
      limitedData.above = sortedSatellites.slice(0, limit);
      
      // Update the count to reflect limited results
      limitedData.info = {
        ...data.info,
        satcount: limitedData.above.length,
        originalCount: data.info.satcount,
        limited: data.info.satcount > limit
      };
      
      console.log(`Limited to ${limitedData.above.length} satellites (from ${data.info.satcount})`);
    }
    
    return new Response(JSON.stringify(limitedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch satellite data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
```

## Qué hace
1. Valida parámetros obligatorios
2. Construye URL a N2YO
3. Ordena por altitud (más baja primero)
4. Limita resultados (`limit`)
5. Enriquecer `info` con: `originalCount`, `limited`

## Posibles mejoras
- Cache temporal (reduce coste de API)
- Validaciones numéricas estrictas (`Number.isFinite`)
- Control de rate limit manual (intervalos inferiores a 10s podrían penalizar, recordemos que el rate limit es de 100 requests/hora)

> 🔐 Si cambias env a contexto server, sustituye import de `astro:env/client` por `import.meta.env`.