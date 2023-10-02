<route lang="yaml">
name: comic
meta:
  hiddenFooter: true
  hiddenDrawer: true
  hiddenHeader: $lt.md
</route>

<template>
  <q-header v-if="$q.screen.lt.md" class="bg-dark-page header-blur">
    <q-toolbar>
      <q-btn round unelevated @click="router.back()">
        <i-fluent-arrow-left-24-filled class="size-1.5em" />
      </q-btn>

      <div class="ellipsis text-16px text-weight-medium">{{ data?.name }}</div>
    </q-toolbar>
  </q-header>
  <q-page padding>
    <div
      v-if="$q.screen.lt.md"
      class="fixed top-0 left-0 w-full h-full z--1"
      :class="{
        'before-filter-blur': data?.image,
      }"
      :style="{
        '--data-src': `url('${data?.image}')`,
      }"
    />
    <template v-if="data">
      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 mb-4 flex">
        <div>
          <div
            class="before-filter-blur before-filter-blur--no-after relative py-4 flex items-center justify-center"
            :style="{
              '--data-src': `url('${data.image}')`,
            }"
          >
            <q-img
              :src="data.image"
              :ratio="190 / 247"
              class="w-240px <sm:w-190px max-w-30vw rounded"
              no-spinner
            />
          </div>
        </div>
        <div class="pl-7 flex-1 <sm:pl-3 py-1rem">
          <h1
            class="text-28px <sm:text-22px text-[#fff] text-opacity-95 text-weight-regular leading-normal font-family-poppins ellipsis-3-lines"
          >
            {{ data.name }}
          </h1>
          <h2
            class="text-18px <sm:text-14px text-[#fff] text-opacity-87 text-weight-regular leading-normal font-family-poppins mt-3 ellipsis-2-lines"
          >
            {{ data.othername }}
          </h2>
          <small class="text-14px text-gray-400 my-2">{{
            $t("val-luot-xem", [data.views ? data.views : "N/A"])
          }}</small>

          <div
            class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
          >
            <div class="flex <md:w-full items-center">
              <i-fluent-dual-screen-status-bar-24-regular
                class="text-pink w-1.2em h-1.2em mr-1"
              />

              {{ data.status }}
            </div>

            <q-separator vertical class="mx-3 h-12px my-auto <md:!hidden" />

            <div class="flex <md:w-full items-center">
              <i-iconamoon-clock-duotone
                class="text-blue w-1.2em h-1.2em mr-1"
              />
              {{ dayjs(data.updated_at).fromNow() }}
            </div>

            <q-separator vertical class="mx-3 h-12px my-auto <md:!hidden" />

            <div class="flex <md:w-full items-center">
              <i-iconamoon-like-duotone
                class="text-yellow w-1.2em h-1.2em mr-1"
              />
              {{
                $t("val-slash-max-count-rate", [
                  data.rate.cur,
                  data.rate.max,
                  formatView(data.rate.count),
                ])
              }}
            </div>

            <q-separator vertical class="mx-3 h-12px my-auto <md:!hidden" />

            <div v-if="data.follows" class="flex <md:w-full items-center">
              <i-iconamoon-heart-duotone
                class="text-[#F5574B] w-1.2em h-1.2em mr-1"
              />
              {{ $t("val-theo-doi", [formatView(data.follows)]) }}
            </div>
          </div>

          <Tags
            class="mt-3"
            v-if="$q.screen.md || $q.screen.gt.md"
            :items="data.genres"
          />
        </div>
        <div class="w-full min-w-0">
          <Tags class="mt-3" v-if="$q.screen.lt.md" :items="data.genres" />
          <p
            class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80 break-words"
          >
            {{ data.description }}
          </p>
        </div>
      </section>

      <section
        v-if="!$q.screen.lt.md"
        class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 children:my-2"
      >
        <q-btn
          :to="data.chapters.at(-1)!.route"
          rounded
          no-caps
          class="mr-3 text-weight-normal text-15px bg-#fff bg-opacity-10 btn-action"
        >
          <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

          {{ $t("bat-dau-xem-ch-name", [data.chapters.at(-1)!.name]) }}</q-btn
        >

        <q-btn
          v-if="lastEpRead"
          :to="{
            name: 'comic chap',
            params: {
              sourceId,
              comic,
              chap: lastEpRead.param,
            },
          }"
          rounded
          no-caps
          class="mr-3 text-weight-normal text-15px bg-#fff bg-opacity-10"
        >
          <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

          {{ $t("tiep-ch-name", [lastEpRead.name]) }}
        </q-btn>

        <q-btn
          rounded
          no-caps
          class="mr-3 text-weight-normal text-15px bg-#fff bg-opacity-10"
          :disable="isFollow === undefined"
          @click="
            data &&
              followStore.set(
                {
                  image: data.image,
                  manga_id: data.manga_id,
                  manga_name: data.name,
                  manga_param: comic,
                  source_id: sourceId,
                },
                (isFollow = !isFollow),
              )
          "
        >
          <i-iconamoon-heart-fill v-if="isFollow" class="size-1.3em mr-1" />
          <i-iconamoon-heart v-else class="size-1.3em mr-1" />
          {{ isFollow ? $t("bo-theo-doi") : $t("theo-doi") }}
        </q-btn>

        <q-btn
          rounded
          no-caps
          class="mr-3 text-weight-normal text-15px bg-#fff bg-opacity-10"
          @click="onClickShare"
        >
          <i-iconamoon-share-1-bold width="1.3em" height="1.3em" class="mr-2" />
          {{ $t("chia-se") }}
        </q-btn>
      </section>

      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
        <header class="text-28px font-weight-regular">
          {{ $t("danh-sach-chuong") }}
        </header>
        <ListChapters
          :chapters="data.chapters"
          :reads-chapter="new Set(listEpRead?.map((item) => item.ep_id))"
          :map-offline="mapEp"
          :meta-manga="{
            manga_id: data.manga_id,
            manga_name: data.name,
            manga_image: data.image,
            manga_param: comic,
            source_id: sourceId,
          }"
          :source-id="sourceId"
          @downloaded="lsEpDL?.push($event)"
        />
      </section>

      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
        <header class="text-28px font-weight-regular">
          {{ $t("binh-luan") }}
        </header>
        <Comments :comments="data.comments" />
      </section>
    </template>
    <ErrorDisplay v-else-if="error" :error="error" :retry-async="runAsync" />
    <template v-else>
      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 flex">
        <div>
          <div
            class="before-filter-blur before-filter-blur--no-after relative py-4 flex items-center justify-center"
            :style="{
              '--data-src': `url()`,
            }"
          >
            <q-responsive
              :ratio="190 / 247"
              class="w-240px <sm:w-190px max-w-30vw rounded"
            >
              <q-skeleton type="rect" width="100%" height="100%" />
            </q-responsive>
          </div>
        </div>
        <div class="pl-7 flex-1 <sm:pl-3 py-1rem min-w-0">
          <q-skeleton
            type="text"
            class="text-28px <sm:text-22px leading-normal max-w-100%"
            width="340px"
          />
          <q-skeleton
            type="text"
            class="text-18px <sm:text-14px leading-normal max-w-100%"
            width="170px"
          />

          <div
            class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
          >
            <div v-for="i in 5" :key="i" class="flex <md:w-full items-center">
              <q-skeleton type="circle" size="1.2em" class="mr-1" />
              <q-skeleton type="text" width="45px" />
            </div>
          </div>

          <TagsSKT class="mt-3" v-if="$q.screen.md || $q.screen.gt.md" />
        </div>
        <div class="w-full">
          <TagsSKT class="mt-3" v-if="$q.screen.lt.md" />
          <p
            class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80"
          >
            <q-skeleton type="text" />
            <q-skeleton type="text" width="50%" />
          </p>
        </div>
      </section>

      <section
        v-if="!$q.screen.xs"
        class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 children:my-2"
      >
        <q-skeleton
          type="QBtn"
          rounded
          width="120px"
          class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
        />
        <q-skeleton
          type="QBtn"
          rounded
          width="118px"
          class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
        />
        <q-skeleton
          type="QBtn"
          rounded
          width="97px"
          class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
        />
        <q-skeleton
          type="QBtn"
          rounded
          width="109px"
          class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
        />
        <q-skeleton
          type="QBtn"
          rounded
          width="175px"
          class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
        />
      </section>

      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
        <q-skeleton type="text" class="text-28px" width="356px" />
        <ListChaptersSKT />
      </section>

      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
        <q-skeleton type="text" class="text-28px" width="370px" />
        <CommentsSKT />
      </section>
    </template>
  </q-page>

  <q-footer
    v-if="$q.screen.lt.md"
    class="bg-dark-page header-blur"
    style="box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1)"
  >
    <q-toolbar class="h-60px w-90% mx-auto justify-between children:mx-1">
      <q-btn
        rounded
        outline
        no-caps
        class="text-#f15a79 min-h-0 h-35px w-15%"
        @click="onClickShare"
      >
        <i-iconamoon-share-1-thin width="1.3em" height="1.3em" />
      </q-btn>

      <q-btn
        rounded
        outline
        no-caps
        class="text-#f15a79 min-h-0 h-35px w-15%"
        :disable="isFollow === undefined"
        @click="
          data &&
            followStore.set(
              {
                image: data.image,
                manga_id: data.manga_id,
                manga_name: data.name,
                manga_param: comic,
                source_id: sourceId,
              },
              (isFollow = !isFollow),
            )
        "
      >
        <i-iconamoon-heart-fill v-if="isFollow" width="1.3em" height="1.3em" />
        <i-iconamoon-heart v-else width="1.3em" height="1.3em" />
      </q-btn>

      <q-btn
        :to="data?.chapters.at(-1)!.route"
        rounded
        no-caps
        no-wrap
        :outline="!!lastEpRead"
        class="text-weight-normal min-h-0 h-35px font-normal max-w-30% w-full"
        :class="{
          'btn-action': !lastEpRead,
          'text-#f15a79': !!lastEpRead,
          'max-w-60%': !lastEpRead,
        }"
      >
        <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

        {{ $t("xem-ch-name", [data?.chapters.at(-1)!.name ?? "__"]) }}
      </q-btn>

      <q-btn
        v-if="lastEpRead"
        :to="{
          name: 'comic chap',
          params: {
            sourceId,
            comic,
            chap: lastEpRead.param,
          },
        }"
        rounded
        no-caps
        no-wrap
        class="btn-action text-weight-normal min-h-0 h-35px font-normal max-w-40% w-full"
      >
        <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

        {{ $t("tiep-ch-name", [lastEpRead.name]) }}
      </q-btn>
    </q-toolbar>
  </q-footer>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.json"
