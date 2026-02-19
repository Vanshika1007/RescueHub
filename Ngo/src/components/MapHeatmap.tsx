import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface MapHeatmapProps {
  height?: number;
}

// Mock help requests with lat/lng and urgency weight
const mockPoints = [
  { lng: 77.1025, lat: 28.7041, urgency: 'critical', weight: 1.0, label: 'Delhi - Medical' },
  { lng: 77.3197, lat: 28.4089, urgency: 'high',     weight: 0.8, label: 'Gurgaon - Rescue' },
  { lng: 77.0266, lat: 28.4595, urgency: 'medium',   weight: 0.6, label: 'Gurgaon - Food' },
  { lng: 77.1734, lat: 28.6290, urgency: 'critical', weight: 1.0, label: 'Delhi - Water' },
  { lng: 77.3440, lat: 28.5355, urgency: 'low',      weight: 0.3, label: 'Noida - Shelter' },
  { lng: 77.3910, lat: 28.5350, urgency: 'high',     weight: 0.8, label: 'Noida - Medical' },
  { lng: 77.2090, lat: 28.6139, urgency: 'medium',   weight: 0.6, label: 'Delhi - Food' },
];

function toGeoJSON(points: typeof mockPoints): GeoJSON.FeatureCollection<GeoJSON.Point, any> {
  return {
    type: 'FeatureCollection',
    features: points.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        weight: p.weight,
        urgency: p.urgency,
        label: p.label,
      },
    })),
  };
}

const TOKEN_STORAGE_KEY = 'mapbox_token';

const MapHeatmap: React.FC<MapHeatmapProps> = ({ height = 400 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [draftToken, setDraftToken] = useState('');
  const { toast } = useToast();

  const initMap = () => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    // Create map
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.2090, 28.6139], // Delhi NCR
      zoom: 8.5,
      pitch: 0,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    const data = toGeoJSON(mockPoints);

    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      mapRef.current.addSource('requests', {
        type: 'geojson',
        data,
      });

      // Heatmap layer
      mapRef.current.addLayer({
        id: 'requests-heat',
        type: 'heatmap',
        source: 'requests',
        maxzoom: 15,
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1,
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            0, 2,
            9, 20,
            15, 40
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#22c55e',  
            0.4, '#eab308',  
            0.6, '#f97316',  
            0.8, '#ef4444',  
            1, '#991b1b'     
          ],
          'heatmap-opacity': 0.85,
        },
      });

      // Point markers (for clarity on top)
      mapRef.current.addLayer({
        id: 'requests-point',
        type: 'circle',
        source: 'requests',
        minzoom: 6,
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'match', ['get', 'urgency'],
            'critical', '#ef4444',
            'high', '#eab308',
            'medium', '#3b82f6',
            /* other */ '#22c55e'
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        },
      });

      // Popups on click
      mapRef.current.on('click', 'requests-point', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        const { urgency, label } = (f.properties || {}) as any;
        new mapboxgl.Popup({ closeButton: false })
          .setLngLat([lng, lat])
          .setHTML(`<div style="font-weight:600">${label || 'Request'}</div><div>Urgency: ${urgency}</div>`)
          .addTo(mapRef.current!);
      });

      // Cursor pointer
      mapRef.current.on('mouseenter', 'requests-point', () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'requests-point', () => {
        if (!mapRef.current) return;
        mapRef.current.getCanvas().style.cursor = '';
      });
    });
  };

  useEffect(() => {
    if (!token) return; // wait until token is set
    initMap();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const saveToken = () => {
    if (!draftToken) {
      toast({ title: 'Map token required', description: 'Enter your Mapbox public token', variant: 'destructive' });
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, draftToken);
    setToken(draftToken);
    setDraftToken('');
    toast({ title: 'Saved', description: 'Mapbox token saved locally.' });
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {!token && (
        <Card className="absolute z-10 left-1/2 -translate-x-1/2 top-6 w-[92%] max-w-xl p-4 bg-background/95 backdrop-blur border">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter your Mapbox public token to view the live heatmap. You can find it in your Mapbox account under Tokens.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="pk.eyJ..."
                value={draftToken}
                onChange={(e) => setDraftToken(e.target.value)}
              />
              <Button onClick={saveToken}>Save</Button>
            </div>
          </div>
        </Card>
      )}
      <div ref={containerRef} className="absolute inset-0 rounded-lg overflow-hidden border" />
    </div>
  );
};

export default MapHeatmap;
