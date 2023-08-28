create extension if not exists "wrappers" with schema "extensions";


drop trigger if exists "check_history_insert" on "public"."history";

drop policy "Enable ALL access for only user_id" on "public"."follow";

drop policy "Enable ALL access for only `user_id`" on "public"."history";

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone not null default now(),
    "full_name" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX "follow__manga_id_$_user_id_unique" ON public.follow USING btree (manga_id, user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."follow" add constraint "follow__manga_id_$_user_id_unique" UNIQUE using index "follow__manga_id_$_user_id_unique";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_before_del_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  delete from history where user_id = old.id;
  delete from follow where user_id = old.id;
  delete from profiles where id = old.id;
  return old;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_avatar_after_upsert_bucket_avatars()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if bucket_id = 'avatars' then
update
  profiles
set
  avatar_url = name
where
  id = owner;

end if;

return new;

end;
$function$
;

create policy "Enable delete for users based on user_id"
on "public"."follow"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for only auth"
on "public"."follow"
as permissive
for insert
to authenticated
with check (((user_id = auth.uid()) AND (created_at = now())));


create policy "Enable read access for only user"
on "public"."follow"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Enable update for only user"
on "public"."follow"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check (((user_id = auth.uid()) AND (created_at = now())));


create policy "Disabled delete"
on "public"."history"
as permissive
for delete
to public
using (false);


create policy "Enable insert for authenticated only user"
on "public"."history"
as permissive
for insert
to authenticated
with check (((user_id = auth.uid()) AND (created_at = now())));


create policy "Enable read access for only user"
on "public"."history"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Enable update for only user"
on "public"."history"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check (((user_id = auth.uid()) AND (created_at = now())));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


CREATE TRIGGER check_history_insert BEFORE INSERT ON public.history FOR EACH ROW EXECUTE FUNCTION check_history_insert();


