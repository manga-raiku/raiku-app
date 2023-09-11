<template>
  <router-link to="/" class="flex flex-nowrap items-end max-w-100%">
    <img src="~assets/app_icon.png" class="display-block size-40px" />
    <span v-if="!noName" class="text-[25px] text-main font-family-caveat"
      >Raiku</span
    >
  </router-link>
</template>

<script lang="ts" setup>
import "@fontsource/caveat"

defineProps<{
  noName?: boolean
}>()
</script>
