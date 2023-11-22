<route lang="yaml">
name: "comic chap"
meta:
  hiddenHeader: true
  hiddenDrawer: true
  hiddenFooter: true
</route>

<template>
  <q-header-custom
    class="bg-#1a191c md:bg-opacity-90 md:bg-#000"
    :model-value="showToolbar"
  >
    <q-toolbar>
      <AppHeaderIconApp
        v-if="!$q.screen.lt.md"
        :no-name="$q.screen.lt.md"
        class="mr-8"
      />
      <q-btn
        v-else-if="APP_STANDALONE"
        round
        unelevated
        class="mr-1"
        @click="router.back()"
      >
        <i-fluent-arrow-left-24-regular class="size-1.5em" />
      </q-btn>

      <q-btn v-else round unelevated :to="data?.path_manga" class="mr-1">
        <i-fluent-text-bullet-list-ltr-24-regular class="size-1.5em" />
      </q-btn>

      <q-space class="<md:!hidden" />

      <div class="flex <md:!display-block items-center min-w-0">
        <div class="ellipsis text-15px">{{ data?.name ?? "__" }}</div>

        <i-iconamoon-arrow-right-2-thin class="mx-1 <md:!hidden" />

        <small
          class="text-gray-300 md:text-14px md:text-white text-12px whitespace-nowrap flex items-center line-clamp-1"
        >
          {{ $t("chuong-name", [currentEpisode?.value.name ?? "__"]) }}

          <template v-if="data && isFlag(data, FLAG_CACHE)">
            &bull; <i-octicon-cache-16 class="ml-1" />
          </template>
        </small>
      </div>

      <q-space />

      <template v-if="!$q.screen.lt.md">
        <AppHeaderSearch />
        <AppHeaderGithub />
      </template>
      <template v-else-if="!APP_STANDALONE">
        <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
          <q-icon name="search" />
        </q-btn>
        <AppHeaderSearchMB v-model:searching="showSearchMB" />
      </template>

      <AppHeaderFollows v-if="$q.screen.gt.xs" />
      <AppHeaderHistory v-if="$q.screen.gt.xs" />
      <!-- <AppHeaderNotify /> -->

      <AppHeaderUser v-if="!APP_STANDALONE" class="mr-2" />

      <BtnDownload
        v-model="statusEPDL"
        :comic="comic"
        :ep-param="chap"
        @action:delete="deleteEp"
        :can-download="!!(data && currentEpisode && pages)"
        @action:download="downloadEp"
      />
    </q-toolbar>
  </q-header-custom>

  <q-page
    :style-fn="
      (offset, height) => {
        return {
          height: height + 'px'
        }
      }
    "
    class="fixed top-0 w-full"
  >
    <!-- reader -->
    <template v-if="data && !loading && pages">
      <ReaderHorizontal
        v-if="!scrollingMode"
        ref="readerHorizontalRef"
        :pages="pages"
        :single-page="singlePage || $q.screen.width <= 517"
        :right-to-left="rightToLeft"
        :min-page="minPage"
        v-model:current-page="currentPage"
        v-model:zoom="zoom"
        :next-episode="nextEpisode?.value.route"
        @click="onClickReader"
      />
      <ReaderVertical
        v-else
        ref="readerVerticalRef"
        :pages="pages"
        v-model:current-page="currentPage"
        v-model:zoom="zoom"
        :next-episode="nextEpisode?.value.route"
        @click="onClickReader"
        @action:next-ch="nextCh"
      />
    </template>
    <ErrorDisplay
      v-else-if="error"
      :error="error"
      :retry-async="runAsync"
      class="pb-150px"
    />
    <div v-else class="w-full h-full flex items-center justify-center">
      <div>
        <SpinnerSakura />
        <p class="mt-1 text-gray-3 text-12px font-family-poppins">Loading...</p>
      </div>
    </div>

    <!-- float absolute button -->
    <FloatingStatus
      v-if="$q.screen.gt.sm"
      :scrolling-mode="scrollingMode"
      :single-page="singlePage || $q.screen.width <= 517"
      :right-to-left="rightToLeft"
      :pages-length="data?.pages.length"
      :size-old-pages="0"
      :sizes="readerHorizontalRef?.sizes"
      :current-page="currentPage"
      :size-page="sizePage"
      :meta-ep="currentEpisode?.value"
    />
    <!-- /float absolute button -->
    <FloatingStatusMobile
      v-else
      :current-page="currentPage"
      :size-page="sizePage"
      :meta-ep="currentEpisode?.value"
      :size-old-pages="0"
    />

    <FabShowToolbar v-if="$q.screen.gt.sm" @click="showToolbar = true" />

    <!-- tutorial reader -->
    <TutorialModeHorizontal
      v-model="showTutorialHorizontal"
      :right-to-left="rightToLeft"
    />
    <!-- /tutorial reader -->
  </q-page>

  <q-footer-custom
    class="bg-#1a191c md:bg-opacity-90 md:bg-#000 font-family-poppins"
    :model-value="showToolbar"
  >
    <q-toolbar class="sm:px-10 md:px-16 <md:flex-wrap">
      <div
        v-if="$q.screen.gt.sm || scrollingMode"
        class="w-120px h-36px rounded-18px border border-[hsla(0,0%,100%,.4)] ml-10px mr-30px flex items-center flex-nowrap justify-between overflow-hidden"
      >
        <button
          class="size-36px relative"
          v-ripple
          @click="zoom -= zoom % 5 || 5"
        >
          <i-iconamoon-sign-minus class="size-1.3em mx-auto" />
        </button>
        <span
          class="display-inline-block w-48px leading-36px text-12px color-[hsla(0,0%,100%,.5)] text-center"
          >{{ $t("val-per", [zoom]) }}</span
        >
        <button
          class="size-36px relative"
          v-ripple
          @click="zoom += 5 - (zoom % 5) || 5"
        >
          <i-iconamoon-sign-plus class="size-1.3em mx-auto" />
        </button>
      </div>

      <span class="display-block text-#777 whitespace-nowrap <md:!hidden"
        >{{ (rightToLeft ? -currentPage : currentPage) + 1 }} /
        {{ sizePage }}</span
      >
      <div class="flex-1 mx-4 flex <md:order-2">
        <q-slider
          class="my-auto"
          :model-value="rightToLeft ? -currentPage : currentPage"
          @update:model-value="currentPage = rightToLeft ? -$event! : $event!"
          markers
          dense
          :reverse="rightToLeft"
          :min="rightToLeft ? maxPage : minPage"
          :max="rightToLeft ? -minPage : maxPage"
          color="main"
        />
      </div>

      <q-btn
        no-caps
        unelevated
        :rounded="!$q.screen.lt.md"
        :round="$q.screen.lt.md"
        :disable="!previousEpisode"
        class="<md:order-1"
        :to="previousEpisode?.value.route"
        :replace="APP_STANDALONE"
      >
        <i-solar-alt-arrow-left-line-duotone
          v-if="$q.screen.lt.md && scrollingMode"
          class="size-1.8em"
        />
        <template v-else>{{ $t("truoc") }}</template>

        <q-tooltip
          anchor="bottom middle"
          self="top middle"
          class="bg-dark text-14px text-weight-medium"
          transition-show="jump-up"
          transition-hide="jump-down"
          >{{
            $t("chuong-truoc-name", [previousEpisode?.value.name])
          }}</q-tooltip
        >
      </q-btn>
      <q-btn
        no-caps
        unelevated
        :rounded="!$q.screen.lt.md"
        :round="$q.screen.lt.md"
        :disable="!nextEpisode"
        class="<md:order-3"
        :to="nextEpisode?.value.route"
        :replace="APP_STANDALONE"
      >
        <i-solar-alt-arrow-right-line-duotone
          v-if="$q.screen.lt.md && scrollingMode"
          class="size-1.8em"
        />
        <template v-else>{{ $t("sau") }}</template>

        <q-tooltip
          anchor="bottom middle"
          self="top middle"
          class="bg-dark text-14px text-weight-medium"
          transition-show="jump-up"
          transition-hide="jump-down"
          >{{ $t("chuong-sau-name", [nextEpisode?.value.name]) }}</q-tooltip
        >
      </q-btn>

      <div class="md:!hidden w-full order-4" />

      <q-btn
        no-caps
        unelevated
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5 md:mx-5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuEpisodes = !showMenuEpisodes"
      >
        <i-solar-document-line-duotone
          v-if="$q.screen.lt.md"
          class="size-1.8em mr-1"
        />
        <span class="<sm:text-10px">{{ $t("chuong") }}</span>

        <q-dialog-menu
          v-model="showMenuEpisodes"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%'
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
          ref="menuEpisodesRef"
        >
          <q-card
            class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">
                {{ $t("danh-sach-chuong") }}
              </div>

              <div v-if="!data || loading" class="py-4 text-center">
                <q-spinner color="sakura3" size="40px" class="mx-auto" />
              </div>
              <ListChapters
                v-else
                :chapters="data.chapters"
                :reads-chapter="new Set(listEpRead?.map((item) => item.ep_id))"
                :map-offline="mapEp"
                :offline="data && isFlag(data, FLAG_OFFLINE)"
                :comic="{
                  data: comicData,
                  manga_id: data?.manga_id,
                  route: {
                    name: 'comic',
                    params: { sourceId, comic }
                  }
                }"
                focus-tab-active
                @change-tab="onChangeTabEpisodes"
                @downloaded="lsEpDL?.push($event)"
                class-item="col-6 col-sm-4 col-md-4"
                class-panels="flex-shrink-1 mt-2 flex column children:min-h-0 children:h-100% children:flex children:flex-col"
                class-panel="h-full overflow-x-hidden overflow-y-scroll scrollbar-custom"
              />
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-separator class="<md:!hidden" />

      <q-btn
        no-caps
        unelevated
        rounded
        no-wrap
        class="<md:order-6 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuSettings = !showMenuSettings"
      >
        <i-solar-settings-line-duotone class="size-1.8em mr-1" />
        <span class="<sm:text-10px">{{ $t("cai-dat") }}</span>

        <q-dialog-menu
          v-model="showMenuSettings"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%'
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
        >
          <q-card
            class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">{{ $t("che-do-doc") }}</div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!scrollingMode"
                  :color="!scrollingMode ? 'sakura3' : undefined"
                  @click="scrollingMode = false"
                >
                  <i-solar-posts-carousel-horizontal-bold-duotone
                    class="size-1.5em mr-1"
                  />
                  {{ $t("vuot-ngang") }}
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="scrollingMode"
                  :color="scrollingMode ? 'sakura3' : undefined"
                  @click="scrollingMode = true"
                >
                  <i-solar-posts-carousel-vertical-bold-duotone
                    class="size-1.5em mr-1"
                  />
                  {{ $t("vuot-doc") }}
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">
                {{ $t("che-do-trang") }}
              </div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!singlePage"
                  :color="!singlePage ? 'sakura3' : undefined"
                  @click="singlePage = false"
                >
                  {{ $t("song-anh") }}
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="singlePage"
                  :color="singlePage ? 'sakura3' : undefined"
                  @click="singlePage = true"
                >
                  {{ $t("don-anh") }}
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">{{ $t("huong-cuon") }}</div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!rightToLeft"
                  :color="!rightToLeft ? 'sakura3' : undefined"
                  @click="rightToLeft = false"
                >
                  {{ $t("trai-sang-phai") }}
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="rightToLeft"
                  :color="rightToLeft ? 'sakura3' : undefined"
                  @click="rightToLeft = true"
                >
                  {{ $t("phai-sang-trai") }}
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">{{ $t("may-chu") }}</div>
              <div>
                <q-btn
                  v-for="({ name }, index) in serversReady"
                  :key="name"
                  :label="name"
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  v-memo="[server === index]"
                  :outline="server === index"
                  :color="server === index ? 'sakura3' : undefined"
                  :disable="data && isFlag(data, FLAG_OFFLINE)"
                  @click="server = index"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-btn
        no-caps
        unelevated
        rounded
        no-wrap
        class="<md:order-7 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuComments = !showMenuComments"
      >
        <i-solar-chat-line-line-duotone class="size-1.8em mr-1" />
        <span class="<sm:text-10px">{{ $t("binh-luan") }}</span>

        <q-dialog-menu
          v-model="showMenuComments"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%'
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
        >
          <q-card
            class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">{{ $t("binh-luan") }}</div>

              <div v-if="!data || loading" class="py-4 text-center">
                <q-spinner color="sakura3" size="40px" class="mx-auto" />
              </div>
              <div
                v-else
                class="h-full min-h-0 !flex-1 overflow-x-hidden overflow-y-scroll scrollbar-custom"
              >
                <Comments :comments="data.comments" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-btn
        no-caps
        unelevated
        rounded
        no-wrap
        class="<md:order-5 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
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
        <i-solar-heart-bold v-if="isFollow" class="size-1.8em mr-1" />
        <i-solar-heart-linear v-else class="size-1.8em mr-1" />

        <span class="<sm:text-10px">{{
          isFollow ? $t("bo-theo-doi") : $t("theo-doi")
        }}</span>
      </q-btn>

      <q-btn
        no-caps
        unelevated
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="toggleFullscreen"
      >
        <i-solar-quit-full-screen-line-duotone
          v-if="isFullscreen"
          class="size-1.8em mr-1"
        />
        <i-solar-full-screen-line-duotone v-else class="size-1.8em mr-1" />
        <span class="<sm:text-10px">{{ $t("phong-to") }}</span>
        <!-- ふふ -->
        <!-- fluent:full-screen-minimize-24-regular -->
      </q-btn>
    </q-toolbar>

    <!-- element is space for <BBarNetwork /> -->
    <div v-if="!networkStore.isOnline" class="text-center h-1.5em" />
  </q-footer-custom>
  <!-- <p class="whitespace-pre-wrap">{{ data }}</p> -->
