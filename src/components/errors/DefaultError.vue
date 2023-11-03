<template>
  <TemplateError
    :image="image"
    alt="plugin_error"
    :title="$t('rat-tiec-da-xay-ra-loi')"
    :caption="error + ''"
    :retrying="retrying"
    :retry="retry"
  />
</template>

<script lang="ts" setup>
import image from "src/assets/unknown_error.png"

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()
</script>
