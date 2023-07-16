<route lang="yaml">
meta:
  hiddenHeader: true
  offset: true
  existsFooter: true
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
    ref="readerRef"
    :pages="pages"
    :single-page="singlePage || $q.screen.width <= 517"
    :right-to-left="rightToLeft"
    :min-page="minPage"
    v-model:current-page="currentPage"
    v-model:zoom="zoom"
  />
  <ReaderVertical
    v-else
    :pages="pages"
    v-model:current-page="currentPage"
    v-model:zoom="zoom"
  />

  <!-- <div class="fixed top-0 left-0 w-full h-full bg-[#000] bg-opacity-10" /> -->

  <q-footer
    class="bg-[rgba(0,0,0,0.9)] font-family-poppins"
    :model-value="showToolbar"
  >
    <q-toolbar class="sm:px-10 md:px-16">
      <div
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

      <span class="display-block text-#777 whitespace-nowrap"
        >{{ (rightToLeft ? -currentPage : currentPage) + 1 }} /
        {{ sizePage + 1 }}</span
      >
      <div class="flex-1 mx-4 flex">
        <q-slider
          class="my-auto"
          :model-value="rightToLeft ? -currentPage : currentPage"
          @update:model-value="currentPage = rightToLeft ? -$event : $event"
          markers
          dense
          :reverse="rightToLeft"
          :min="rightToLeft ? maxPage : minPage"
          :max="rightToLeft ? -minPage : maxPage"
          color="main"
        />
      </div>

      <q-btn no-caps rounded label="Previous" />
      <q-btn no-caps rounded label="Next" />

      <q-btn no-caps rounded label="Episodes" class="mx-5" />

      <q-separator />

      <q-btn no-caps rounded no-wrap>
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

      <q-btn no-caps rounded no-wrap>
        <Icon icon="majesticons:comment-2-text-line" class="size-1.8em mr-1" />
        Comments
      </q-btn>

      <q-btn no-caps rounded no-wrap>
        <Icon icon="fluent:star-add-24-regular" class="size-1.8em mr-1" />
        Favorite
        <!-- fluent:star-checkmark-24-filled -->
      </q-btn>
    </q-toolbar>
  </q-footer>
  <!-- <p class="whitespace-pre-wrap">{{ data }}</p> -->
</template>

<script lang="ts" setup>
import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164-chap-140.json"
import { SERVERS } from "src/apis/parsers/truyen-tranh/[slug]-chap-[chap]"
import { useClamp } from "@vueuse/math"

import { Icon } from "@iconify/vue"

defineProps<{
  slug: string
  chap: string
}>()

const $q = useQuasar()
const readerRef = ref()

const zoom = useClamp(100, 50, 200)
const server = ref("Server 1")
const pageGetter = computed(
  () => SERVERS.find((item) => item.name === server.value).get
)
const pages = computed(() =>
  data.pages.map((item) => pageGetter.value?.(item) ?? item.src)
)
const singlePage = ref(false)
const rightToLeft = ref(false)
const scrollingMode = ref(true)

const sizePage = computed(() => readerRef.value?.sizePage ?? pages.value.length)
const minPage = computed(() => (rightToLeft.value ? -sizePage.value : 0))
const maxPage = computed(() => (rightToLeft.value ? 0 : sizePage.value))
const currentPage = useClamp(0, minPage, maxPage)

const showToolbar = ref(true)
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
