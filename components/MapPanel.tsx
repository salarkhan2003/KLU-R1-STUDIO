
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default Leaflet icon path issues with bundlers
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPanelProps {
  latitude: number;
  longitude: number;
}

const rocketIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-blue-400 drop-shadow-lg"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
  className: 'bg-transparent border-0',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const MapPanel: React.FC<MapPanelProps> = ({ latitude, longitude }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapRef.current = map;
    }

    // Cleanup on unmount
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    }
  }, []); // Empty dependency array ensures this runs only once

  // Update marker and view
  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
        const latLng = new L.LatLng(latitude, longitude);
        if (!markerRef.current) {
            const marker = L.marker(latLng, { icon: rocketIcon }).addTo(mapRef.current);
            markerRef.current = marker;
        } else {
            markerRef.current.setLatLng(latLng);
        }
        mapRef.current.panTo(latLng);
    }
  }, [latitude, longitude]);

  return (
    <div className="bg-spacex-card border border-spacex-border p-4 rounded-md h-80 relative flex flex-col">
      <h2 className="text-lg font-medium text-gray-300 mb-2 flex-shrink-0 uppercase">GPS Tracking</h2>
      <div className="flex-grow relative">
        <div ref={mapContainerRef} className="absolute inset-0 rounded-sm z-0" />
        <div className="absolute bottom-2 right-2 font-mono text-xs text-spacex-gray z-10 bg-spacex-card/70 px-2 py-1 rounded">
            <p>LAT: {latitude.toFixed(4)}</p>
            <p>LON: {longitude.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};