<route lang="yaml">
name: comic
meta:
  hiddenFooter: true
  hiddenDrawer: true
  hiddenHeader: $lt.md
</route>

<template>
  <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page header-blur">
    <q-toolbar>
      <q-btn round unelevated @click="router.back()">
        <i-fluent-arrow-left-24-filled class="size-1.5em" />
      </q-btn>

      <div class="ellipsis text-16px text-weight-medium">{{ data?.name }}</div>

      <q-space />

      <q-btn round unelevated @click="stateStore.showProxyManagerDialog = true">
        <component :is="Icons.vpn[0]" />
      </q-btn>
      <q-btn
        round
        unelevated
        @click="stateStore.showPluginManagerDialog = true"
      >
        <component :is="Icons.mingcute[0]" />
      </q-btn>
    </q-toolbar>
  </q-header-custom>
  <q-page padding class="pb-60px">
    <div
      v-if="$q.screen.lt.md"
      class="fixed top-0 left-0 w-full h-full z--1"
      :class="{
        'before-filter-blur': image
      }"
      :style="{
        '--data-src': `url('${image}')`
      }"
    />
    <template v-if="data && !loading">
      <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 mb-4 flex">
        <div>
          <div
            class="before-filter-blur before-filter-blur--no-after relative py-4 flex items-center justify-center"
            :style="{
              '--data-src': `url('${image}')`
            }"
          >
            <q-img
              :src="image"
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
          <small class="flex items-center text-14px text-gray-400 my-2"
            >{{
              $t("val-luot-xem", [data.views ? formatView(data.views) : "N/A"])
            }}
            <template v-if="isFlag(data, FLAG_CACHE)">
              &bull; <i-octicon-cache-16 class="ml-1" />
            </template>
          </small>

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

            <div v-if="data.rate.max" class="flex <md:w-full items-center">
              <i-iconamoon-like-duotone
                class="text-yellow w-1.2em h-1.2em mr-1"
              />
              {{
                $t("val-slash-max-count-rate", [
                  data.rate.cur,
                  data.rate.max,
                  formatView(data.rate.count)
                ])
              }}
            </div>

            <q-separator
              v-if="data.rate.max"
              vertical
              class="mx-3 h-12px my-auto <md:!hidden"
            />

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
              chap: lastEpRead.param
            }
          }"
          rounded
          no-caps
          class="mr-3 text-weight-normal text-15px bg-#fff bg-opacity-10"
        >
          <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

          <div class="truncate">
            {{ $t("tiep-ch-name", [lastEpRead.name ?? "__"]) }}
          </div>
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
                  source_id: sourceId
                },
                (isFollow = !isFollow)
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
          :map-ep-read="mapEpRead"
          :map-offline="mapEp"
          :offline="data && isFlag(data, FLAG_OFFLINE)"
          :comic="{
            data,
            manga_id: data.manga_id,
            route: {
              name: 'comic',
              params: { sourceId, comic }
            }
          }"
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
              '--data-src': `url()`
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

  <q-footer-custom
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
                source_id: sourceId
              },
              (isFollow = !isFollow)
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
          'max-w-60%': !lastEpRead
        }"
      >
        <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

        <div class="truncate">
          {{ $t("xem-ch-name", [data?.chapters.at(-1)!.name ?? "__"]) }}
        </div>
      </q-btn>

      <q-btn
        v-if="lastEpRead"
        :to="{
          name: 'comic chap',
          params: {
            sourceId,
            comic,
            chap: lastEpRead.param
          }
        }"
        rounded
        no-caps
        no-wrap
        class="btn-action text-weight-normal min-h-0 h-35px font-normal max-w-40% w-full"
      >
        <i-ion-book-outline width="1.3em" height="1.3em" class="mr-2" />

        <div class="truncate">
          {{ $t("tiep-ch-name", [lastEpRead.name]) }}
        </div>
      </q-btn>
    </q-toolbar>

    <!-- element is space for <BBarNetwork /> -->
    <div v-if="!networkStore.isOnline" class="text-center h-1.5em" />
  </q-footer-custom>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.json"