</template>

<script lang="ts" setup>
import { StatusBar } from "@capacitor/status-bar"
import { useFullscreen } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { packageName } from "app/package.json"
import ReaderHorizontal from "components/truyen-tranh/readers/ReaderHorizontal.vue"
import ReaderVertical from "components/truyen-tranh/readers/ReaderVertical.vue"
import type { QDialog, QMenu } from "quasar"
import type { Chapter, Comic, ComicChapter, ID } from "raiku-pgs/plugin"
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import {
  APP_NATIVE_MOBILE,
  APP_STANDALONE,
  FLAG_CACHE,
  FLAG_OFFLINE
} from "src/constants"
import { PluginError } from "src/errors/plugin"
import type {
  ComicChapterOnDisk,
  TaskDDEp,
  TaskDLEp
} from "src/logic/download-manager"
import { isFlag } from "src/logic/mark-is-flag"

const props = defineProps<{
  sourceId: string
  comic: string
  chap: string
}>()

const $q = useQuasar()
const IDMStore = useIDMStore()
const followStore = useFollowStore()
const historyStore = useHistoryStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
if (APP_NATIVE_MOBILE)
  watch(isFullscreen, (isFullscreen) => {
    if (isFullscreen) void StatusBar.hide()
    else void StatusBar.show()
  })
