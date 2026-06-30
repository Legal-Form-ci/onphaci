REVOKE ALL ON FUNCTION public.increment_visitor_counter() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_visitor_counter() TO service_role;