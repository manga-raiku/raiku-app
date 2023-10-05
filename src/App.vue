<template>
  <span
    class="fixed top-1 right-1 px-2 py-0.5 rounded-xl bg-blue-500 opacity-70 text-white z-9999 transition-opacity duration-200 hover:opacity-90 text-12px"
    >Beta</span
  >
  <router-view />
</template>

<script setup lang="ts">
import eruda2 from "eruda2"

const i18n = useI18n()

useHead({
  titleTemplate: (title) =>
    title && title !== "Raiku" ? `${title} - Raiku` : "Raiku"
})

const title = "Raiku"
const description = computed(() => i18n.t("app-des"))
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "/icons/icon-512x512.png",
  ogSiteName: "Raiku"
})

// if (import.meta.env.DEV) eruda2.init()
</script>
