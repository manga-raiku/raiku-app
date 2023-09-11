<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  auth: guest
</route>

<template>
  <div>
    <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Kiểm tra lỗi mạng</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page>
      <q-list padding>
        <q-item>
          <q-item-section>
            <q-item-label>Loại kết nối</q-item-label>
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
            <q-item-label>Ping</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ ping?.toFixed(2) ?? "__" }}ms</q-item-label>
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
            <q-item-label>Thiết bị</q-item-label>
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
import index from "src/apis/nettruyen/runs"

const router = useRouter()

const connectionType = shallowRef<ConnectionType | "offline">()

// eslint-disable-next-line promise/catch-or-return
Network.getStatus().then(
  (status) =>
    (connectionType.value = status.connected
      ? status.connectionType
      : "offline"),
)
Network.addListener("networkStatusChange", (status) => {
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
  await index()
  return performance.now() - time
})
const device = computedAsync(async () => {
  return Device.getInfo()
})
</script>
