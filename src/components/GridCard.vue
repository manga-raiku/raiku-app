<template>
  <div class="relative row mt-1">
    <div
      v-for="item in items"
      :key="item.name"
      class="col-6 col-sm-3 col-md-2 px-[10px] py-2"
    >
      <Card :data="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CardProps } from "./Card.types"

defineProps<{
  items: CardProps["data"][]
}>()
</script>
