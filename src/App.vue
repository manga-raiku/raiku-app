<template>
  <router-view />
</template>

<script setup lang="ts">
import eruda2 from "eruda2"

const i18n = useI18n()

useHead({
  titleTemplate: (title) => (title && title !== "Raiku" ? `${title} - Raiku` : "Raiku"),
})

const title = "Raiku"
const description = computed(() => i18n.t("app-des"))
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "/favicon.png",
  ogSiteName: "Raiku",
})

if (import.meta.env.DEV) eruda2.init()
</script>
