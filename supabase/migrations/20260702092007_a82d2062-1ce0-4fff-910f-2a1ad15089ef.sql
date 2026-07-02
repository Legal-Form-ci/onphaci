
CREATE POLICY "Public read media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
