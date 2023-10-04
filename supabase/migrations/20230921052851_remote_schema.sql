alter table "public"."follow" drop column "path";

alter table "public"."follow" add column "manga_param" text not null;

alter table "public"."follow" add column "source_id" text not null default ''::text;

alter table "public"."history_manga" drop column "last_ch_path";

alter table "public"."history_manga" drop column "manga_path";

alter table "public"."history_manga" add column "last_ch_param" text not null;

alter table "public"."history_manga" add column "manga_param" text not null;

alter table "public"."history_manga" add column "source_id" text not null default ''::text;


