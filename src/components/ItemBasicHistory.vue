<template>
  <router-link :to="path" v-ripple class="relative flex flex-nowrap mb-4">
    <div class="relative">
      <q-img
        no-spinner
        :src="image"
        referrerpolicy="no-referrer"
        :ratio="190 / 247"
        width="120px"
        class="rounded-lg"
      >
      </q-img>
    </div>

    <div
      class="relative min-w-0 flex-1 h-auto pl-3 py-[3px] text-[#9a9a9a] flex flex-col justify-between"
    >
      <div>
        <div class="text-1.15em text-[#eee] leading-snug line-clamp-2">
          {{ name }}
        </div>

        <small
          v-if="history"
          class="text-1em text-gray-300 line-clamp-2 mt-3 leading-snug"
        >
          Đã đọc Chương {{ history.name }}
        </small>

        <small v-if="history" class="text-0.95em text-gray-300 mt-2">
          {{ dayjs(history.updated_at).fromNow() }}
        </small>
      </div>

      <div class="mb-4">
        <q-btn
          v-if="history"
          rounded
          no-caps
          :to="history.path"
          class="text-12px mr-2"
          color="blue-400"
        >
          <Icon
            icon="fluent:play-multiple-16-regular"
            class="size-1.5em mr-1"
          />
          Đọc tiếp
        </q-btn>

        <q-btn rounded no-caps :to="path" class="text-12px" color="gray-700">
          Đọc từ đầu
        </q-btn>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import dayjs from "src/logic/dayjs"

defineProps<{
  path: string
  name: string
  image: string

  history?: {
    name: string
    path: string
    updated_at: string
  }
}>()
</script>
