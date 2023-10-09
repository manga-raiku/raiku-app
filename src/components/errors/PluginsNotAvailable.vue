<template>
  <q-card-section>
    <img
      src="~assets/plugin_not_available.png"
      class="w-240px sm:w-450px max-w-100% mx-auto"
      alt="plugin_error"
    />

    <div class="text-20px text-weight-normal q-my-sm">
      {{ $t("khong-tim-thay-plugin-nao") }}
    </div>

    <div
      class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
    >
      {{ $t("plugin-not-alive-msg") }}
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
    >
      <i-solar-refresh-circle-line-duotone class="size-1.5em mr-1" />
      {{ $t("thu-lai") }}
    </q-btn>

    <q-btn
      rounded
      outline
      padding="8px 20px"
      no-caps
      @click="stateStore.showPluginManagerDialog = true"
    >
      <i-codicon-extensions class="size-1.5em mr-1" />
      {{ $t("mo-trinh-quan-ly-plugin") }}
    </q-btn>
  </q-card-actions>
</template>

<script lang="ts" setup>
defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()

const stateStore = useStateStore()
</script>
