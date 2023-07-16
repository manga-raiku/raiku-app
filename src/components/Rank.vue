<template>
  <span class="absolute top--6px left-0 w-42px h-42px">
    <img :src="ranks[index] ?? ranks.at(-1)" class="" />
    <span
      class="absolute top-0 left-0 h-75% w-85% text-18px flex items-center justify-center"
      >{{ index + 1 }}</span
    >
  </span>
</template>

<script lang="ts" setup>
import { ranks } from "./Rank.static"

defineProps<{
  index: number
}>()
</script>
