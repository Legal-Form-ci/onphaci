import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// 14 régions/districts de Côte d'Ivoire (coord approx du chef-lieu)
const REGIONS: { name: string; lat: number; lng: number }[] = [
  { name: "Abidjan", lat: 5.3599, lng: -4.0083 },
  { name: "Yamoussoukro", lat: 6.8276, lng: -5.2893 },
  { name: "Bouaké", lat: 7.6906, lng: -5.0300 },
  { name: "Korhogo", lat: 9.4580, lng: -5.6294 },
  { name: "San-Pédro", lat: 4.7485, lng: -6.6363 },
  { name: "Daloa", lat: 6.8770, lng: -6.4502 },
  { name: "Man", lat: 7.4125, lng: -7.5538 },
  { name: "Odienné", lat: 9.5010, lng: -7.5640 },
  { name: "Bondoukou", lat: 8.0402, lng: -2.8000 },
  { name: "Abengourou", lat: 6.7297, lng: -3.4964 },
  { name: "Gagnoa", lat: 6.1319, lng: -5.9506 },
  { name: "Dimbokro", lat: 6.6470, lng: -4.7060 },
  { name: "Aboisso", lat: 5.4713, lng: -3.2071 },
  { name: "Séguéla", lat: 7.9614, lng: -6.6733 },
];

// Siège ONPHA-CI (coordonnées demandées)
const HQ = { lat: 27.745192, lng: 85.335618 };

export function IvoryCoastMap() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current, {
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: true,
      }).setView([7.54, -5.55], 6);
      // Fit bounds to markers for responsive framing
      const bounds = L.latLngBounds([]);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      const greenIcon = L.divIcon({
        className: "",
        html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#16a34a;border:2px solid #fff;box-shadow:0 0 0 2px #16a34a55"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const redIcon = L.divIcon({
        className: "",
        html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#dc2626;border:3px solid #fff;box-shadow:0 0 0 4px #dc262655"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      REGIONS.forEach((r) => {
        L.marker([r.lat, r.lng], { icon: greenIcon })
          .addTo(map)
          .bindPopup(`<strong>${r.name}</strong><br/>ONPHA-CI présent`);
        bounds.extend([r.lat, r.lng]);
      });

      L.marker([HQ.lat, HQ.lng], { icon: redIcon })
        .addTo(map)
        .bindPopup("<strong>Siège ONPHA-CI</strong>")
        .openPopup();

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });

      // Re-fit on resize for mobile rotation / responsive layout changes
      const onResize = () => {
        map.invalidateSize();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
      };
      window.addEventListener("resize", onResize);
      (map as unknown as { _cleanupResize?: () => void })._cleanupResize = () =>
        window.removeEventListener("resize", onResize);
    })();
    return () => {
      cancelled = true;
      const m = mapRef.current as { remove?: () => void; _cleanupResize?: () => void } | null;
      if (m?._cleanupResize) m._cleanupResize();
      if (m && typeof m.remove === "function") m.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div
        ref={ref}
        className="h-64 w-full sm:h-80 lg:h-96"
        aria-label="Carte interactive de la présence ONPHA-CI en Côte d'Ivoire"
      />
      <div className="flex flex-wrap items-center gap-3 border-t border-border bg-surface-alt px-4 py-2 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-3 rounded-full bg-green-600" /> Régions couvertes</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-3 rounded-full bg-red-600" /> Siège</span>
        <span className="ml-auto text-[10px] text-ink-soft/70">Touchez un marqueur pour plus d'infos</span>
      </div>
    </div>
  );
}