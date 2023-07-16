<template>
  <div
    class="w-1/2 h-full display-inline-block overflow-hidden relative"
    :class="{
      'w-full': singlePage,
    }"
  >
    <img
      class="object-scale-down h-full"
      :class="{
        'ml-auto': prime,
      }"
      :src="src"
      @load="emit('load', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  prime: boolean
  src: string
  singlePage: boolean
}>()
const emit = defineEmits<{
  (name: "load", event: Event): void
}>()
</script>
