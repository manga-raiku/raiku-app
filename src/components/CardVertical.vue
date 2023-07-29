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
          <router-link
            :to="data.last_chapters[0].path"
            class="card-title line-clamp-2 font-family-poppins"
          >
            Chương {{ data.last_chapters[0].name }}
            <small class="display-block text-12px">
              {{ dayjs(data.last_chapters[0].updated_at).fromNow() }}
            </small>
          </router-link>
        </BottomBlur>
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

      <small class="text-14px text-gray-300 line-clamp-2 mt-1 leading-snug">{{
        data.othername
      }}</small>

      <div class="flex my-2">
        <template v-if="data.views">
          {{ formatView(data.views) }} lượt xem
          <q-separator v-if="data.comments" vertical class="mx-2" />
        </template>
        <template v-if="data.comments">
          {{ formatView(data.comments) }} bình luận
          <q-separator v-if="data.likes" vertical class="mx-2" />
        </template>
        <template v-if="data.likes">
          {{ formatView(data.likes) }} theo dõi
        </template>
      </div>

      <div v-if="data.visited" class="my-2">
        <router-link :to="data.visited.path">
          Đọc tiếp chương {{ data.visited.name }}
        </router-link>
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
  readContinue?: boolean
}>()
</script>