import { useShare } from "@vueuse/core"
// import Like from "src/apis/runs/frontend/regiter-like"
// import Subscribe from "src/apis/runs/frontend/subscribe"w2jk
import { packageName } from "app/package.json"
import type { ID } from "raiku-pgs/plugin"
import dayjs from "src/logic/dayjs"
import type { TaskDDEp, TaskDLEp } from "src/logic/download-manager"
import { formatView } from "src/logic/formatView"

const props = defineProps<{
  sourceId: string
  comic: string
}>()
const $q = useQuasar()
const { share } = useShare()
const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const followStore = useFollowStore()
const historyStore = useHistoryStore()
const IDMStore = useIDMStore()
const pluginStore = usePluginStore()

const GetWithCache = useWithCache(
  () =>
    pluginStore
      .get(props.sourceId)
      .then(({ plugin }) => plugin.getComic(props.comic)),
  computed(() => `${packageName}:///manga/${props.comic}`),
)

const { data, runAsync, error, run } = useRequest(GetWithCache, {
  refreshDeps: [() => props.comic],
  refreshDepsAction() {
    // data.value = undefined
    run()
  },
})
watch(error, (error) => {
  if (error?.message === "not_found")
    router.replace({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: "not_found" as any,
      params: {
        catchAll: route.path.split("/").slice(1),
      },
      query: route.query,
      hash: route.hash,
    })
})