const pluginStore = usePluginStore()
const networkStore = useNetworkStore()

const api = pluginStore.useApi(toGetter(props, "sourceId"), false)

const showSearchMB = ref(false)
const readerHorizontalRef = ref<InstanceType<typeof ReaderHorizontal>>()
const readerVerticalRef = ref<InstanceType<typeof ReaderVertical>>()
const GetWithCache = useWithCache(
  () =>
    api.value.then((res) =>
      res.getComicChapter(props.comic, props.chap, false)
    ),
  computed(() => `${packageName}:///manga/${props.comic + "/" + props.chap}`)
)

// let disableReactiveParams = false
const { data, runAsync, loading, error } = useRequest<
  | (ComicChapter & {
      readonly chapters: Chapter[]
    })
  | ComicChapterOnDisk
>(
  () => {
    if (networkStore.isOnline) return GetWithCache()
    return getEpisode(props.comic, props.chap).then((res) =>
      markFlag(res, FLAG_OFFLINE)
    )
  },
  {
    refreshDeps: [api, () => props.comic, () => props.chap],
    async refreshDepsAction() {
      if (route.query.no_restore_scroll) return

      await runAsync()
      currentPage.value = 0
      readerVerticalRef.value?.reset()
    }
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
let $idComicDataCache: string | null = null
let $comicDataCache: (() => Promise<Comic>) | null = null
const comicData = computed<() => Promise<Comic>>(() => {
  const id = `${props.sourceId}/${props.comic}`
  if (id === $idComicDataCache) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return $comicDataCache!
  }

  $idComicDataCache = id
  const { comic } = props

  return ($comicDataCache = () => api.value.then((res) => res.getComic(comic)))
})

const title = () =>
  data.value
    ? i18n.t("name-chuong-ep-name", [
        data.value.name,
        data.value.chapters[0]?.name ?? ""
      ])
    : ""
const description = title
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const statusEPDL = computedAsync<TaskDDEp | TaskDLEp | null | undefined>(
  async () => {
    if (!data.value) return

    const task = IDMStore.queue.get(props.comic)?.get(props.chap)
    if (task) return task

    const onDisk = await getEpisode(props.comic, props.chap).catch(() => null)

    if (onDisk) return { ref: onDisk }
    return null
  },
  undefined,
  {
    onError: WARN
  }
)
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

  return Array.from(IDMStore.queue.get(props.comic)?.values() ?? [])
})

