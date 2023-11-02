<template>
  <div class="w-full h-full">
    <q-card flat class="q-ma-sm full-width transparent text-center">
      <component
        :is="comp"
        :error="error"
        :retry="retry"
        :retrying="retrying"
      />
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import DefaultErrorVue from "./errors/DefaultError.vue"
import Offline from "./errors/Offline.vue"
import PluginErrorVue from "./errors/PluginError.vue"
import PluginsNotAvailableVue from "./errors/PluginsNotAvailable.vue"
import ResourceNotFound from "./errors/ResourceNotFound.vue"

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retryAsync: () => Promise<any>
}>()

const comp = computed(() => {
  if (props.error instanceof PluginError) return PluginErrorVue
  if (props.error instanceof PluginsNotAvailable) return PluginsNotAvailableVue
  if (props.error.message === "Error: TypeError: Failed to fetch")
    return Offline
  if (props.error?.status === 404) return ResourceNotFound

  return DefaultErrorVue
})

const retrying = ref(false)
async function retry() {
  retrying.value = true
  try {
    await props.retryAsync()
  } catch (err) {
    console.error(err)
  } finally {
    retrying.value = false
  }
}
</script>
