<template>
  <div class="relative row mt-1">
    <div
      v-for="item in items"
      :key="item.name"
      class="col-4 col-sm-3 col-md-2 px-[10px] py-2"
    >
      <Card :data="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MetaManga } from "raiku-pgs/plugin"

defineProps<{
  items: readonly MetaManga[]
}>()
</script>
