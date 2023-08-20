<template>
  <div>
    <q-header class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Ngôn ngữ</q-toolbar-title>
      </q-toolbar>
    </q-header>

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
            <Icon icon="fluent:checkmark-24-regular" class="size-1.5em" />
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
</script>