const title = () =>
  data.value
    ? i18n.t("title-page-meta-manga", [
        data.value.name,
        data.value.othername ? `(${data.value.othername})` : "",
        data.value.chapters[0].name,
      ])
    : ""
const description = () => data.value?.description
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const lsEpDL = computedAsync<TaskDDEp[] | undefined>(async () => {
  if (!data.value) return

  return shallowReactive(
    (await getListEpisodes(data.value.manga_id).catch(() => [])).map((ref) => ({
      ref,
    })),
  )
})
const lsEpDD = computed<TaskDLEp[] | undefined>(() => {
  if (!data.value) return

  return [...(IDMStore.queue.get(data.value.manga_id)?.values() ?? [])]
})

const mapEp = computed<Map<ID, TaskDDEp | TaskDLEp> | undefined>(() => {
  if (!lsEpDD.value || !lsEpDL.value) return

  return new Map(
    [...(lsEpDL.value ?? []), ...lsEpDD.value]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_id, item]),
  )
})

const isFollow = computedAsync<boolean | undefined>(() => {
  if (!data.value) return

  return followStore.check(data.value.manga_id)
}, undefined)
const lastEpRead = computedAsync(() => {
  if (!data.value) return

  return historyStore.getLastEpRead(data.value.manga_id)
}, undefined)
const listEpRead = computedAsync(() => {
  if (!data.value) return

  return historyStore.getListEpRead(data.value.manga_id)
})

function onClickShare() {
  if (!data.value) return
  share({
    title: i18n.t("doc-name-ch", [
      data.value.name,
      data.value.othername ? `(${data.value.othername})` : "",
    ]),
    text: i18n.t("doc-name-ch", [
      data.value.name,
      data.value.othername ? `(${data.value.othername})` : "",
    ]),
    url: location.href,
  })
}
</script>

<style lang="scss" scoped>
@import "src/modules/before-filter-blur.scss";

.btn-action {
  background: #ff204e;
  box-shadow: 0px 5px 10px rgba(255, 32, 78, 0.3);
}
</style>