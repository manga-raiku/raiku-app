<template>
  <TemplateError
    :title="$t('khong-tim-thay-plugin-nao')"
    :caption="$t('plugin-not-alive-msg')"
    image-slot
    :retrying="retrying"
    :retry="retry"
  >
    <template #image>
      <img
        src="~assets/plugin_not_available.png"
        class="w-240px sm:w-450px max-w-100% mx-auto"
        alt="plugin not available"
      />
    </template>
    <template #actions>
      <q-btn
        rounded
        outline
        class="before:text-#fff before:text-opacity-20 px-4"
        color="sakura3"
        padding="8px 20px"
        no-caps
        @click="stateStore.showPluginManagerDialog = true"
      >
        <i-codicon-extensions class="size-1.5em mr-1" />
        {{ $t("mo-trinh-quan-ly-plugin") }}
      </q-btn>
    </template>
  </TemplateError>
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
