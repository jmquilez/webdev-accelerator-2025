# Capítulo 5 · Componente LeafletMap

Fichero completo `src/components/LeafletMap.astro`:

```astro
// filepath: src/components/LeafletMap.astro
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

## Puntos clave
- Uso de `define:vars` para pasar props a script
- Timer de actualización cada 30s → se limpia en `beforeunload`
- Limitación de resultados renderizados (optimización UX)
- Colores e iconos según tipo de satélite

## Buenas prácticas aplicadas
- UI muestra estado "Loading"
- Manejo explícito de errores de red
- Separación de concerns: fetch vs render

## Apunte
- Este componente es extremadamente verboso. Es una excelente oportunidad para aprovechar la funcionalidad de Astro de importarlo como componente de otro framework que permita hacerlo mejor.
- Usa funcionalidades básicas como getElementById() porque Astro no cuenta con mecanismos mejores, pero otros frameworks puede que _sí_ los tengan.
  
> ⚙️ Podrías extraer la lógica JS a un módulo si crece más.
