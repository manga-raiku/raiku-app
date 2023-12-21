<template>
  <q-btn
    no-caps
    unelevated
    :rounded="!$q.screen.lt.md"
    :round="$q.screen.lt.md"
    :disable="!nextEpisode"
    :to="nextEpisode?.value.route"
    :replace="APP_STANDALONE"
  >
    <template v-if="$q.screen.lt.md">
      <i-solar-alt-arrow-left-line-duotone v-if="rtl" class="size-1.8em" />
      <i-solar-alt-arrow-right-line-duotone v-else class="size-1.8em" />
    </template>
    <template v-else>{{ $t("sau") }}</template>

    <q-tooltip
      anchor="bottom middle"
      self="top middle"
      class="bg-dark text-14px text-weight-medium"
      transition-show="jump-up"
      transition-hide="jump-down"
      >{{ $t("chuong-sau-name", [nextEpisode?.value.name]) }}</q-tooltip
    >
  </q-btn>
</template>

<script lang="ts" setup>
import type { Chapter } from "raiku-pgs/plugin"
import { APP_STANDALONE } from "src/constants"

defineProps<{
  nextEpisode?: {
    readonly index: number
    readonly value: Chapter
  }
  rtl?: boolean
}>()
</script>
