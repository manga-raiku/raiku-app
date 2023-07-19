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
      <q-space />
      {{ data.name }}
      <q-space />
    </q-toolbar>
  </q-header>

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

  <!-- float absolute button -->
  <FloatingStatus
    v-if="$q.screen.gt.xs"
    :scrolling-mode="scrollingMode"
    :single-page="singlePage || $q.screen.width <= 517"
    :right-to-left="rightToLeft"
    :pages-length="data.pages.length"
    :sizes="readerHorizontalRef?.sizes"
    :current-page="currentPage"
    :size-page="sizePage"
    :meta-ep="metaEp"
  />
  <!-- /float absolute button -->
  <FloatingStatusMobile
    v-else
    :current-page="currentPage"
    :size-page="sizePage"
    :meta-ep="metaEp"
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
        class="<md:order-1"
      >
        <Icon
          v-if="$q.screen.lt.md && scrollingMode"
          icon="ep:arrow-left-bold"
          class="size-1.8em"
        />
        <template v-else>Previous</template>
      </q-btn>
      <q-btn
        no-caps
        :rounded="!$q.screen.lt.md"
        :round="$q.screen.lt.md"
        class="<md:order-3"
      >
        <Icon
          v-if="$q.screen.lt.md && scrollingMode"
          icon="ep:arrow-right-bold"
          class="size-1.8em"
        />
        <template v-else>Next</template>
      </q-btn>

      <div class="md:display-none w-full order-4" />

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-8 <md:w-25% md:mx-5"
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

              <ListChapters
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
        class="<md:order-6 <md:w-25%"
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
                  v-for="{ name } in SERVERS.filter((item) =>
                    item.has(data.pages[0])
                  )"
                  :key="name"
                  :label="name"
                  unelevated
                  rounded
                  class="mx-2"
                  no-caps
                  v-memo="[server === name]"
                  :outline="server === name"
                  :color="server === name ? 'main-3' : undefined"
                  @click="server = name"
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
        class="<md:order-7 <md:w-25%"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="system-uicons:message" class="size-1.8em mr-1" />
        Comments
      </q-btn>

      <q-btn
        no-caps
        rounded
        no-wrap
        class="<md:order-5 <md:w-25%"
        :stack="$q.screen.lt.md"
      >
        <Icon icon="fluent:star-add-24-regular" class="size-1.8em mr-1" />
        Favorite
        <!-- fluent:star-checkmark-24-filled -->
      </q-btn>
    </q-toolbar>
  </q-footer>
  <!-- <p class="whitespace-pre-wrap">{{ data }}</p> -->
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useClamp } from "@vueuse/math"
import ReaderHorizontal from "components/truyen-tranh/readers/ReaderHorizontal.vue"
import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import { SERVERS } from "src/apis/parsers/truyen-tranh/[slug]-chap-[chap]"

defineProps<{
  slug: string
  chap: string
}>()

const $q = useQuasar()
const readerHorizontalRef = ref<InstanceType<typeof ReaderHorizontal>>()
const route = useRoute()

const zoom = useClamp(100, 50, 200)
const server = ref("Server 1")
const pageGetter = computed(
  () => SERVERS.find((item) => item.name === server.value)?.get
)
const pages = computed(() =>
  data.pages.map((item) => pageGetter.value?.(item) ?? item.src)
)
const singlePage = ref(false)
const rightToLeft = ref(false)
const scrollingMode = ref(true)

const sizePage = computed(
  () => readerHorizontalRef.value?.sizePage ?? pages.value.length
)
const minPage = computed(() => (rightToLeft.value ? -(sizePage.value - 1) : 0))
const maxPage = computed(() => (rightToLeft.value ? 0 : sizePage.value - 1))
const currentPage = useClamp(0, minPage, maxPage)

const showToolbar = ref(true)

const metaEp = computed(() =>
  data.chapters.find((item) => pathEqual(item.path, route.path))
)

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
