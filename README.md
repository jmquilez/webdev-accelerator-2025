# 🌍 Tutorial: Integrar Astro, una API abierta y un mapa interactivo

Este proyecto es un tutorial práctico para aprender a integrar **Astro 5**, una **API abierta** y la librería de mapas **Leaflet** en una aplicación web moderna.

---

## 🚀 1. Inicializar proyecto Astro

Primero creamos un nuevo proyecto Astro:

```bash
npm create astro@latest my-map-app
cd my-map-app
npm install
```

---

## ⚙️ 2. Configuración de Astro

En el archivo `astro.config.mjs` configuramos Astro para usar TypeScript y soporte moderno:

```js
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server'
});

```

---

## 📦 3. Dependencias

En el `package.json` vemos que usamos Astro y Leaflet como librería de mapas:

```json
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
    "@astrojs/react": "^4.3.1",
    "@astrojs/tailwind": "^6.0.2",
    "@types/leaflet": "^1.9.20",
    "@types/react": "^19.1.12",
    "@types/react-dom": "^19.1.9",
    "astro": "^5.13.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.544.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.13"
  }
}

```

Instalamos las dependencias:

```bash
npm install
```

---

## 🖼️ 4. Layout principal

Creamos un layout base en `src/layouts/Layout.astro` que usaremos en todas las páginas:

```astro
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<!-- Google Fonts - Nunito -->
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
		<title>Astro Basics</title>
	</head>
	<body>
		<slot />
	</body>
</html>

<style is:global>
	/* Global font setup with Nunito */
	html,
	body {
		margin: 0;
		width: 100%;
		height: 100%;
		font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
		background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3a7bd5 100%);
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	/* Animated background stars */
	body::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: 
			radial-gradient(2px 2px at 50px 50px, white, transparent),
			radial-gradient(1px 1px at 150px 100px, white, transparent),
			radial-gradient(3px 3px at 250px 30px, white, transparent),
			radial-gradient(1px 1px at 350px 80px, white, transparent),
			radial-gradient(2px 2px at 450px 120px, white, transparent),
			radial-gradient(1px 1px at 100px 180px, white, transparent),
			radial-gradient(2px 2px at 300px 160px, white, transparent),
			radial-gradient(1px 1px at 400px 40px, white, transparent);
		background-repeat: repeat;
		background-size: 500px 200px;
		animation: driftA 18s linear infinite, twinkleA 2.3s ease-in-out infinite alternate;
		z-index: 0;
		pointer-events: none;
	}

	body::after {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: 
			radial-gradient(1px 1px at 80px 70px, white, transparent),
			radial-gradient(2px 2px at 200px 140px, white, transparent),
			radial-gradient(1px 1px at 320px 60px, white, transparent),
			radial-gradient(3px 3px at 420px 100px, white, transparent);
		background-repeat: repeat;
		background-size: 600px 180px;
		animation: driftB 22s linear infinite, twinkleB 1.7s ease-in-out infinite alternate;
		z-index: 0;
		pointer-events: none;
		opacity: 0.7;
	}

	@keyframes driftA {
		0% { transform: translateX(0) translateY(0) rotate(0deg); }
		25% { transform: translateX(-80px) translateY(-30px) rotate(90deg); }
		50% { transform: translateX(-160px) translateY(10px) rotate(180deg); }
		75% { transform: translateX(-240px) translateY(-60px) rotate(270deg); }
		100% { transform: translateX(-320px) translateY(-20px) rotate(360deg); }
	}

	@keyframes driftB {
		0% { transform: translateX(0) translateY(0) rotate(0deg); }
		33% { transform: translateX(120px) translateY(40px) rotate(-120deg); }
		66% { transform: translateX(40px) translateY(-80px) rotate(-240deg); }
		100% { transform: translateX(-200px) translateY(30px) rotate(-360deg); }
	}

	@keyframes twinkleA {
		0% { opacity: 0.2; }
		100% { opacity: 0.9; }
	}

	@keyframes twinkleB {
		0% { opacity: 0.4; }
		100% { opacity: 0.7; }
	}

	/* Font weight utilities */
	.font-light { font-weight: 300; }
	.font-normal { font-weight: 400; }
	.font-medium { font-weight: 500; }
	.font-semibold { font-weight: 600; }
	.font-bold { font-weight: 700; }
	.font-extrabold { font-weight: 800; }

	/* Ensure all common elements inherit the font */
	h1, h2, h3, h4, h5, h6,
	p, span, div, a, button,
	input, textarea, select,
	label, li, td, th {
		font-family: inherit;
	}
</style>

```

