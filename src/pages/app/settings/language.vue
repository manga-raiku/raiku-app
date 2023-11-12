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

        <q-toolbar-title>{{ $t("ngon-ngu") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>

    <q-page>
      <q-list padding>
        <q-item
          v-for="{ code, name } in langs"
          :key="code"
          clickable
          @click="settingsStore.locale = code"
        >
          <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="code === settingsStore.locale" side>
            <i-fluent-checkmark-24-regular class="size-1.5em" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import langs from "virtual:i18n-langs"

const router = useRouter()
const settingsStore = useSettingsStore()
const i18n = useI18n()

const title = () => i18n.t("cai-dat-ngon-ngu")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})
</script>