const mapEp = computed<Map<ID, TaskDDEp | TaskDLEp> | undefined>(() => {
  if (!lsEpDD.value || !lsEpDL.value) return

  return new Map(
    [...(lsEpDL.value ?? []), ...lsEpDD.value]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_param, item])
  )
})

async function downloadEp() {
  if (!data.value || !currentEpisode.value || !pages.value) return

  const meta = await IDMStore.download(
    {
      name: "comic",
      params: {
        sourceId: props.sourceId,
        comic: props.comic
      }
    },
    await comicData.value(),
    data.value,
    currentEpisode.value.value.name,
    currentEpisode.value.value.route.params.chap,
    await Promise.all(pages.value.slice(0))
  ).catch((err) => {
    if (err?.message === "user_paused") return
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  })

  console.log(lsEpDL, meta)
  if (meta && !isTaskDLEp(meta)) {
    lsEpDL.value?.splice(
      lsEpDL.value.findIndex(
        (item) => item.ref.ep_param === meta.ref.ep_param
      ) >>> 0,
      1,
      meta
    )
    lsEpDL.value = [...(lsEpDL.value || [])]
  }
}
function deleteEp(epParam: string) {
  lsEpDL.value?.splice(
    lsEpDL.value.findIndex((item) => item.ref.ep_param === epParam) >>> 0,
    1
  )
  lsEpDL.value = [...(lsEpDL.value || [])]
}

