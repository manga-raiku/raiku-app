<template>
  <router-link :to="data.route" v-ripple class="relative flex flex-nowrap">
    <div class="relative">
      <q-img
        no-spinner
        :src="data.image"
        referrerpolicy="no-referrer"
        :ratio="190 / 247"
        :width="imgWidth ?? '120px'"
        class="rounded-lg"
      >
        <BottomBlur>
          <!-- <div class="text-[30px]">#{{ trending }}</div> -->
          <router-link
            :to="data.last_chapters[0].route"
            class="card-title line-clamp-2 font-family-poppins"
          >
            {{ $t("chuong-name", [data.last_chapters[0].name]) }}
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
        class="text-1.2em text-[#eee] leading-snug ellipsis"
        :class="{
          'line-clamp-3': threeLine,
          'line-clamp-2': !threeLine
        }"
      >
        {{ data.name }}
      </div>

      <small class="text-1em text-gray-300 line-clamp-2 mt-1 leading-snug">{{
        data.othername
      }}</small>

      <div class="mt-1.5 mb-2 text-0.95em">
        <div v-if="data.views">
          {{ $t("val-luot-xem", [formatView(data.views)]) }}
          <q-separator v-if="data.comments" vertical class="mx-2" />
        </div>
        <div class="flex items-center">
          <div v-if="data.likes" class="flex items-center">
            <i-iconamoon-heart-thin class="size-1.2em mr-1" />
            {{ formatView(data.likes) }}
            <q-separator
              v-if="data.comments"
              vertical
              class="mx-2 h-10px my-auto"
            />
          </div>
          <div v-if="data.comments" class="flex items-center">
            <i-iconamoon-comment-dots-light class="size-1.2em mr-1" />
            {{ formatView(data.comments) }}
          </div>
        </div>
      </div>
      <!--
      <div v-if="data.visited" class="my-2">
        <router-link :to="data.visited.path">
          {{ $t("doc-tiep-chuong-name", [data.visited.name]) }}
        </router-link>
      </div> -->

      <p
        v-if="data.description"
        class="text-grey mt-3 line-clamp-2 text-0.95em"
      >
        {{ data.description }}
      </p>

      <div v-if="!noTags" class="tags mt-2 text-12px line-clamp-2">
        <span
          v-if="typeof data.tags[0] === 'string'"
          v-for="item in data.tags"
          :key="data.name"
          class="text-gray-300"
        >
          {{ $t("tag-_val", [item]) }}
        </span>
        <template v-else>
          <router-link
            v-for="item in data.tags as Genre[]"
            :key="data.name"
            :to="item.route"
            class="text-gray-300"
          >
            {{ $t("tag-_val", [item.name]) }}
          </router-link>
        </template>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import type { Genre, MetaManga } from "raiku-pgs/plugin"
import dayjs from "src/logic/dayjs"
import { formatView } from "src/logic/formatView"

import "@fontsource/poppins"

defineProps<{
  data: MetaManga

  noTags?: boolean

  threeLine?: boolean
  readContinue?: boolean
  imgWidth?: string
}>()
</script>

<style lang="scss" scoped>
.tags {
  > * {
    @apply mr-3 inline-block;
  }

  @media (max-width: 767px) {
    font-size: 13px;

    > * {
      @apply mr-1 mt-1;
    }
  }
}
</style>
