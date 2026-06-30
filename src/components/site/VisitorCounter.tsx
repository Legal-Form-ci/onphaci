import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { incrementVisitor, getVisitorCount } from "@/lib/site-stats.functions";

const SESSION_KEY = "onpha_visit_counted";

const FALLBACK = 33897;

export function VisitorCounter() {
  const [value, setValue] = useState<number>(FALLBACK);
  const inc = useServerFn(incrementVisitor);
  const get = useServerFn(getVisitorCount);

  useEffect(() => {
    let cancelled = false;
    const counted = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    const run = async () => {
      try {
        const r = counted ? await get() : await inc();
        if (!cancelled && r?.value != null) {
          setValue(r.value);
          if (!counted) sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch { /* silent — keep fallback */ }
    };
    run();
    return () => { cancelled = true; };
  }, [inc, get]);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand"
      title="Visiteurs depuis le lancement de la plateforme"
      aria-label={`${value.toLocaleString("fr-FR")} visiteurs`}
    >
      <Eye className="size-3.5" aria-hidden />
      {value.toLocaleString("fr-FR")}
    </span>
  );
}