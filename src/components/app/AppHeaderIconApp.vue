<template>
  <router-link to="/" class="flex flex-nowrap items-end mr-8">
    <img src="~assets/app_icon.svg" width="35" height="35" />
    <span v-if="!noName"  class="text-[25px] text-main font-family-caveat"
      >Manga Raiku</span
    >
  </router-link>
</template>

<script lang="ts" setup>
import "@fontsource/caveat"

defineProps<{
  noName?: boolean
}>()
</script>
