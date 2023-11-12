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

        <q-toolbar-title>{{ $t("kiem-tra-loi-mang") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>

    <q-page>
      <q-list padding>
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("loai-ket-noi") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ connectionType }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>IP</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ IP }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("ping") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{
              $t("time-ms", [ping?.toFixed(2) ?? "__"])
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>OS</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ device?.osVersion }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("thiet-bi") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ device?.model }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>WebView</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ device?.webViewVersion }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { Device } from "@capacitor/device"
import type { ConnectionType } from "@capacitor/network"
import { Network } from "@capacitor/network"

const i18n = useI18n()

const title = () => i18n.t("kiem-tra-tinh-trang-mang")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})

const router = useRouter()

const connectionType = shallowRef<ConnectionType | "offline">()

void Network.getStatus().then(
  (status) =>
    (connectionType.value = status.connected
      ? status.connectionType
      : "offline")
)
void Network.addListener("networkStatusChange", (status) => {
  connectionType.value = status.connected ? status.connectionType : "offline"
})

const IP = computedAsync(() => {
  return fetch("https://freeipapi.com/api/json")
    .then((res) => res.json())
    .then((res) => {
      return `${res.ipAddress} - ${res.regionName} (${res.countryName})`
    })
})
const ping = computedAsync(async () => {
  const time = performance.now()
  await get({ url: "https://google.co.jp" })
  return performance.now() - time
})
const device = computedAsync(async () => {
  return Device.getInfo()
})
</script>
