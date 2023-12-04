
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgtap" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."follow@upsert:before"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  if not old is null then
    new.created_at = old.created_at;
  end if;

  return new;
end;$$;

ALTER FUNCTION "public"."follow@upsert:before"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_last_ep_read"("manga_id" "text", "source_id" "text") RETURNS TABLE("h_manga_id" integer, "id" "text", "name" "text", "param" "text", "source" "text", "updated_at" timestamp with time zone, "current_page" smallint, "max_page" smallint)
    LANGUAGE "plpgsql"
    AS $$

BEGIN
  RETURN QUERY
  SELECT 
    hm.id as h_manga_id,
    hm.last_ch_id AS id,
    hm.last_ch_name AS name, 
    hm.last_ch_param AS param, 
    hm.source_id as source,
    hm.updated_at,
    hc.current_page,
    hc.max_page
  FROM 
    history_manga AS hm
  JOIN
    history_chapter as hc
  ON
    hm.id = hc.h_manga_id
  WHERE
    hm.manga_id = get_last_ep_read.manga_id AND
    hm.user_id = auth.uid() AND
    hm.source_id = get_last_ep_read.source_id
  LIMIT 1;
END;

$$;

ALTER FUNCTION "public"."get_last_ep_read"("manga_id" "text", "source_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_ls_ep_read"("manga_id" "text", "source_id" "text") RETURNS TABLE("ep_id" "text", "current_page" smallint, "max_page" smallint, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$

BEGIN
  return query
  SELECT history_chapter.ep_id, history_chapter.current_page, history_chapter.max_page, history_chapter.updated_at FROM history_chapter
  WHERE
    h_manga_id IN (
      SELECT id FROM history_manga
      WHERE
        history_manga.manga_id =get_ls_ep_read.manga_id AND
        history_manga.user_id = auth.uid() and
        history_manga.source_id = get_ls_ep_read.source_id
      LIMIT 1
    );
 
END;
$$;

ALTER FUNCTION "public"."get_ls_ep_read"("manga_id" "text", "source_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text") RETURNS TABLE("id" integer, "current_page" smallint, "max_page" smallint, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$

BEGIN
  return query
  select history_chapter.id,  history_chapter.current_page,  history_chapter.max_page,  history_chapter.updated_at
  FROM 
    history_chapter
  WHERE
     history_chapter.h_manga_id = (
      select history_manga.id from history_manga where
        history_manga.manga_id = get_progress_read_ep.manga_id and
        history_manga.source_id = get_progress_read_ep.source_id and
        history_manga.user_id = auth.uid()
      limit 1
    ) and
     history_chapter.ep_id = get_progress_read_ep.ep_id
  LIMIT 1;
END;
$$;

ALTER FUNCTION "public"."get_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_before_del_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  delete from history_manga where user_id = old.id;
  delete from follow where user_id = old.id;
  delete from profiles where id = old.id;
  return old;
end;$$;

ALTER FUNCTION "public"."handle_before_del_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
    if new.raw_user_meta_data is null or new.raw_user_meta_data->>'full_name' is null or new.raw_user_meta_data->>'full_name' = '' then
        insert into public.profiles (id, full_name, avatar_url)
        values (new.id, concat('user ', FLOOR(random() * 900000) + 10000), new.raw_user_meta_data->>'avatar_url');
    else
        insert into public.profiles (id, full_name, avatar_url)
        values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    end if;
    return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."history_chapter@upsert::before"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  new.updated_at = now();
  return new;
end;$$;

ALTER FUNCTION "public"."history_chapter@upsert::before"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."history_manga@delete::before"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  delete from history_chapter where h_manga_id = old.id;
  return old;
end;$$;

ALTER FUNCTION "public"."history_manga@delete::before"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."history_manga@upsert::after"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  if not exists(
    select 1 from history_chapter where h_manga_id = new.id and ep_id = new.last_ch_id
  ) then
    insert into history_chapter (h_manga_id, ep_id, current_page) values (new.id, new.last_ch_id, 0);
  else
    update history_chapter set updated_at = now() where h_manga_id = new.id and ep_id = new.last_ch_id;
  end if;

  return new;
end;$$;

ALTER FUNCTION "public"."history_manga@upsert::after"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."history_manga@upsert::before"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  if not OLD is null then
    new.created_at = old.created_at;
  end if;

  NEW.updated_at := now();
  return new;
end;$$;

ALTER FUNCTION "public"."history_manga@upsert::before"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text", "current_page" smallint, "max_page" smallint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare xh_manga_id int4;
BEGIN
  SELECT id INTO xh_manga_id FROM history_manga 
  WHERE 
    history_manga.manga_id = set_progress_read_ep.manga_id AND 
    history_manga.user_id = auth.uid() AND 
    history_manga.source_id = set_progress_read_ep.source_id
  LIMIT 1 ;

  IF xh_manga_id IS NOT NULL THEN
    if (exists(select 1 from history_chapter where h_manga_id = xh_manga_id and ep_id = set_progress_read_ep.ep_id limit 1)) then
      INSERT INTO history_chapter (h_manga_id, ep_id, current_page, max_page)
         VALUES (xh_manga_id, set_progress_read_ep.ep_id, set_progress_read_ep.current_page, set_progress_read_ep.max_page);
    else
      UPDATE history_chapter SET 
        current_page = set_progress_read_ep.current_page, 
        max_page = set_progress_read_ep.max_page
        where h_manga_id = xh_manga_id and ep_id = set_progress_read_ep.ep_id;
    end if;
  END if;
END;
$$;

ALTER FUNCTION "public"."set_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text", "current_page" smallint, "max_page" smallint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_avatar_after_upsert_bucket_avatars"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
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
$$;

ALTER FUNCTION "public"."update_avatar_after_upsert_bucket_avatars"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."upsert_history_manga"("manga_id" "text", "source_id" "text", "last_ch_id" "text", "last_ch_name" "text", "last_ch_param" "text", "image" "text", "manga_name" "text", "manga_param" "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result_id int4;
BEGIN
  IF (EXISTS(SELECT 1 FROM history_manga WHERE history_manga.manga_id = upsert_history_manga.manga_id AND history_manga.user_id = auth.uid() AND history_manga.source_id = upsert_history_manga.source_id LIMIT 1)) THEN
    UPDATE history_manga
    SET 
      manga_id = upsert_history_manga.manga_id, 
      source_id = upsert_history_manga.source_id,
      last_ch_id = upsert_history_manga.last_ch_id,
      last_ch_name = upsert_history_manga.last_ch_name,
      last_ch_param = upsert_history_manga.last_ch_param,
      image = upsert_history_manga.image,
      manga_name = upsert_history_manga.manga_name,
      manga_param = upsert_history_manga.manga_param
    WHERE 
      history_manga.manga_id = upsert_history_manga.manga_id AND 
      history_manga.user_id = auth.uid() AND 
      history_manga.source_id = upsert_history_manga.source_id
    RETURNING id INTO result_id;
  ELSE
    INSERT INTO history_manga (manga_id, source_id, last_ch_id, last_ch_name, last_ch_param, image, manga_name, manga_param)
    VALUES (upsert_history_manga.manga_id, upsert_history_manga.source_id, upsert_history_manga.last_ch_id, upsert_history_manga.last_ch_name, upsert_history_manga.last_ch_param, upsert_history_manga.image, upsert_history_manga.manga_name, upsert_history_manga.manga_param)
    RETURNING id INTO result_id;
  END IF;
  RETURN result_id;
END;
$$;

ALTER FUNCTION "public"."upsert_history_manga"("manga_id" "text", "source_id" "text", "last_ch_id" "text", "last_ch_name" "text", "last_ch_param" "text", "image" "text", "manga_name" "text", "manga_param" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."follow" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "manga_param" "text" NOT NULL,
    "image" "text" NOT NULL,
    "manga_name" "text" NOT NULL,
    "manga_id" "text" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "source_id" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."follow" OWNER TO "postgres";

ALTER TABLE "public"."follow" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."follow_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."history_chapter" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "h_manga_id" integer NOT NULL,
    "ep_id" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_page" smallint NOT NULL,
    "max_page" smallint NOT NULL
);

ALTER TABLE "public"."history_chapter" OWNER TO "postgres";

ALTER TABLE "public"."history_chapter" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."history.chapter_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."history_manga" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "manga_name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "manga_param" "text" NOT NULL,
    "manga_id" "text" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "last_ch_id" "text" NOT NULL,
    "last_ch_name" "text" NOT NULL,
    "last_ch_param" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_id" "text" NOT NULL
);

ALTER TABLE "public"."history_manga" OWNER TO "postgres";

ALTER TABLE "public"."history_manga" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text" NOT NULL,
    "avatar_url" "text",
    "genre" boolean,
    "birthday" "date"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow__manga_id_$_user_id_unique" UNIQUE ("manga_id", "user_id");

ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."history_chapter"
    ADD CONSTRAINT "history.chapter_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."history_manga"
    ADD CONSTRAINT "history_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

CREATE INDEX "follow_user_id_idx" ON "public"."follow" USING "btree" ("user_id");

CREATE UNIQUE INDEX "history.chapter: history_manga_id + ep_id" ON "public"."history_chapter" USING "btree" ("h_manga_id", "ep_id");

CREATE INDEX "history.chapter_history_manga_id_idx" ON "public"."history_chapter" USING "btree" ("h_manga_id");

CREATE INDEX "history.manga_user_id_idx" ON "public"."history_manga" USING "btree" ("user_id");

CREATE INDEX "history_manga_manga_id_user_id_source_id_idx" ON "public"."history_manga" USING "btree" ("manga_id", "user_id", "source_id");

CREATE TRIGGER "on_after_upsert" AFTER INSERT OR UPDATE ON "public"."history_manga" FOR EACH ROW EXECUTE FUNCTION "public"."history_manga@upsert::after"();

CREATE TRIGGER "on_before_del_history.manga" BEFORE DELETE ON "public"."history_manga" FOR EACH ROW EXECUTE FUNCTION "public"."history_manga@delete::before"();

CREATE TRIGGER "on_before_upsert" BEFORE INSERT OR UPDATE ON "public"."history_chapter" FOR EACH ROW EXECUTE FUNCTION "public"."history_chapter@upsert::before"();

CREATE TRIGGER "on_before_upsert" BEFORE INSERT OR UPDATE ON "public"."history_manga" FOR EACH ROW EXECUTE FUNCTION "public"."history_manga@upsert::before"();

CREATE TRIGGER "on_before_upsert_follow" BEFORE INSERT OR UPDATE ON "public"."follow" FOR EACH ROW EXECUTE FUNCTION "public"."follow@upsert:before"();

ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."history_chapter"
    ADD CONSTRAINT "history_chapter_h_manga_id_fkey" FOREIGN KEY ("h_manga_id") REFERENCES "public"."history_manga"("id");

ALTER TABLE ONLY "public"."history_manga"
    ADD CONSTRAINT "history_manga_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

CREATE POLICY "Disable delete" ON "public"."profiles" FOR DELETE USING (false);

CREATE POLICY "Disabled" ON "public"."history_chapter" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "Disabled delete" ON "public"."history_manga" FOR DELETE USING (false);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."follow" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated only user" ON "public"."history_manga" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) AND ("created_at" = "now"())));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."history_chapter" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."history_manga"
  WHERE (("history_manga"."id" = "history_chapter"."h_manga_id") AND ("history_manga"."user_id" = "auth"."uid"()))
 LIMIT 1)));