const isFollow = computedAsync<boolean | undefined>(
  () => {
    if (!data.value) return

    return followStore.check(data.value.manga_id)
  },
  undefined,
  {
    onError: WARN
  }
)
const lastEpRead = computedAsync(
  () => {
    if (!data.value) return

    return historyStore.getLastEpRead(data.value.manga_id)
  },
  undefined,
  {
    onError: WARN
  }
)
const listEpRead = computedAsync(
  () => {
    if (!data.value) return

    return historyStore.getListEpRead(data.value.manga_id)
  },
  undefined,
  {
    onError: WARN
  }
)

const zoom = useClamp(100, 50, 200)
const server = ref(0)
const serversReady = computedAsync(
  async () => {
    if (data.value && data.value.pages[0])
      return (await api.value)["servers:has"](toRaw(data.value))
  },
  undefined,
  {
    onError(err) {
      if (err instanceof PluginError) {
        error.value = err as PluginError
        return
      }

      WARN(err)
    }
  }
)
// eslint-disable-next-line no-void
watch(serversReady, () => void (server.value = 0))
const pages = computedAsync(
  async () => {
    if (!data.value) return
    if (isFlag(data.value, FLAG_OFFLINE))
      return (data.value as ComicChapterOnDisk).pages_offline

    const s = server.value
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await api.value)["servers:parse"](s, toRaw(data.value!))
  },
  undefined,
  {
    onError: WARN
  }
)

const singlePage = ref(false)
const rightToLeft = ref(false)
const scrollingMode = ref(true)

const sizePage = computed(
  () => readerHorizontalRef.value?.sizePage ?? pages.value?.length ?? 0
)
const minPage = computed(() => (rightToLeft.value ? -(sizePage.value - 1) : 0))
const maxPage = computed(() => (rightToLeft.value ? 0 : sizePage.value - 1))
const currentPage = useClamp(0, minPage, maxPage)

const showToolbar = ref(true)

const showTutorialHorizontal = ref(false)
watch(scrollingMode, (scrollingMode) => {
  showTutorialHorizontal.value = !scrollingMode
})

function onClickReader() {
  if ($q.screen.gt.xs) {
    showToolbar.value = false
  } else {
    showToolbar.value = !showToolbar.value
  }
}

