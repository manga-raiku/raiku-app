<route lang="yaml">
meta:
  hiddenHeader: $lt.md
</route>

<template>
  <q-header v-if="$q.screen.lt.md" class="w-full bg-dark-page text-16px">
    <q-toolbar>
      <div class="overflow-x-auto text-grey">
        <div
          v-for="({ name, value }, index) in tabs"
          :key="value"
          class="inline-block px-2 py-2 transition-color duration-200"
          :class="{
            'text-white': activeValue === value,
          }"
          @click="swiperRef?.slideTo(index)"
        >
          {{ name }}
        </div>
      </div>
    </q-toolbar>
  </q-header>

  <q-page
    v-if="$q.screen.lt.md"
    padding
    :style-fn="
      (offset, height) => {
        return {
          height: height - offset + 'px',
        }
      }
    "
  >
    <div class="w-full h-full">
      <!-- swiper -->

      <Swiper
        :slides-per-view="1"
        :initial-slide="activeIndex"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
        class="h-full"
      >
        <swiper-slide
          v-for="{ value, component } in tabs"
          :key="value"
          class="h-full overflow-y-auto scroll-smooth"
          style="white-space: pre-wrap"
        >
          <component :is="component" />
        </swiper-slide>
      </Swiper>
    </div>
  </q-page>
  <q-page v-else padding>
    <q-page-sticky position="top" expand :offset="[0, 0]">
      <q-toolbar>
        <q-toolbar-title>{{ tabs[activeIndex].name }}</q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>

    <div class="pt-40px">
      <component :is="tabs[activeIndex].component" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import LibraryTabFollows from "components/library/LibraryTabFollows.vue"
import LibraryTabHistory from "components/library/LibraryTabHistory.vue"
import LibraryTabOffline from "components/library/LibraryTabOffline.vue"
import type { Swiper as TSwiper } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"
import "swiper/css/grid"

const props = defineProps<{
  type?: string
}>()
const router = useRouter()

const tabs = [
  {
    name: "Lịch sử",
    value: "history",
    component: LibraryTabHistory,
  },
  {
    name: "Theo dõi",
    value: "follow",
    component: LibraryTabFollows,
  },
  {
    name: "Ngoại tuyến",
    value: "offline",
    component: LibraryTabOffline,
  },
]

const swiperRef = ref<TSwiper>()
const activeValue = ref(props.type || tabs[0].value)
const activeIndex = computed(() =>
  Math.max(
    0,
    tabs.findIndex(
      (item) => item.value.toLowerCase() === props.type?.toLowerCase(),
    ),
  ),
)

function onSwiper(swiper: TSwiper) {
  swiperRef.value = swiper
  activeValue.value = tabs[swiper.activeIndex].value
}

function onSlideChange(swiper: TSwiper) {
  activeValue.value = tabs[swiper.activeIndex].value
  router.push(`/library/${activeValue.value}`)
}
</script>