---

## 🗺️ 5. Componente del mapa

El mapa se implementa con Leaflet en `src/components/LeafletMap.astro`:

```astro
---
// LeafletMap.astro - A Leaflet map component for Astro with satellite tracking
export interface Props {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: string;
  width?: string;
  apiKey?: string;
  showSatellites?: boolean;
  satelliteCategory?: number;
  searchRadius?: number;
  updateInterval?: number;
}

const { 
  latitude = 40.7128, 
  longitude = -74.0060, 
  zoom = 3,
  height = "500px",
  width = "100%",
  apiKey = "",
  showSatellites = true,
  satelliteCategory = 2, // 2 = ISS, 52 = Starlink, 1 = Brightest
  searchRadius = 90, // 90 degrees = all satellites above horizon
  updateInterval = 30000 // 30 seconds - less frequent for fewer satellites
} = Astro.props;
---
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<!-- Font Awesome for satellite icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="" />

<div id="map" style={`height: ${height}; width: ${width};`}></div>
<div id="satellite-controls" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
  <div style="margin-bottom: 10px;">
    <label for="satellite-category" style="font-weight: bold; margin-right: 10px;">Satellite Category:</label>
    <select id="satellite-category" style="padding: 5px; border-radius: 4px; border: 1px solid #ccc;">
      <option value="2">International Space Station (ISS)</option>
      <option value="52">Starlink</option>
      <option value="1">Brightest Satellites</option>
      <option value="18">Amateur Radio</option>
      <option value="20">GPS Operational</option>
      <option value="0">All Satellites (Warning: Many!)</option>
    </select>
  </div>
  <div style="margin-bottom: 10px;">
    <label for="satellite-limit" style="font-weight: bold; margin-right: 10px;">Max Satellites:</label>
    <select id="satellite-limit" style="padding: 5px; border-radius: 4px; border: 1px solid #ccc;">
      <option value="5">5 satellites</option>
      <option value="10">10 satellites</option>
      <option value="20" selected>20 satellites</option>
      <option value="50">50 satellites</option>
      <option value="100">100 satellites</option>
    </select>
  </div>
  <button id="refresh-satellites" style="padding: 5px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
    Refresh
  </button>
</div>
<div id="satellite-info" style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px; display: none;">
  <h3>Satellite Information</h3>
  <p id="satellite-count">Loading satellites...</p>
  <div id="satellite-list"></div>
  <div style="margin-top: 10px; font-size: 12px; color: #666;">
    <strong>Legend:</strong> 
    <span style="color: #ffaa00;">●</span> ISS/Space Station
    <span style="color: #0574f2; margin-left: 10px;">●</span> Starlink
    <span style="color: #00b31b; margin-left: 10px;">●</span> Brightest
    <span style="color: #ff4444; margin-left: 10px;">●</span> Other
  </div>
</div>

<script define:vars={{ latitude, longitude, zoom, apiKey, showSatellites, satelliteCategory, searchRadius, updateInterval }}>
  let map;
  let satelliteMarkers = [];
  let updateTimer;
  
  // Create local state variables that can be modified
  let currentSatelliteCategory = satelliteCategory;
  let currentSearchRadius = searchRadius;
  let currentLimit = 20; // Default limit

  // Wait for the DOM to be ready and Leaflet to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Check if Leaflet is loaded
    if (typeof L !== 'undefined') {
      // Initialize the map
      map = L.map('map').setView([latitude, longitude], zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker at the observer location
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('Estamos aquí')
        .openPopup();

      // Start satellite tracking if enabled
      if (showSatellites) {
        // Set initial category in dropdown
        document.getElementById('satellite-category').value = currentSatelliteCategory;
        
        fetchSatellites();
        // Set up periodic updates
        updateTimer = setInterval(fetchSatellites, updateInterval);
        document.getElementById('satellite-info').style.display = 'block';
        
        // Add event listeners for controls
        document.getElementById('satellite-category').addEventListener('change', function(e) {
          currentSatelliteCategory = parseInt(e.target.value);
          console.log('Category changed to:', currentSatelliteCategory);
          fetchSatellites();
        });
        
        document.getElementById('satellite-limit').addEventListener('change', function(e) {
          currentLimit = parseInt(e.target.value);
          console.log('Limit changed to:', currentLimit);
          fetchSatellites();
        });
        
        document.getElementById('refresh-satellites').addEventListener('click', function() {
          console.log('Manual refresh triggered');
          fetchSatellites();
        });
      }
    } else {
      console.error('Leaflet library not loaded');
    }
  });

  // Custom satellite icon with Font Awesome
  function createSatelliteIcon(satelliteName, category) {
    // Different colors and icons for different satellite types
    let color = '#ff4444'; // default red
    let iconClass = 'fa-satellite'; // default satellite icon
    
    if (satelliteName.includes('STARLINK')) {
      color = '#0574f2';
      iconClass = 'fa-satellite-dish';
    } else if (satelliteName.includes('SPACE STATION') || satelliteName.includes('ISS') || category === 'ISS') {
      color = '#ffaa00';
      iconClass = 'fa-user-astronaut';
    } else if (category === 'Brightest') {
      color = '#00b31b';
      iconClass = 'fa-star';
    } else if (category.includes('GPS')) {
      color = '#4a90e2';
      iconClass = 'fa-location-crosshairs';
    }
    
    return L.divIcon({
      html: `<div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <i class="fas ${iconClass}" style="
          color: white;
          font-size: 12px;
        "></i>
      </div>`,
      className: 'satellite-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  // Fetch satellites from our API proxy
  async function fetchSatellites() {
    try {
      // Build URL with explicit parameter construction using current state
      console.log("Current parameters:", { 
        latitude, 
        longitude, 
        searchRadius: currentSearchRadius, 
        category: currentSatelliteCategory,
        limit: currentLimit
      });
      
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        searchRadius: currentSearchRadius.toString(),
        satelliteCategory: currentSatelliteCategory.toString(),
        limit: currentLimit.toString()
      });
      
      const url = `/api/satellites?${params.toString()}`;
      console.log('Fetching from URL:', url);
      
      // Update UI to show loading state
      document.getElementById('satellite-count').textContent = 'Loading satellites...';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Clear existing satellite markers
      satelliteMarkers.forEach(marker => map.removeLayer(marker));
      satelliteMarkers = [];
      
      // Update satellite count with limiting information
      let countText = `Showing ${data.info.satcount} satellites (${data.info.category})`;
      if (data.info.limited) {
        countText = `Showing ${data.info.satcount} of ${data.info.originalCount} satellites (${data.info.category}) - Limited to closest satellites`;
      }
      document.getElementById('satellite-count').textContent = countText;
      
      // Add new satellite markers
      if (data.above && data.above.length > 0) {
        data.above.forEach(satellite => {
          const marker = L.marker([satellite.satlat, satellite.satlng], {
            icon: createSatelliteIcon(satellite.satname, data.info.category)
          }).addTo(map);
          
          // Enhanced popup with satellite type
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">${satellite.satname}</h4>
              <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
                <strong>Category:</strong> ${data.info.category}
              </div>
              <p><strong>NORAD ID:</strong> ${satellite.satid}</p>
              <p><strong>Altitude:</strong> ${Math.round(satellite.satalt)} km</p>
              <p><strong>Launch Date:</strong> ${satellite.launchDate}</p>
              <p><strong>International Designator:</strong> ${satellite.intDesignator}</p>
              <p><strong>Position:</strong> ${satellite.satlat.toFixed(4)}°, ${satellite.satlng.toFixed(4)}°</p>
            </div>
          `);
          
          satelliteMarkers.push(marker);
        });
        
        // Update satellite list
        const satelliteList = document.getElementById('satellite-list');
        satelliteList.innerHTML = data.above.slice(0, 5).map(sat => 
          `<div style="margin: 5px 0; padding: 5px; background: white; border-radius: 3px; font-size: 12px;">
            <strong>${sat.satname}</strong> - ${Math.round(sat.satalt)} km
          </div>`
        ).join('');
        
        if (data.above.length > 5) {
          satelliteList.innerHTML += `<div style="font-size: 11px; color: #666;">...and ${data.above.length - 5} more satellites</div>`;
        }
      }
      
    } catch (error) {
      console.error('Error fetching satellites:', error);
      document.getElementById('satellite-count').textContent = 
        `Error loading satellites: ${error.message}`;
    }
  }

  // Clean up timer when page unloads
  window.addEventListener('beforeunload', function() {
    if (updateTimer) {
      clearInterval(updateTimer);
    }
  });
