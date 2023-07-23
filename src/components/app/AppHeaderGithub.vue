<template>
  <q-btn round unelevated class="mr-2">
    <q-circular-progress
      v-if="updatingCache && installedSW"
      indeterminate
      rounded
      show-value
      size="35px"
      color="main"
    >
      <Icon icon="codicon:github-inverted" width="24" height="24" />
    </q-circular-progress>
    <Icon v-else icon="codicon:github-inverted" width="24" height="24" />

    <q-menu
      anchor="bottom right"
      self="top right"
      class="rounded-xl bg-dark-page shadow-xl"
    >
      <q-card class="transparent w-[280px] px-2 pb-3">
        <q-list>
          <q-item class="rounded-xl">
            <q-item-section class="text-[15px]"> Về ứng dụng </q-item-section>
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
              <Icon icon="carbon:repo-source-code" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Mã nguồn mở trên GitHub</q-item-label>
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
              <Icon
                icon="fluent:person-feedback-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Phản hồi hoặc báo lỗi</q-item-label>
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
              <Icon
                icon="fluent:plug-disconnected-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thảo luân</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            target="_blank"
            href="https://anime-vsub.github.io/about/sponsors"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="octicon:sponsor-tiers-24" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tài trợ / Ủng hộ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon icon="charm:refresh" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Kiểm tra cập nhật</q-item-label>
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
