<route lang="yaml">
meta:
  hiddenHeader: true
  offset: true
  existsFooter: true
  absolute: true
</route>

<template>
  <q-header class="bg-[rgba(0,0,0,.9)]" :model-value="showToolbar">
    <q-toolbar>
      <AppHeaderIconApp
        v-if="$q.screen.sm || $q.screen.gt.sm"
        :no-name="$q.screen.lt.md"
        class="mr-8"
      />
      <!-- <q-btn v-else round unelevated class="mr-1" @click="router.back()">
          <Icon icon="fluent:arrow-left-24-regular" class="size-1.5em" />
        </q-btn> -->

      <q-btn v-else round unelevated :to="data?.manga" class="mr-1">
        <Icon
          icon="fluent:text-bullet-list-ltr-24-regular"
          class="size-1.5em"
        />
      </q-btn>

      <q-space class="<md:display-none" />

      <div class="flex <md:!display-block items-center min-w-0">
        <div class="ellipsis text-15px">{{ data?.name }}</div>

        <Icon
          icon="fluent:chevron-right-24-regular"
          class="mx-1 <md:display-none"
        />

        <small
          class="text-gray-300 md:text-14px md:text-white text-12px whitespace-nowrap"
          >Chương {{ currentEpisode?.value.name }}</small
        >
      </div>

      <q-space />

      <template v-if="$q.screen.md || $q.screen.gt.md">
        <AppHeaderSearch />
        <AppHeaderGithub />
      </template>
      <template v-else>
        <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
          <q-icon name="search" />
        </q-btn>
        <AppHeaderSearchMB v-model:searching="showSearchMB" />
      </template>

      <AppHeaderFollows v-if="$q.screen.sm || $q.screen.gt.sm" />
      <AppHeaderHistory v-if="$q.screen.sm || $q.screen.gt.sm" />
      <AppHeaderNotify />

      <AppHeaderUser />
    </q-toolbar>
  </q-header>

  <!-- reader -->
  <template v-if="pages && !loading">
    <ReaderHorizontal
      v-if="!scrollingMode"
      ref="readerHorizontalRef"
      :pages="pages"
      :single-page="singlePage || $q.screen.width <= 517"
      :right-to-left="rightToLeft"
      :min-page="minPage"
      v-model:current-page="currentPage"
      v-model:zoom="zoom"
      @click="onClickReader"
    />
    <ReaderVertical
      v-else
      :pages="pages"
      v-model:current-page="currentPage"
      v-model:zoom="zoom"
      @click="onClickReader"
    />
  </template>
  <div v-else class="w-full h-full flex items-center justify-center">
    <div>
      <SpinnerSakura />
      <p class="mt-1 text-gray-3 text-12px font-family-poppins">Loading...</p>
    </div>
  </div>

  <!-- float absolute button -->
  <FloatingStatus
    v-if="$q.screen.gt.xs"
    :scrolling-mode="scrollingMode"
    :single-page="singlePage || $q.screen.width <= 517"
    :right-to-left="rightToLeft"
    :pages-length="data?.pages.length"
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
  />

  <FabShowToolbar v-if="$q.screen.gt.xs" @click="showToolbar = true" />

  <!-- tutorial reader -->
  <TutorialModeHorizontal
    v-model="showTutorialHorizontal"
    :right-to-left="rightToLeft"
  />
  <!-- /tutorial reader -->

  <q-footer
    class="bg-[rgba(0,0,0,0.9)] font-family-poppins"
    :model-value="showToolbar"
  >
    <q-toolbar class="sm:px-10 md:px-16 <md:flex-wrap">
      <div
        v-if="$q.screen.gt.sm || scrollingMode"
        class="w-120px h-36px rounded-18px border border-[hsla(0,0%,100%,.4)] ml-10px mr-30px flex items-center flex-nowrap justify-between overflow-hidden"
      >
        <button class="size-36px relative" v-ripple @click="zoom -= 5">
          <Icon icon="fluent:subtract-24-filled" class="size-1.3em mx-auto" />
        </button>
        <span
          class="display-inline-block w-48px leading-36px text-12px color-[hsla(0,0%,100%,.5)] text-center"
          >{{ zoom }}%</span
        >
        <button class="size-36px relative" v-ripple @click="zoom += 5">
          <Icon icon="fluent:add-24-filled" class="size-1.3em mx-auto" />
        </button>
      </div>

      <span class="display-block text-#777 whitespace-nowrap <md:display-none"
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
        :rounded="!$q.screen.lt.md"
        :round="$q.screen.lt.md"
        :disable="!previousEpisode"
        class="<md:order-1"
        :to="previousEpisode?.value.path"
      >
        <Icon
          v-if="$q.screen.lt.md && scrollingMode"
          icon="ep:arrow-left-bold"
          class="size-1.8em"
        />
        <template v-else>Previous</template>

        <q-tooltip
          anchor="bottom middle"
          self="top middle"
          class="bg-dark text-14px text-weight-medium"
          transition-show="jump-up"
          transition-hide="jump-down"
          >Chương trước: Chương {{ previousEpisode?.value.name }}</q-tooltip
        >
      </q-btn>
      <q-btn
        no-caps
        :rounded="!$q.screen.lt.md"
        :round="$q.screen.lt.md"
        :disable="!nextEpisode"
        class="<md:order-3"
        :to="nextEpisode?.value.path"
      >
        <Icon
          v-if="$q.screen.lt.md && scrollingMode"
          icon="ep:arrow-right-bold"
          class="size-1.8em"
        />
        <template v-else>Next</template>

        <q-tooltip
          anchor="bottom middle"
          self="top middle"
          class="bg-dark text-14px text-weight-medium"
          transition-show="jump-up"
          transition-hide="jump-down"
          >Chương sau: Chương {{ nextEpisode?.value.name }}</q-tooltip
        >
      </q-btn>

      <div class="md:display-none w-full order-4" />

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5 md:mx-5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuEpisodes = !showMenuEpisodes"
      >
        <Icon
          v-if="$q.screen.lt.md"
          icon="system-uicons:document-list"
          class="size-1.8rem mr-1"
        />
        Episodes

        <q-dialog-menu
          v-model="showMenuEpisodes"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%',
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true,
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
          ref="menuEpisodesRef"
        >
          <q-card
            class="h-full <md:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">Episodes</div>

              <div v-if="!data" class="py-4 text-center">
                <q-spinner color="main-3" size="40px" class="mx-auto" />
              </div>
              <ListChapters
                v-else
                :chapters="data.chapters"
                focus-tab-active
                @change-tab="onChangeTabEpisodes"
                class-item="col-6 col-sm-4 col-md-4"
                class-panels="flex-shrink-1 mt-2 flex column children:min-h-0 children:h-100% children:flex children:flex-col"
                class-panel="h-full overflow-x-hidden overflow-y-scroll scrollbar-custom"
              />
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-separator class="<md:display-none" />

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-6 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuSettings = !showMenuSettings"
      >
        <Icon icon="ri:settings-line" class="size-1.8rem mr-1" /> Settings

        <q-dialog-menu
          v-model="showMenuSettings"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%',
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true,
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
        >
          <q-card
            class="h-full <md:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">Reader mode</div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!scrollingMode"
                  :color="!scrollingMode ? 'main-3' : undefined"
                  @click="scrollingMode = false"
                >
                  <Icon
                    icon="solar:posts-carousel-horizontal-bold-duotone"
                    class="size-1.5em mr-1"
                  />
                  Flipping
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="scrollingMode"
                  :color="scrollingMode ? 'main-3' : undefined"
                  @click="scrollingMode = true"
                >
                  <Icon
                    icon="solar:posts-carousel-vertical-bold-duotone"
                    class="size-1.5em mr-1"
                  />
                  Scrolling
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">Page mode</div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!singlePage"
                  :color="!singlePage ? 'main-3' : undefined"
                  @click="singlePage = false"
                >
                  Double image
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="singlePage"
                  :color="singlePage ? 'main-3' : undefined"
                  @click="singlePage = true"
                >
                  Single image
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">Flip Direction</div>
              <div>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="!rightToLeft"
                  :color="!rightToLeft ? 'main-3' : undefined"
                  @click="rightToLeft = false"
                >
                  Left to right
                </q-btn>
                <q-btn
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  :outline="rightToLeft"
                  :color="rightToLeft ? 'main-3' : undefined"
                  @click="rightToLeft = true"
                >
                  Right to left
                </q-btn>
              </div>

              <div class="text-subtitle1 mt-4 mb-1">Server</div>
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
                  :color="server === index ? 'main-3' : undefined"
                  @click="server = index"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-7 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="showMenuComments = !showMenuComments"
      >
        <Icon icon="system-uicons:message" class="size-1.8rem mr-1" />
        Comments

        <q-dialog-menu
          v-model="showMenuComments"
          :use-menu="$q.screen.gt.sm"
          :menu-props="{
            anchor: 'top middle',
            self: 'bottom middle',
            offset: [0, 10],
            maxWidth: '560px',
            maxHeight: '80%',
          }"
          :dialog-props="{
            position: 'bottom',
            fullWidth: true,
          }"
          class="rounded-xl overflow-visible flex column flex-nowrap <md:children:!px-0"
        >
          <q-card
            class="h-full <md:!max-h-70vh min-w-310px flex column min-h-0 rounded-xl"
          >
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0 max-w-full"
            >
              <div class="text-subtitle1 mb-1">Comments</div>

              <div v-if="!data" class="py-4 text-center">
                <q-spinner color="main-3" size="40px" class="mx-auto" />
              </div>
              <div
                v-else
                class="h-full flex-1 overflow-x-hidden overflow-y-scroll scrollbar-custom"
              >
                <Comments :comments="data.comments" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog-menu>
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-5 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="fluent:star-add-24-regular" class="size-1.8rem mr-1" />
        Favorite
        <!-- fluent:star-checkmark-24-filled -->
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5 <sm:text-12px"
        :stack="$q.screen.lt.md"
        @click="toggle"
      >
        <Icon
          :icon="
            isFullscreen
              ? 'fluent:full-screen-minimize-24-regular'
              : 'fluent:full-screen-maximize-24-regular'
          "
          class="size-1.8rem mr-1"
        />
        Fullscreen
        <!-- ふふ -->
        <!-- fluent:full-screen-minimize-24-regular -->
      </q-btn>
    </q-toolbar>
  </q-footer>
  <!-- <p class="whitespace-pre-wrap">{{ data }}</p> -->
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useFullscreen } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import ReaderHorizontal from "components/truyen-tranh/readers/ReaderHorizontal.vue"
import type { QDialog, QMenu } from "quasar"
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import { SERVERS } from "src/apis/nettruyen/parsers/truyen-tranh/[slug]/[ep-id]"
import SlugChapChap from "src/apis/nettruyen/runs/truyen-tranh/[slug]-chap-[chap]"

