import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix del ícono default de Leaflet (si no, el marker no se ve)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationPickerModal({ onConfirm, onClose }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // En desarrollo, React.StrictMode monta este efecto, lo desmonta y lo
    // vuelve a montar. Como initMap llega desde un callback asíncrono
    // (getCurrentPosition), el cleanup del primer montaje puede correr
    // antes de que exista mapInstance.current, dejando dos resoluciones
    // pendientes que intentan crear un mapa sobre el mismo contenedor.
    // Este flag evita que una resolución "vieja" inicialice el mapa.
    let cancelled = false;

    // Centro inicial: geolocalización del navegador, o un fallback fijo
    const initMap = (lat, lng) => {
      if (cancelled || mapInstance.current) return;

      const map = L.map(mapRef.current).setView([lat, lng], 15);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      setPosition({ lat, lng });

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setPosition({ lat, lng });
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude),
        () => initMap(-17.7833, -63.1821) // fallback: Santa Cruz de la Sierra
      );
    } else {
      initMap(-17.7833, -63.1821);
    }

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Al rotar el celular el contenedor cambia de tamaño, pero Leaflet no
  // se entera solo: hay que forzar el recálculo del mapa.
  useEffect(() => {
    const handleResize = () => mapInstance.current?.invalidateSize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const handleConfirm = () => {
    if (!position) return;
    const mapsLink = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
    onConfirm(mapsLink);
  };

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <span>Selecciona la ubicación</span>
          <button onClick={onClose}>✖</button>
        </div>

        <div ref={mapRef} className="location-modal-map" />

        <div className="location-modal-footer">
          <span className="location-modal-hint">
            Arrastra el pin o toca el mapa para ajustar
          </span>
          <button
            className="location-modal-confirm-btn"
            onClick={handleConfirm}
            disabled={!position}
          >
            Confirmar ubicación
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPickerModal;