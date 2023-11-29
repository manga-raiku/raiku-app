<template>
  <teleport
    v-if="
      $q.screen.lt.md &&
      stateStore.appFooterPrependRef &&
      settingsStore.suggestInstallExt
    "
    :to="$q.screen.lt.md && stateStore.appFooterPrependRef"
  >
    <q-toolbar class="px-0 suggest-install-app justify-center">
      <q-card class="bg-blue max-w-480px">
        <q-card-section horizontal>
          <q-card-section class="flex items-center pl-2 pr-1">
            <q-btn
              round
              unelevated
              dense
              @click="settingsStore.suggestInstallExt = false"
            >
              <i-mingcute-close-fill class="size-1.5em" />
            </q-btn>
          </q-card-section>

          <q-card-section class="min-w-0 flex items-center py-2 px-0">
            <img
              src="~assets/animevsub-helper-512.png"
              alt="app icon"
              width="60"
              height="60"
              class="rounded-xl bg-white"
            />
          </q-card-section>

          <q-card-section class="pl-2 py-2">
            <div class="min-w-0">
              <div class="text-subtitle2">
                {{ $t("tien-ich-ho-tro-cho-trinh-duyet") }}
              </div>
              <div class="text-gray-300 text-12px line-clamp-2">
                {{ $t("msg-suggest-ext") }}
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
              href="https://github.com/anime-vsub/extension-animevsub-helper"
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
