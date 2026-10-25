"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);

  return null;
}

function LocationSelector({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect([event.latlng.lat, event.latlng.lng]);
    },
  });

  return (
    <CircleMarker
      center={position}
      radius={9}
      pathOptions={{
        color: "#ffffff",
        fillColor: "#f97316",
        fillOpacity: 1,
        weight: 3,
      }}
    />
  );
}

export default function BookingMap({
  initialPosition = [8.9806, 38.7578],
  selectedPosition,
  onLocationSelect,
}) {
  const position = selectedPosition || initialPosition;

  function handleLocationSelect(newPosition) {
    onLocationSelect?.({
      latitude: newPosition[0],
      longitude: newPosition[1],
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">
          Pickup location map
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Search for an address above or click directly on the map.
        </p>
      </div>

      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom
        style={{ height: "320px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater position={position} />

        <LocationSelector
          position={position}
          onLocationSelect={handleLocationSelect}
        />
      </MapContainer>

      <div className="p-4 text-sm text-slate-300">
        <p>Latitude: {position[0].toFixed(6)}</p>
        <p>Longitude: {position[1].toFixed(6)}</p>
      </div>
    </div>
  );
}