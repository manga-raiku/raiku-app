drop function if exists "public"."get_ls_ep_read"(manga_id bigint);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_ls_ep_read(manga_id text)
 RETURNS TABLE(ep_id text, updated_at timestamp with time zone)
 LANGUAGE sql
AS $function$
  SELECT ep_id, updated_at FROM history_chapter
  WHERE
    h_manga_id IN (
      SELECT id FROM history_manga
      WHERE
        history_manga.manga_id = manga_id AND
        user_id = auth.uid()
      LIMIT 1
    );
$function$
;


