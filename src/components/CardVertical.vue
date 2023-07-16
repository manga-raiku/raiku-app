<template>
  <router-link :to="data.path" v-ripple class="relative flex flex-nowrap">
    <div class="relative">
      <q-img
        no-spinner
        :src="data.image"
        referrerpolicy="no-referrer"
        :ratio="190 / 247"
        width="120px"
        class="rounded-lg"
      >
        <BottomBlur>
          <!-- <div class="text-[30px]">#{{ trending }}</div> -->
          <div class="card-title line-clamp-2 font-family-poppins">
            {{ data.last_chapter.name }}
          </div>
        </BottomBlur>

        <Quality v-if="data.label" class="absolute top-2 right-0">{{
          data.label
        }}</Quality>
        <!-- <Quality v-if="data.updated" class="absolute top-2 left-0">{{  dayjs(data.updated).fromNow() }}</Quality> -->
      </q-img>
      <slot name="inside-image" />
    </div>

    <div class="flex-1 h-full overflow-hidden pl-3 py-[3px] text-[#9a9a9a]">
      <div
        class="text-[16px] text-[#eee] leading-snug"
        :class="{
          'line-clamp-3': threeLine,
          'line-clamp-2': !threeLine,
        }"
      >
        {{ data.name }}
      </div>

      <div v-if="data.updated" class="my-1">
        Cập nhật
        {{ dayjs(data.updated).fromNow() }}
      </div>

      <div v-if="data.views || data.follows" class="flex my-2">
        <template v-if="data.views">
          {{ formatView(data.views) }} lượt xem
          <q-separator v-if="data.follows" vertical class="mx-2" />
        </template>
        <template v-if="data.follows">
          {{ formatView(data.follows) }} theo dõi
        </template>
      </div>

      <p v-if="data.description" class="text-grey mt-3 line-clamp-2">
        {{ data.description }}
      </p>

      <!-- <div class="tags mt-2">
        <span
          v-for="item in data.tags"
          :key="data"
          class="text-gray-300"
        >
        #{{item}}
        </span>
      </div> -->
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import dayjs from "src/logic/dayjs"
import { formatView } from "src/logic/formatView"

import type { CardVerticalProps } from "./CardVertical.types"

import "@fontsource/poppins"

defineProps<{
  data: CardVerticalProps["data"]
  threeLine?: boolean
}>()
</script>
