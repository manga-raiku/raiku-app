<template>
  <div
    class="fixed right-0 bottom-0 py-3px px-4 leading-normal bg-#100 bg-opacity-60 text-#fff text-12px font-family-poppins"
  >
    {{ Math.abs(currentPage) + 1 - sizeOldPages }}/{{ sizePage - sizeOldPages
    }}<span class="ml-2">{{
      $t("ep-name", [metaEp ? normalizeChName(metaEp.name) : "_"])
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { normalizeChName } from "raiku-pgs/plugin"

defineProps<{
  currentPage: number
  sizePage: number

  sizeOldPages: number

  metaEp?: {
    name: string
  }
}>()
</script>

<style lang="scss" scoped>
div {
  border-top-left-radius: 0.4166rem;
}
</style>
