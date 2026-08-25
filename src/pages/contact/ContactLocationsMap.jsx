import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAP_MAX_ZOOM = 7;

function createPopup(location) {
  const popup = document.createElement("div");
  popup.className = "contact-location-popup-content";

  const title = document.createElement("strong");
  title.textContent = location.title;

  const address = document.createElement("p");
  address.textContent = location.address;

  const directions = document.createElement("a");
  directions.href = location.directionsUrl;
  directions.target = "_blank";
  directions.rel = "noreferrer";
  directions.textContent = "Get Directions →";
  directions.setAttribute("aria-label", `Get directions to ${location.title}`);

  popup.append(title, address, directions);
  return popup;
}

export default function ContactLocationsMap({ locations }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return undefined;

    const map = L.map(container, {
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    locations.forEach((location, index) => {
      const label = String.fromCharCode(65 + index);
      const icon = L.divIcon({
        className: "contact-location-map-icon",
        html: `<span aria-hidden="true">${label}</span>`,
        iconAnchor: [17, 34],
        iconSize: [34, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker(location.coordinates, {
        alt: `${label}: ${location.title}`,
        icon,
        keyboard: true,
        riseOnHover: true,
        title: `${label}: ${location.title}`,
      });

      marker.on("add", () => {
        marker.getElement()?.setAttribute("aria-label", `${label}: ${location.title}`);
        marker.getElement()?.setAttribute("role", "button");
      });

      marker
        .addTo(map)
        .bindPopup(createPopup(location), { className: "contact-location-popup" });

      bounds.extend(location.coordinates);
    });

    const fitLocations = () => {
      map.invalidateSize({ pan: false });
      map.fitBounds(bounds, {
        animate: false,
        maxZoom: MAP_MAX_ZOOM,
        padding: [36, 36],
      });
    };

    const animationFrame = window.requestAnimationFrame(fitLocations);
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => fitLocations());

    resizeObserver?.observe(container);
    if (!resizeObserver) window.addEventListener("resize", fitLocations);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", fitLocations);
      map.remove();
    };
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      className="contact-locations-map"
      role="region"
      aria-label="Interactive map showing Euro India Foods locations in Mumbai, Chikhli, and Surat"
    />
  );
}
