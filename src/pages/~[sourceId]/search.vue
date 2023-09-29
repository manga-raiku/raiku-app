<route lang="yaml">
name: "search in source"
meta:
  hiddenHeader: $lt.md
  needSelectPlugin: true
</route>

<template>
  <Search :source-id="sourceId" />
</template>

<script lang="ts" setup>
import Search from "src/pages/search.vue"

defineProps<{
  sourceId: string
}>()
</script>
