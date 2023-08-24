create extension if not exists "pgtap" with schema "extensions";


alter table "public"."follow" alter column "user_id" set default auth.uid();

alter table "public"."history" alter column "user_id" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_history_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    history_row RECORD;
BEGIN
    SELECT * INTO history_row FROM history WHERE user_id = NEW.user_id ORDER BY created_at DESC LIMIT 1;
    IF history_row IS NOT NULL AND date(history_row.created_at) = date(NEW.created_at) AND history_row.manga_id = NEW.manga_id THEN
        UPDATE history SET created_at = NEW.created_at, name = NEW.name, poster = NEW.poster, path = NEW.path, ch_id = NEW.ch_id, ch_name = NEW.ch_name, ch_path = NEW.ch_path WHERE id = history_row.id;
        RETURN NULL;
    ELSE
        RETURN NEW;
    END IF;
END;
$function$
;

create policy "Enable ALL access for only user_id"
on "public"."follow"
as permissive
for all
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Enable ALL access for only `user_id`"
on "public"."history"
as permissive
for all
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


CREATE TRIGGER check_history_insert BEFORE INSERT ON public.history FOR EACH STATEMENT EXECUTE FUNCTION check_history_insert();
ALTER TABLE "public"."history" ENABLE ALWAYS TRIGGER "check_history_insert";


