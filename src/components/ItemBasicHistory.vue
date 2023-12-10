<template>
  <router-link
    :to="{
      name: 'comic',
      params: { comic, sourceId }
    }"
    v-ripple
    class="relative flex flex-nowrap"
  >
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
          {{ $t("da-doc-chuong-history-name", [history.name]) }}
        </small>

        <small v-if="history" class="text-0.95em text-gray-300 mt-2">
          {{ dayjs(history.updated_at).fromNow() }}
        </small>
      </div>

      <div class="mb-4 children:mt-1" @click.stop>
        <q-btn
          v-if="history"
          rounded
          no-caps
          no-wrap
          :to="{
            name: 'comic chap',
            params: {
              sourceId,
              comic,
              chap: history.param
            }
          }"
          class="text-12px mr-2"
          color="blue-400"
        >
          <i-fluent-play-multiple-16-regular class="size-1.5em mr-1" />
          {{ $t("doc-tiep") }}
        </q-btn>

        <q-btn
          rounded
          no-caps
          no-wrap
          :to="{
            name: 'comic',
            params: { comic, sourceId }
          }"
          class="text-12px"
          color="gray-700"
        >
          {{ $t("doc-tu-dau") }}
        </q-btn>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import dayjs from "src/logic/dayjs"

defineProps<{
  comic: string
  name: string
  image: string
  sourceId: string

  history?: {
    name: string
    param: string
    updated_at: string
  }
}>()
</script>
