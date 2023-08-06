<template>
  <q-header class="bg-dark-page">
    <q-toolbar>
      <div class="overflow-x-auto text-[14px] text-grey">
        <div
          v-for="({ name, value }, index) in tabs"
          :key="value"
          class="inline-block px-2 py-2"
          :class="{
            'text-white text-weight-medium': activeIndex === index,
          }"
          @click="swiperRef?.slideTo(index)"
        >
          {{ name }}
        </div>
      </div>
    </q-toolbar>
  </q-header>

  <div class="absolute w-full h-full top-108px">
    <!-- swiper -->

    <Swiper
      :slides-per-view="1"
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
</template>

<script lang="ts" setup>
import type { Swiper as TSwiper } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"
import "swiper/css/grid"

const tabs = [{
  name: "",
  value: "",
  component: () => {}
}]

const swiperRef = ref()
const activeIndex = ref(0)

function onSwiper(swiper: TSwiper) {
  swiperRef.value = swiper
  activeIndex.value = swiper.activeIndex
}

function onSlideChange(swiper: TSwiper) {
  activeIndex.value = swiper.activeIndex
}
</script>
