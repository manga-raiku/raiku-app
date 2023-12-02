<template>
  <TemplateError
    :image="image"
    alt="plugin_error"
    :title="$t('rat-tiec-da-xay-ra-loi')"
    :caption="error + ''"
    :retrying="retrying"
    :retry="retry"
  >
    <template #actions>
      <q-btn
        rounded
        outline
        class="before:text-#fff before:text-opacity-20 px-4"
        color="sakura3"
        padding="8px 20px"
        no-caps
        @click="stateStore.showProxyManagerDialog = true"
      >
        <component :is="Icons.vpn[0]" class="size-1.5em mr-1" />
        {{ $t("mo-trinh-quan-ly-proxy") }}
      </q-btn>
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
import { Icons } from "src/Icons"
import image from "src/assets/unknown_error.png"

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()

const stateStore = useStateStore()
</script>
