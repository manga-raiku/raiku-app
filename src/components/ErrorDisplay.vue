<template>
  <div class="w-full h-full">
    <q-card
      flat
      class="q-ma-sm full-width top-1/2 transform translate-y--50% transparent text-center"
    >
      <q-card-section>
        <div class="text-20px text-weight-normal q-my-sm">
          Rất tiếc, đã xảy ra lỗi!
        </div>
        <div
          class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
        >
          {{ error + "" }}
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          rounded
          outline
          class="before:text-#fff before:text-opacity-20 px-4"
          color="blue"
          padding="8px 20px"
          no-caps
          :loading="retrying"
          @click="retry"
          >{{ $t("thu-lai") }}</q-btn
        >

        <q-btn
          v-if="error === STATUS_PLUGIN_INSTALL.ADDED_BUT_NEED_DOWNLOAD"
          @click="stateStore.showPluginManagerDialog = true"
          >Show Plugin Manager</q-btn
        >
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { STATUS_PLUGIN_INSTALL } from "src/constants"

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retryAsync: () => Promise<any>
}>()
const stateStore = useStateStore()

const retrying = ref(false)
async function retry() {
  retrying.value = true
  await props.retryAsync()
  retrying.value = false
}
</script>
