import { useRef, useState } from "react";
import { Upload, Loader2, X, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

/** Upload an image/video to the "media" bucket and return the public URL. */
export function MediaUpload({
  value,
  onChange,
  accept = "image/*",
  kind = "image",
  allowUrl = false,
  label,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  accept?: string;
  kind?: "image" | "video";
  allowUrl?: boolean;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true); setErr(null);
    try {
      const ext = file.name.split(".").pop() || (kind === "video" ? "mp4" : "jpg");
      const path = `${kind}s/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000", upsert: false, contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      // Register in media_assets (dedupe on url)
      const { data: existing } = await supabase.from("media_assets").select("id").eq("url", pub.publicUrl).maybeSingle();
      if (!existing) {
        await supabase.from("media_assets").insert({
          title: file.name, kind, url: pub.publicUrl, storage_path: path, mime_type: file.type,
        });
      }
      onChange(pub.publicUrl);
    } catch (e: any) { setErr(e.message || "Échec du téléversement"); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-medium text-ink">{label}</div>}
      {value ? (
        <div className="relative inline-block rounded-lg border border-border bg-surface-alt p-2">
          {kind === "video" ? (
            <video src={value} className="h-24 w-40 rounded object-cover" muted playsInline />
          ) : (
            <img src={value} alt="Aperçu" className="h-24 w-40 rounded object-cover" />
          )}
          <button type="button" onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-red-600 text-white shadow"
            aria-label="Retirer">
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:text-brand disabled:opacity-60">
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {value ? "Remplacer le fichier" : "Téléverser un fichier"}
        </button>
        {allowUrl && (
          <button type="button" onClick={() => setUrlMode((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-brand">
            <LinkIcon className="size-3" /> {urlMode ? "Masquer l'URL" : "…ou coller une URL"}
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>
      {allowUrl && urlMode && (
        <input type="url" placeholder="https://…" value={value || ""} onChange={(e) => onChange(e.target.value || null)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs" />
      )}
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}