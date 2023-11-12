<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  auth: true
</route>

<template>
  <div>
    <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <i-fluent-chevron-left-24-filled class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("thong-bao") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>
    <q-page> notification </q-page>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const i18n = useI18n()

const title = () => i18n.t("cai-dat-thong-bao")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})
</script>
