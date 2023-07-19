<template>
  <div
    class="fixed right-0 bottom-0 py-3px px-4 leading-normal bg-#100 bg-opacity-60 text-#fff text-12px font-family-poppins"
  >
    {{ currentPage + 1 }}/{{ sizePage
    }}<span class="ml-2">Ep. {{ normalizeChName(metaEp.name) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { normalizeChName } from "src/logic/normalize-ch-name"

defineProps<{
  currentPage: number
  sizePage: number

  metaEp: {
    name: string
  }
}>()
</script>

<style lang="scss" scoped>
div {
  border-top-left-radius: 0.4166rem;
}
</style>
