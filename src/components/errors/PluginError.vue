<template>
  <TemplateError
    :image="image"
    alt="plugin error"
    title-slot
    :retrying="retrying"
    :retry="retry"
  >
    <template #title>
      {{ $t("plugin") }} <span class="text-sakura">{{ error.sourceId }}</span>
      {{ $t("chua-duoc-cai-dat") }}
    </template>
    <template #caption>
      {{ $t("plugin-error-msg1") }} <br />
      {{ $t("nhan-vao-ben-duoi-de-mo") }}
      <span class="text-blue">{{ $t("trinh-quan-ly-plugin") }}</span>
      {{ $t("sau-do-cai-dat-va-thu-lai") }}
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
import image from "src/assets/plugin_not_found.png"

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()

const stateStore = useStateStore()
</script>
