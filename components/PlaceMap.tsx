'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function PlaceMap({ latitude, longitude, name }: PlaceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const styleUrl =
      process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
      'https://tiles.openfreemap.org/styles/liberty';

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [longitude, latitude],
      zoom: 14,
    });

    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    new maplibregl.Marker({ color: '#1F4D3A' })
      .setLngLat([longitude, latitude])
      .setPopup(new maplibregl.Popup({ offset: 25 }).setText(name))
      .addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [latitude, longitude, name]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '280px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e7e5e4',
      }}
    />
  );
}