import { useShare } from "@vueuse/core"
// import Like from "src/apis/runs/frontend/regiter-like"
// import Subscribe from "src/apis/runs/frontend/subscribe"w2jk
import { packageName } from "app/package.json"
import type { ID } from "raiku-pgs/plugin"
import { Icons } from "src/Icons"
import { FLAG_CACHE, FLAG_OFFLINE } from "src/constants"
import dayjs from "src/logic/dayjs"
import type {
  ComicOnDisk,
  TaskDDEp,
  TaskDLEp
} from "src/logic/download-manager"
import { formatView } from "src/logic/formatView"
import { isFlag } from "src/logic/mark-is-flag"

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
const stateStore = useStateStore()
const networkStore = useNetworkStore()

const api = pluginStore.useApi(toGetter(props, "sourceId"), false)

const fetchComic = useWithCache(
  () =>
    api.value.then(async (plugin) =>
      assign(await plugin.getComic(props.comic), { sourceId: props.sourceId })
    ),
  computed(() => `${packageName}:///manga/${props.comic}`)
)

const { data, runAsync, error, loading } = useRequest<
  | Awaited<ReturnType<typeof fetchComic>>
  | (ComicOnDisk & { readonly sourceId: string })
>(
  () => {
    if (networkStore.isOnline) return fetchComic()
    return getComic(props.comic)
      .then((res) => markFlag(res, FLAG_OFFLINE))
      .then((res) =>
        assign(res, { sourceId: res.route.params.sourceId } as const)
      )
  },
  {
    refreshDeps: [api, () => props.comic]
  }
)
watch(error, (error) => {
  if (error?.message === "not_found")
    void router.replace({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: "not_found" as any,
      params: {
        catchAll: route.path.split("/").slice(1)
      },
      query: route.query,
      hash: route.hash
    })
})

const image = computedAsync(
  () => {
    if (data.value) return fastProcessImage(data.value.image)
  },
  undefined,
  {
    onError: WARN
  }
)

const title = () =>
  data.value
    ? i18n.t("title-page-meta-manga", [
        data.value.name,
        data.value.othername ? `(${data.value.othername})` : "",
        data.value.chapters[0].name
      ])
    : ""
const description = () => data.value?.description
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: image
})

const lsEpDL = computedAsync<TaskDDEp[] | undefined>(async () => {
  if (!data.value) return

  return shallowReactive(
    (await getListEpisodes(props.comic).catch(() => [])).map((ref) => ({
      ref
    }))
  )
})
const lsEpDD = computed<TaskDLEp[] | undefined>(() => {
  if (!data.value) return

  return [...(IDMStore.queue.get(props.comic)?.values() ?? [])]
})

const mapEp = computed<Map<ID, TaskDDEp | TaskDLEp> | undefined>(() => {
  if (!lsEpDD.value || !lsEpDL.value) return

  return new Map(
    [...(lsEpDL.value ?? []), ...lsEpDD.value]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_param, item])
  )
})

const isFollow = computedAsync<boolean | undefined>(() => {
  if (!data.value) return

  return followStore.check(data.value.manga_id)
}, undefined)
const lastEpRead = computedAsync(() => {
  if (!data.value) return

  return historyStore.getLastEpRead(data.value.manga_id, data.value.sourceId)
}, undefined)
const mapEpRead = computedAsync(() => {
  if (!data.value) return

  return historyStore.getMapEpRead(data.value.manga_id, data.value.sourceId)
})

function onClickShare() {
  if (!data.value) return
  void share({
    title: i18n.t("doc-name-ch", [
      data.value.name,
      data.value.othername ? `(${data.value.othername})` : ""
    ]),
    text: i18n.t("doc-name-ch", [
      data.value.name,
      data.value.othername ? `(${data.value.othername})` : ""
    ]),
    url: location.href
  })
}
</script>

<style lang="scss" scoped>
.before-filter-blur {
  &:before {
    content: "";
    @apply absolute top-0 left-0 w-full h-full;
    background: {
      image: var(--data-src);
      size: cover;
    }
    @supports not (backdrop-filter: blur(0px)) {
      filter: blur(123px); //62px
    }
    z-index: -2;
  }
  &--no-after:before {
    filter: blur(123px); //62px
  }
  &:after {
    content: "";
    @apply absolute top-0 left-0 w-full h-full;
    background-color: rgba(0, 0, 0, 0.67);
    backdrop-filter: blur(12px);
    z-index: -1;
    @supports not (backdrop-filter: blur(0px)) {
      display: none;
    }
  }
  &--no-after:after {
    display: none;
  }
}

.btn-action {
  background: #ff204e;
  box-shadow: 0px 5px 10px rgba(255, 32, 78, 0.3);
}
</style>
