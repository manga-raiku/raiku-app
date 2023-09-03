<template>
  <q-header class="bg-dark-page">
    <q-toolbar>
      <div class="overflow-x-auto text-grey">
        <div
          v-for="({ name, value }, index) in tabs"
          :key="value"
          class="inline-block px-2 py-2 text-20px transition-color duration-200"
          :class="{
            'text-white': activeIndex === value,
          }"
          @click="swiperRef?.slideTo(index)"
        >
          {{ name }}
        </div>
      </div>
    </q-toolbar>
  </q-header>

  <q-page
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
        :initial-slide="
          tabs.findIndex(
            (item) => item.value.toLowerCase() === type?.toLowerCase(),
          ) >>> 0
        "
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
const activeIndex = ref(props.type || tabs[0].value)
watch(activeIndex, (activeIndex) => router.push(`/library/${activeIndex}`))

function onSwiper(swiper: TSwiper) {
  swiperRef.value = swiper
  activeIndex.value = tabs[swiper.activeIndex].value
}

function onSlideChange(swiper: TSwiper) {
  activeIndex.value = tabs[swiper.activeIndex].value
}
</script>
