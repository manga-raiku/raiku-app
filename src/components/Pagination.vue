<template>
  <div class="flex items-center justify-center q-pa-md">
    <q-pagination
      :model-value="modelValue"
      @update:model-value="emit('update:model-value', $event)"
      :max="max"
      :max-pages="6"
      boundary-numbers
      direction-links
      color="sakura3"
      active-design="unelevated"
      active-color="pink-5"
      active-text-color="sakura4"
      ellipses
      :max-page="6"
      unelevated
      flat
      rounded
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  max: number
  modelValue: number
}>()

const emit = defineEmits<{
  (name: "update:model-value", value: number): void
}>()
</script>
