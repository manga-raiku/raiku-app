<template>
  <div class="flex flex-nowrap items-center justify-between">
    <div class="ellipsis min-w-0">Chương {{ data.ep_name }}</div>

    <div
      class="text-gray-100 text-opacity-70 text-0.95em text-weight-normal flex items-center"
    >
      {{ data.downloaded }}/{{ data.pages.length }}

      <span class="display-inline-block min-w-70px text-right">{{
        data.downloaded < data.pages.length
          ? downloading
            ? "Downloading"
            : "Paused"
          : "Finished"
      }}</span>

      <q-btn
        v-if="data.downloaded < data.pages.length"
        round
        @click="downloading ? emit('stop') : emit('resume')"
      >
        <component
          :is="downloading ? 'solar:pause-bold' : 'solar:play-bold'"
          class="size-1.2em"
        />
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
    color="main-3"
    size="xs"
  />
</template>

<script lang="ts" setup>
import type {
  MetaEpisodeOnDisk,
  MetaEpisodeRunning,
} from "src/logic/download-manager"

defineProps<{
  data: MetaEpisodeOnDisk | MetaEpisodeRunning
  downloading?: boolean
}>()
const emit = defineEmits<{
  (name: "stop" | "resume"): void
}>()
</script>
