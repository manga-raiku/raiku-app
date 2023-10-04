<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="w-full mx-6 max-w-560px">
      <q-card-section>
        <h2 class="text-h6">Thêm plugin</h2>
        <div class="text-subtitle2 text-weight-normal mt-4">
          Nhập địa chỉ plugin
        </div>

        <q-input
          v-model="pluginUrl"
          type="url"
          bottom-slots
          clearable
          autofocus
          placeholder="e.x: https://repo.github.io/plugins/manga"
          color="main-2"
          :rules="[
            (v) => !!v || 'Vui lòng nhập địa chỉ plugin',
            (v) =>
              v.match(/^https?:\/\/[^.]+\.[^.]{2,}/) ||
              'Địa chỉ plugin không hợp lệ'
          ]"
        />
      </q-card-section>

      <q-card-section align="right">
        <q-btn flat no-caps rounded v-close-popup>Hủy</q-btn>
        <q-btn
          flat
          no-caps
          rounded
          color="main-3"
          :disable="!pluginUrl"
          :loading="addingPlugin"
          @click="addPlugin"
          >Thêm plugin</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
  (name: "installed"): void
}>()

const pluginStore = usePluginStore()
const $q = useQuasar()

const pluginUrl = ref("")

const addingPlugin = ref(false)
async function addPlugin() {
  addingPlugin.value = true

  const plugin = pluginUrl.value
  try {
    const { name } = await pluginStore.installPlugin(plugin)

    $q.notify({
      message: `Đã thêm plugin ${name}`
    })
    emit("installed")
  } catch (err) {
    console.error(err)
    let message: string
    switch (err) {
      case STATUS_PLUGIN_INSTALL.NOT_FOUND:
        message = "Plugin không tồn tại"
        break
      case STATUS_PLUGIN_INSTALL.NOT_FOUND2:
        message = "Plugin tồn tại nhưng dường như cấu hình bị hỏng"
        break
      default:
        message = `Lỗi khi thêm plugin${import.meta.env.DEV ? ` (${err})` : ""}`
    }

    $q.notify({
      message
    })
  } finally {
    addingPlugin.value = false
  }

  addingPlugin.value = false
}
</script>
