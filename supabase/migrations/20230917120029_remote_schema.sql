drop trigger if exists "on_before_del_history.manga" on "public"."history_manga";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Enable read access for only user" on "public"."follow";

drop policy "Enable read access for only user" on "public"."history_chapter";

drop policy "Enable read access for only user" on "public"."history_manga";

drop function if exists "public"."handle_before_del_history.manga"();

alter table "public"."follow" alter column "manga_id" set data type text using "manga_id"::text;

alter table "public"."history_chapter" alter column "ep_id" set data type text using "ep_id"::text;

alter table "public"."history_manga" alter column "manga_id" set data type text using "manga_id"::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."history_manga@delete::before"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  delete from history_chapter where h_manga_id = old.id;
  return old;
end;$function$
;

create policy "Only user"
on "public"."profiles"
as permissive
for select
to public
using ((id = auth.uid()));


create policy "Enable read access for only user"
on "public"."follow"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Enable read access for only user"
on "public"."history_chapter"
as permissive
for select
to public
using (true);


create policy "Enable read access for only user"
on "public"."history_manga"
as permissive
for select
to public
using ((user_id = auth.uid()));


CREATE TRIGGER "on_before_del_history.manga" BEFORE DELETE ON public.history_manga FOR EACH ROW EXECUTE FUNCTION "history_manga@delete::before"();


