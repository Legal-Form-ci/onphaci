
CREATE TABLE public.site_stats (
  key TEXT PRIMARY KEY,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site stats" ON public.site_stats
  FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.site_stats (key, value) VALUES ('visitors', 33897)
  ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_visitor_counter()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_value BIGINT;
BEGIN
  INSERT INTO public.site_stats (key, value)
  VALUES ('visitors', 33898)
  ON CONFLICT (key) DO UPDATE
    SET value = public.site_stats.value + 1,
        updated_at = now()
  RETURNING value INTO new_value;
  RETURN new_value;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_visitor_counter() TO anon, authenticated;
