
-- =========================
-- PROFILES (Google users)
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "user can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "user can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- CONTENT ENGAGEMENT (views + shares)
-- =========================
CREATE TABLE public.content_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('article','project','video')),
  slug TEXT NOT NULL,
  views BIGINT NOT NULL DEFAULT 0,
  shares BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
GRANT SELECT ON public.content_engagement TO anon, authenticated;
GRANT ALL ON public.content_engagement TO service_role;
ALTER TABLE public.content_engagement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "engagement readable by everyone" ON public.content_engagement FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.increment_content_metric(_kind TEXT, _slug TEXT, _metric TEXT)
RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_val BIGINT;
BEGIN
  IF _metric NOT IN ('views','shares') THEN
    RAISE EXCEPTION 'invalid metric';
  END IF;
  IF _kind NOT IN ('article','project','video') THEN
    RAISE EXCEPTION 'invalid kind';
  END IF;
  INSERT INTO public.content_engagement (kind, slug, views, shares)
  VALUES (_kind, _slug,
    CASE WHEN _metric = 'views' THEN 1 ELSE 0 END,
    CASE WHEN _metric = 'shares' THEN 1 ELSE 0 END)
  ON CONFLICT (kind, slug) DO UPDATE
    SET views = public.content_engagement.views + CASE WHEN _metric = 'views' THEN 1 ELSE 0 END,
        shares = public.content_engagement.shares + CASE WHEN _metric = 'shares' THEN 1 ELSE 0 END,
        updated_at = now()
  RETURNING CASE WHEN _metric = 'views' THEN views ELSE shares END INTO new_val;
  RETURN new_val;
END; $$;
GRANT EXECUTE ON FUNCTION public.increment_content_metric(TEXT,TEXT,TEXT) TO anon, authenticated;

-- =========================
-- COMMENTS
-- =========================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('article','project','video')),
  slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX comments_kind_slug_idx ON public.comments(kind, slug, created_at DESC);
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments readable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "authenticated can add own comment" ON public.comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user can delete own comment" ON public.comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- Realtime
-- =========================
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_engagement;
