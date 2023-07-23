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
      <router-link to="/" class="flex flex-nowrap items-end mr-8">
        <img src="~assets/app_icon.svg" width="35" height="35" />
        <span style="font-family: Caveat" class="text-[25px] text-main"
          >Manga Raiku</span
        >
      </router-link>
      <q-space />

      <div class="ellipsis">{{ data?.name }}</div>
      <Icon icon="fluent:chevron-right-24-regular" class="mx-1" />
      {{ currentEpisode?.value.name }}

      <q-space />

      <AppHeaderSearch />

      <AppHeaderGithub />
      <AppHeaderFollows />
      <AppHeaderHistory />
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
        class="w-120px h-36px rounded-18px border border-[hsla(0,0%,100%,.4)] ml-10px mr-30px flex items-center flex-nowrap justify-between overflow-hidden <md:display-none"
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
          >Chương trước: {{ previousEpisode?.value.name }}</q-tooltip
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
          >Chương sau: {{ nextEpisode?.value.name }}</q-tooltip
        >
      </q-btn>

      <div class="md:display-none w-full order-4" />

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5 md:mx-5"
        :stack="$q.screen.lt.md"
      >
        <Icon
          v-if="$q.screen.lt.md"
          icon="system-uicons:document-list"
          class="size-1.8em mr-1"
        />
        Episodes

        <q-menu
          anchor="top middle"
          self="bottom middle"
          class="rounded-xl overflow-visible flex column flex-nowrap"
          :offset="[0, 10]"
          max-width="560px"
          max-height="80%"
        >
          <q-card class="h-full min-w-310px flex column min-h-0">
            <q-card-section
              class="h-full flex column flex-nowrap min-h-0 children:flex-shrink-0"
            >
              <div class="text-subtitle1 mb-1">Episodes</div>

              <div v-if="!data" class="py-4 text-center">
                <q-spinner color="main-3" />
              </div>
              <ListChapters
                v-else
                :chapters="data.chapters"
                focus-tab-active
                class-item="col-6 col-sm-4 col-md-4"
                class-panels="flex-shrink-1 mt-2 flex column children:min-h-0 children:h-100% children:flex children:flex-col"
                class-panel="h-full overflow-x-hidden overflow-y-scroll scrollbar-custom"
              />
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>

      <q-separator class="<md:display-none" />

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-6 <md:w-1/5"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="ri:settings-line" class="size-1.8em mr-1" /> Settings

        <q-menu
          anchor="top middle"
          self="bottom middle"
          class="rounded-xl"
          :offset="[0, 10]"
        >
          <q-card>
            <q-card-section>
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
        </q-menu>
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-7 <md:w-1/5"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="system-uicons:message" class="size-1.8em mr-1" />
        Comments
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-5 <md:w-1/5"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="fluent:star-add-24-regular" class="size-1.8em mr-1" />
        Favorite
        <!-- fluent:star-checkmark-24-filled -->
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-8 <md:w-1/5"
        :stack="$q.screen.lt.md"
        @click="toggle"
      >
        <Icon
          :icon="
            isFullscreen
              ? 'fluent:full-screen-minimize-24-regular'
              : 'fluent:full-screen-maximize-24-regular'
          "
          class="size-1.8em mr-1"
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
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import { SERVERS } from "src/apis/parsers/truyen-tranh/[slug]-chap-[chap]"
import SlugChapChap from "src/apis/runs/truyen-tranh/[slug]-chap-[chap]"

const props = defineProps<{
  slug: string
  chap: string
}>()

const $q = useQuasar()
const readerHorizontalRef = ref<InstanceType<typeof ReaderHorizontal>>()
const route = useRoute()
const router = useRouter()
const { isFullscreen, toggle } = useFullscreen()
const { data, loading, runAsync, error } = useRequest(
  () => SlugChapChap(props.slug + "-chap-" + props.chap),
  {
    refreshDeps: [() => props.slug, () => props.chap],
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
  SERVERS.filter((item) => !data.value || item.has(data.value.pages[0]))
)
// eslint-disable-next-line no-void
watch(serversReady, () => void (server.value = 0))
const pageGetter = computed(
  () =>
    serversReady.value.find(
      (item) => item.name === serversReady.value[server.value].name
    )?.get
)
const pages = computed(
  () =>
    data.value?.pages.map((item) => pageGetter.value?.(item) ?? item.src) as
      | string[]
      | undefined
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

  const index = current.index - 1
  const value = data.value?.chapters[index]

  if (!value) return

  return { index, value } as const
})
const nextEpisode = computed(() => {
  const current = currentEpisode.value
  if (!current) return

  const index = current.index + 1
  const value = data.value?.chapters[index]

  if (!value) return

  return { index, value } as const
})
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