</script>

<style>
  #map {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>
```

Este componente renderiza un mapa con tiles de OpenStreetMap.

---

## 🌐 6. API abierta

Para simular datos reales, creamos un endpoint en `src/pages/api/satellites.ts` que devuelve información de satélites:

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
  // Try multiple ways to get the parameters
  const searchParams = url.searchParams;
  const requestUrl = new URL(request.url);
  
  console.log('Full URL:', url.href);
  console.log('Request URL:', request.url);
  console.log('Search params from url:', url.search);
  console.log('Search params from request:', requestUrl.search);
  console.log('SearchParams object:', Object.fromEntries(searchParams));
  console.log('RequestURL SearchParams:', Object.fromEntries(requestUrl.searchParams));
  
  // Try to get parameters from both sources
  const latitude = searchParams.get('latitude') || requestUrl.searchParams.get('latitude');
  const longitude = searchParams.get('longitude') || requestUrl.searchParams.get('longitude');
  const searchRadius = searchParams.get('searchRadius') || requestUrl.searchParams.get('searchRadius') || '90';
  const satelliteCategory = searchParams.get('satelliteCategory') || requestUrl.searchParams.get('satelliteCategory') || '0';
  const limit = parseInt(searchParams.get('limit') || requestUrl.searchParams.get('limit') || '20'); // Default limit of 20 satellites
  
  console.log('Extracted params:', { latitude, longitude, searchRadius, satelliteCategory, limit });
  
  // Get API key from environment
  const apiKey = import.meta.env.N2YO_API_KEY;
  
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

    console.log("Fetching from N2YO API:", n2yoUrl);
    
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

---

## 🏠 7. Página principal

La página principal `src/pages/index.astro` importa el layout y el mapa, y muestra los datos:

```astro
---
import Welcome from '../components/Welcome.astro';
import Layout from '../layouts/Layout.astro';
import LeafletMap from '../components/LeafletMap.astro';

