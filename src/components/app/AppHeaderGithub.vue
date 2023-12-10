<template>
  <q-btn round unelevated class="mr-2">
    <q-circular-progress
      v-if="updatingCache && installedSW"
      indeterminate
      rounded
      show-value
      size="35px"
      color="sakura"
    >
      <i-codicon-github-inverted width="24" height="24" />
    </q-circular-progress>
    <i-codicon-github-inverted v-else width="24" height="24" />

    <q-menu
      anchor="bottom right"
      self="top right"
      class="rounded-xl bg-dark-page shadow-xl"
    >
      <q-card class="transparent w-[280px] px-2 pb-3">
        <q-list>
          <q-item class="rounded-xl">
            <q-item-section class="text-[15px]">
              {{ $t("ve-ung-dung") }}
            </q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/manga-raiku/manga-raiku"
          >
            <q-item-section avatar class="min-w-0">
              <i-carbon-repo-source-code width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("ma-nguon-mo") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/manga-raiku/manga-raiku/issues"
          >
            <q-item-section avatar class="min-w-0">
              <i-fluent-person-feedback-24-regular width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("phan-hoi-hoac-bao-loi") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://github.com/manga-raiku/manga-raiku/discussions"
          >
            <q-item-section avatar class="min-w-0">
              <i-fluent-plug-disconnected-24-regular width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("thao-luan") }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://ko-fi.com/tachib_shin"
          >
            <q-item-section avatar class="min-w-0">
              <i-octicon-sponsor-tiers-24 width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t("tai-tro-ung-ho") }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { installedSW, updatingCache } from "src/logic/state-sw"
</script>