// TODO: calculate previous episode and next episode
const currentEpisode = computed(() => {
  let index = -1
  const value = data.value?.chapters.find((item, i) => {
    if (
      item.route.params.comic === route.params.comic &&
      item.route.params.chap === route.params.chap
    ) {
      index = i
      return true
    }

    return false
  })

  if (!value) return

  return { index, value } as const
})
const previousEpisode = computed(() => {
  const current = currentEpisode.value
  if (!current) return

  const index = current.index + 1
  const value = data.value?.chapters[index]

  if (!value) return

  return { index, value } as const
})
const nextEpisode = computed(() => {
  const current = currentEpisode.value
  if (!current) return

  const index = current.index - 1
  const value = data.value?.chapters[index]

  if (!value) return

  return { index, value } as const
})

const showMenuEpisodes = ref(false)
const showMenuSettings = ref(false)
const showMenuComments = ref(false)

const menuEpisodesRef = ref<QMenu | QDialog>()
function onChangeTabEpisodes() {
  setTimeout(() => (menuEpisodesRef.value as QMenu)?.updatePosition?.(), 70)
}

// const fnNextCh = useWithCache(
//   async () => {
//     const { mangaId, epId } = (
//       await pluginStore.get(props.sourceId)
//     ).plugin.resolveUrlComicChapter(nextEpisode.value!.path)
//     return await (
//       await pluginStore.get(props.sourceId)
//     ).plugin.getComicChapter(mangaId, epId, false)
//   },
//   computed(() => `${packageName}:///manga/${nextEpisode.value!.path}`),
// )
async function nextCh() {
  //   console.log("start load next ch")
  //   const next = await fnNextCh()
  //   data.value = {
  //     ...next,
  //     sizeOldPages: data.value?.pages.length,
  //     pages: [
  //       ...(data.value?.pages ?? []),
  //       { $l: currentEpisode.value.value, $r: nextEpisode.value.value },
  //       ...next.pages,
  //     ],
  //   }
  //   router.push({
  //     path: nextEpisode.value!.value.path,
  //     query: {
  //       no_restore_scroll: "1",
  //     },
  //   })
  //   console.log("data next", next)
}
// async function actionCh(data: {
//   $l: {
//     id: number
//     name: string
//     path: string
//     updated_at: null
//   }
//   $r: {
//     id: number
//     name: string
//     path: string
//     updated_at: null
//   }
// }) {
//   console.log("show ", data)

//   // router.push({
//   //   path: data.$l.path,
//   //   query: {
//   //     no_restore_scroll: "1",
//   //   },
//   // })
// }

// save to history
let timeoutUpsertHistory: NodeJS.Timeout | number | null = null
watch(
  [() => props.comic, () => props.chap, data],
  ([comic, chap, data]) => {
    if (timeoutUpsertHistory) clearTimeout(timeoutUpsertHistory)

    const ep = currentEpisode.value?.value
    if (!data || !ep) return
    const { sourceId } = props

    timeoutUpsertHistory = setTimeout(() => {
      void historyStore.upsert({
        image: data.image,
        last_ch_id: ep.id,
        last_ch_name: ep.name,
        last_ch_param: chap,
        manga_id: data.manga_id,
        manga_name: data.name,
        manga_param: comic,
        source_id: sourceId
      })
      timeoutUpsertHistory = null
    }, 1_000)
  },
  { immediate: true }
)
</script>

<!-- <swiper
      :spaceBetween="0"
        :slides-per-view="1"
      class="h-full"
    >
      <swiper-slide
        v-for="(_, index) in Math.ceil((data.pages.length ) / 2)"
        :key="index"
      >
      <div class="w-full h-full flex items-center justify-center">

      <div class="w-1/2 h-full">
        {{sizes}} 1200
        <img class="object-scale-down h-full" :class="{
          'ml-auto': true
        }" :src="data.pages[index*2]?.src"
        @load="$event => {
          sizes[ index * 2 ] = [$event.target.naturalWidth, $event.target.naturalHeight]
        }"
        />
      </div>
      <div class="w-1/2 h-full">

        <img class="object-scale-down h-full" :src="data.pages[index*2 + 1]?.src"
        @load="$event => {
          sizes[ index * 2 + 1 ] = [$event.target.naturalWidth, $event.target.naturalHeight]
        }"
        />
      </div>
      </div>
      </swiper-slide>
  </swiper> -->