// Load API key from environment variables
const apiKey = import.meta.env.N2YO_API_KEY;

// Welcome to Astro! Wondering what to do next? Check out the Astro documentation at https://docs.astro.build
// Don't want to use any of this? Delete everything in this file, the `assets`, `components`, and `layouts` directories, and start fresh.
---

<Layout>
	<main>
		<section class="map-section">
			<h1>Real-time Satellite Tracker</h1>
			<p>Track specific satellites like the ISS, Starlink, and other interesting spacecraft</p>
			{!apiKey && (
				<div class="api-notice error">
					<p><strong>Warning:</strong> No API key found. Please add N2YO_API_KEY to your .env file.</p>
				</div>
			)}
			{apiKey && (
				<div class="api-notice success">
					<p><strong>✓ Connected:</strong> Using N2YO API for real-time satellite data</p>
				</div>
			)}
			<LeafletMap 
				latitude={41.649693} 
				longitude={-0.887712} 
				zoom={2}
				height="600px"
				apiKey={apiKey || ""}
				showSatellites={true}
				satelliteCategory={2}
				searchRadius={180}
				updateInterval={30000}
			/>
		</section>
	</main>
</Layout>

<style>
	main {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.75);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		margin-top: 2rem;
		margin-bottom: 2rem;
		position: relative;
		z-index: 10;
	}

	.map-section {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
		margin-bottom: 0.5rem;
		font-size: 2.5rem;
	}

	p {
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.api-notice {
		border-radius: 8px;
		padding: 1rem;
		margin: 1rem 0;
		text-align: left;
	}

	.api-notice.success {
		background: #d4edda;
		border: 1px solid #c3e6cb;
	}

	.api-notice.success p {
		margin: 0;
		color: #0d4318;
		font-weight: 500;
	}

	.api-notice.error {
		background: #f8d7da;
		border: 1px solid #f5c6cb;
	}

	.api-notice.error p {
		margin: 0;
		color: #721c24;
	}

	.api-notice a {
		color: #0066cc;
		text-decoration: none;
	}

	.api-notice a:hover {
		text-decoration: underline;
	}
</style>

```

---

## ▶️ 8. Ejecutar la aplicación

Lanzamos el servidor de desarrollo con:

```bash
npm run dev
```

Abrimos el navegador en `http://localhost:4321` y veremos el mapa interactivo con datos cargados desde nuestra API.

---

## 🎯 Conclusión

Con este tutorial has aprendido a:

- Crear un proyecto con Astro  
- Usar un **layout reutilizable**  
- Integrar un **mapa interactivo con Leaflet**  
- Conectar con una **API abierta** en Astro  
- Renderizar datos dinámicos en una página web

¡Ya tienes tu primera aplicación de mapas con Astro 🚀!

