alter table "public"."profiles" add column "birthday" date;

alter table "public"."profiles" add column "genre" boolean;

alter table "public"."profiles" alter column "full_name" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
    if new.raw_user_meta_data is null or new.raw_user_meta_data->>'full_name' is null or new.raw_user_meta_data->>'full_name' = '' then
        insert into public.profiles (id, full_name, avatar_url)
        values (new.id, concat('user ', FLOOR(random() * 900000) + 10000), new.raw_user_meta_data->>'avatar_url');
    else
        insert into public.profiles (id, full_name, avatar_url)
        values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public."history_manga@upsert::after"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if not exists(
    select 1 from history_chapter where h_manga_id = new.id and ep_id = new.last_ch_id
  ) then
    insert into history_chapter (h_manga_id, ep_id) values (new.id, new.last_ch_id);
  else
    update history_chapter set updated_at = now() where h_manga_id = new.id and ep_id = new.last_ch_id;
  end if;

  return new;
end;$function$
;


