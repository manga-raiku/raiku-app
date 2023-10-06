<template>
  <q-card-section>
    <img
      src="~assets/unknown_error.png"
      alt="plugin_error"
      class="w-240px max-w-100% mx-auto"
    />

    <div class="text-20px text-weight-normal q-my-sm">
      {{ $t("rat-tiec-da-xay-ra-loi") }}
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

    <!-- <q-btn
          v-if="error === STATUS_PLUGIN_INSTALL.ADDED_BUT_NEED_DOWNLOAD"
          @click="stateStore.showPluginManagerDialog = true"
          >Show Plugin Manager</q-btn
        > -->
  </q-card-actions>
</template>

<script lang="ts" setup>
defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()
</script>
