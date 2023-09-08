drop policy "Disable delete" on "public"."history_chapter";

drop policy "Enable update for only user" on "public"."follow";

drop policy "Enable insert for authenticated users only" on "public"."history_chapter";

drop policy "Enable read access for only user" on "public"."history_chapter";

drop policy "Enable update for users based on email" on "public"."history_chapter";

drop policy "Enable update for only user" on "public"."history_manga";

alter table "public"."history_chapter" drop constraint "history_chapter_history_manga_id_fkey";

drop index if exists "public"."history.chapter: history_manga_id + ep_id";

drop index if exists "public"."history.chapter_history_manga_id_idx";

alter table "public"."history_chapter" drop column "history_manga_id";

alter table "public"."history_chapter" add column "h_manga_id" bigint not null;

CREATE UNIQUE INDEX "history.chapter: history_manga_id + ep_id" ON public.history_chapter USING btree (h_manga_id, ep_id);

CREATE INDEX "history.chapter_history_manga_id_idx" ON public.history_chapter USING btree (h_manga_id);

alter table "public"."history_chapter" add constraint "history_chapter_h_manga_id_fkey" FOREIGN KEY (h_manga_id) REFERENCES history_manga(id) not valid;

alter table "public"."history_chapter" validate constraint "history_chapter_h_manga_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."follow@upsert:before"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if not old is null then
    new.created_at = old.created_at;
  end if;

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_ls_ep_read(manga_id bigint)
 RETURNS TABLE(ep_id bigint, updated_at timestamp with time zone)
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

CREATE OR REPLACE FUNCTION public."history_manga@upsert::before"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- if exists(select 1 from history_manga where user_id = auth.uid() and manga_id = new.manga_id limit 1) then
  --   update history_manga set
  --     manga_name   = new.manga_name,
  --     image        = new.image,
  --     manga_path   = new.manga_path,
      
  --     last_ch_id   = new.last_ch_id,
  --     last_ch_name = new.last_ch_name,
  --     last_ch_path = new.last_ch_path,
      
  --     updated_at   = now()
  --    where user_id = auth.uid() and manga_id = new.manga_id;
  --   return null;
  -- end if;

  if not OLD is null then
    new.created_at = old.created_at;
  end if;

  NEW.updated_at := now();
  return new;
end;$function$
;

create policy "Disabled"
on "public"."history_chapter"
as permissive
for delete
to authenticated
using (false);


create policy "Enable update for only user"
on "public"."follow"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Enable insert for authenticated users only"
on "public"."history_chapter"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for only user"
on "public"."history_chapter"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."history_chapter"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable update for only user"
on "public"."history_manga"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


CREATE TRIGGER on_before_upsert_follow BEFORE INSERT OR UPDATE ON public.follow FOR EACH ROW EXECUTE FUNCTION "follow@upsert:before"();


