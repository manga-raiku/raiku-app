<template>
  <teleport
    v-if="stateStore.appFooterPrependRef && settingsStore.suggestInstallApp"
    :to="stateStore.appFooterPrependRef"
  >
    <q-toolbar class="px-0 suggest-install-app">
      <q-card class="bg-blue">
        <q-card-section horizontal>
          <q-card-section class="flex items-center pl-2 pr-1">
            <q-btn
              round
              unelevated
              dense
              @click="settingsStore.suggestInstallApp = false"
            >
              <i-mingcute-close-fill class="size-1.5em" />
            </q-btn>
          </q-card-section>

          <q-card-section class="flex items-center py-2 px-0">
            <img
              src="~assets/app_icon.png"
              alt="app icon"
              width="60"
              height="60"
              class="rounded-xl bg-white"
            />
          </q-card-section>

          <q-card-section class="pl-2 py-2">
            <div class="min-w-0">
              <div class="text-subtitle2">{{ $t("ung-dung-cho-android") }}</div>
              <div class="text-gray-300 text-12px">
                {{ $t("msg-suggest-install-app") }}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="py-2 flex items-center">
            <q-btn
              rounded
              color="white"
              class="text-blue"
              size="sm"
              target="_blank"
              href="https://github.com/manga-raiku/raiku-app"
              >{{ $t("lay") }}</q-btn
            >
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-toolbar>
  </teleport>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore()
const stateStore = useStateStore()
</script>
