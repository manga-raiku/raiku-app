<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  auth: guest
</route>

<template>
  <div>
    <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <i-fluent-chevron-left-24-filled class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("cai-dat") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>

    <q-page>
      <q-list padding>
        <q-item
          v-for="item in buttons"
          :key="item.text"
          clickable
          :to="item.to"
          :href="item.href"
        >
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const i18n = useI18n()

const title = () => i18n.t("cai-dat")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})

const buttons = computed(() => [
  {
    text: i18n.t("ngon-ngu"),
    to: "/app/settings/language"
  },
  {
    text: i18n.t("thong-bao"),
    to: "/app/settings/notification"
  },
  // {
  //   text: "Clear Cache",
  // },
  {
    text: i18n.t("dieu-khoan-dich-vu"),
    href: "https://manga-raiku.github.io/term-of-use"
  },
  {
    text: i18n.t("chinh-sach-bao-mat"),
    href: "https://manga-raiku.github.io/privacy-policy"
  },
  {
    text: i18n.t("kiem-tra-loi-mang"),
    to: "/app/settings/check-network"
  }
])
</script>