const props = defineProps<{
  zlug: string
  epName: string
  epId: string
}>()

const $q = useQuasar()
const showSearchMB = ref(false)
const readerHorizontalRef = ref<InstanceType<typeof ReaderHorizontal>>()
const route = useRoute()
const router = useRouter()
const { isFullscreen, toggle } = useFullscreen()
const { data, loading, runAsync, error } = useRequest(
  () => SlugChapChap(props.zlug + "/" + props.epName + "/" + props.epId, false),
  {
    refreshDeps: [() => props.zlug, () => props.epName, () => props.epId],
    refreshDepsAction() {
      runAsync()
    },
  }
)
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
const zoom = useClamp(100, 50, 200)
const server = ref(0)
const serversReady = computed(() =>
  SERVERS.filter(
    (item) => !data.value || item.has(data.value.pages[0], data.value)
  )
)
// eslint-disable-next-line no-void
watch(serversReady, () => void (server.value = 0))
const pageGetter = computed(
  () =>
    serversReady.value.find(
      (item) => item.name === serversReady.value[server.value].name
    )?.parse
)
const pages = computed(
  () =>
    data.value?.pages.map(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (item) => pageGetter.value?.(item, data.value!) ?? item.src
    ) as string[] | undefined
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
    if (pathEqual(item.path, route.path)) {
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
