/** Carte statique Népal (27.745192, 85.335618) — OpenStreetMap embed. */
export function NepalMap({ height = 340 }: { height?: number }) {
  const lat = 27.745192;
  const lon = 85.335618;
  const d = 0.02;
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-alt">
      <iframe
        title="Carte Népal — 27.745192, 85.335618"
        src={src}
        loading="lazy"
        style={{ width: "100%", height, border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-ink-soft">
        <span>Localisation : Népal · {lat}, {lon}</span>
        <a className="hover:text-brand" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`} target="_blank" rel="noopener noreferrer">
          Voir sur OpenStreetMap ↗
        </a>
      </div>
    </div>
  );
}