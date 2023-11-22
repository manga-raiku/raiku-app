<template>
  <div class="flex flex-nowrap items-center justify-between">
    <div class="ellipsis min-w-0">{{ $t("chuong-name", [data.ep_name]) }}</div>

    <div
      class="text-gray-100 text-opacity-70 text-0.95em text-weight-normal flex items-center"
    >
      {{ data.downloaded }}/{{ data.pages.length }}

      <span class="display-inline-block min-w-70px text-right">{{
        data.downloaded < data.pages.length
          ? downloading
            ? $t("dang-tai")
            : $t("tam-dung")
          : $t("finished")
      }}</span>
      <q-btn
        v-if="data.downloaded < data.pages.length"
        round
        :disable="!networkStore.isOnline"
        @click="downloading ? emit('stop') : emit('resume')"
      >
        <i-solar-pause-bold v-if="downloading" class="size-1.2em" />
        <i-solar-play-bold v-else class="size-1.2em" />
      </q-btn>
      <div v-else class="size-42px flex items-center justify-center">
        <i-uim-check class="size-30px text-green-500" />
      </div>
    </div>
  </div>
  <q-linear-progress
    :disable="
      data.downloaded < data.pages.length && downloading === false
        ? ''
        : undefined
    "
    :value="data.downloaded / data.pages.length"
    color="sakura3"
    size="xs"
  />
</template>

<script lang="ts" setup>
import type {
  ComicChapterOnDisk,
  ComicChapterRunning
} from "src/logic/download-manager"

defineProps<{
  data: ComicChapterOnDisk | ComicChapterRunning
  downloading?: boolean
}>()
const emit = defineEmits<{
  (name: "stop" | "resume"): void
}>()

const networkStore = useNetworkStore()
</script>
