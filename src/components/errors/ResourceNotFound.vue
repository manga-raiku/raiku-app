<template>
  <TemplateError
    :image="image"
    :title="`Tài nguyên không có`"
    :caption="`Plugin không cung cấp bất cứ thông tin gì.`"
    :retrying="retrying"
    :retry="retry"
  />
</template>

<script lang="ts" setup>
import image from "src/assets/resource_not_found.svg"

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()
</script>