CREATE POLICY "Enable insert for only auth" ON "public"."follow" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) AND ("created_at" = "now"())));

CREATE POLICY "Enable read access for only user" ON "public"."follow" FOR SELECT USING (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable read access for only user" ON "public"."history_chapter" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."history_manga"
  WHERE (("history_manga"."id" = "history_chapter"."h_manga_id") AND ("history_manga"."user_id" = "auth"."uid"()))
 LIMIT 1)));

CREATE POLICY "Enable read access for only user" ON "public"."history_manga" FOR SELECT USING (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable update for only user" ON "public"."follow" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable update for only user" ON "public"."history_manga" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable update for users based on email" ON "public"."history_chapter" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."history_manga"
  WHERE (("history_manga"."id" = "history_chapter"."h_manga_id") AND ("history_manga"."user_id" = "auth"."uid"()))
 LIMIT 1))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."history_manga"
  WHERE (("history_manga"."id" = "history_chapter"."h_manga_id") AND ("history_manga"."user_id" = "auth"."uid"()))
 LIMIT 1)));

CREATE POLICY "Only user" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."follow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."history_chapter" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."history_manga" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."follow@upsert:before"() TO "anon";
GRANT ALL ON FUNCTION "public"."follow@upsert:before"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."follow@upsert:before"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_last_ep_read"("manga_id" "text", "source_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_last_ep_read"("manga_id" "text", "source_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_last_ep_read"("manga_id" "text", "source_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_ls_ep_read"("manga_id" "text", "source_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_ls_ep_read"("manga_id" "text", "source_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_ls_ep_read"("manga_id" "text", "source_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_before_del_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_before_del_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_before_del_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."history_chapter@upsert::before"() TO "anon";
GRANT ALL ON FUNCTION "public"."history_chapter@upsert::before"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."history_chapter@upsert::before"() TO "service_role";

