<template>
  <q-avatar>
    <q-img no-spinner :src="srcs[error]" @error="error++"> </q-img>
  </q-avatar>
</template>

<script lang="ts" setup>
defineProps<{
  srcs: string[]
}>()

const error = ref(0)
</script>