GRANT ALL ON FUNCTION "public"."history_manga@delete::before"() TO "anon";
GRANT ALL ON FUNCTION "public"."history_manga@delete::before"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."history_manga@delete::before"() TO "service_role";

GRANT ALL ON FUNCTION "public"."history_manga@upsert::after"() TO "anon";
GRANT ALL ON FUNCTION "public"."history_manga@upsert::after"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."history_manga@upsert::after"() TO "service_role";

GRANT ALL ON FUNCTION "public"."history_manga@upsert::before"() TO "anon";
GRANT ALL ON FUNCTION "public"."history_manga@upsert::before"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."history_manga@upsert::before"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text", "current_page" smallint, "max_page" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."set_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text", "current_page" smallint, "max_page" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_progress_read_ep"("manga_id" "text", "source_id" "text", "ep_id" "text", "current_page" smallint, "max_page" smallint) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_avatar_after_upsert_bucket_avatars"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_avatar_after_upsert_bucket_avatars"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_avatar_after_upsert_bucket_avatars"() TO "service_role";

GRANT ALL ON FUNCTION "public"."upsert_history_manga"("manga_id" "text", "source_id" "text", "last_ch_id" "text", "last_ch_name" "text", "last_ch_param" "text", "image" "text", "manga_name" "text", "manga_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_history_manga"("manga_id" "text", "source_id" "text", "last_ch_id" "text", "last_ch_name" "text", "last_ch_param" "text", "image" "text", "manga_name" "text", "manga_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_history_manga"("manga_id" "text", "source_id" "text", "last_ch_id" "text", "last_ch_name" "text", "last_ch_param" "text", "image" "text", "manga_name" "text", "manga_param" "text") TO "service_role";

GRANT ALL ON TABLE "public"."follow" TO "anon";
GRANT ALL ON TABLE "public"."follow" TO "authenticated";
GRANT ALL ON TABLE "public"."follow" TO "service_role";

GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."history_chapter" TO "anon";
GRANT ALL ON TABLE "public"."history_chapter" TO "authenticated";
GRANT ALL ON TABLE "public"."history_chapter" TO "service_role";

GRANT ALL ON SEQUENCE "public"."history.chapter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."history.chapter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."history.chapter_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."history_manga" TO "anon";
GRANT ALL ON TABLE "public"."history_manga" TO "authenticated";
GRANT ALL ON TABLE "public"."history_manga" TO "service_role";

GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
