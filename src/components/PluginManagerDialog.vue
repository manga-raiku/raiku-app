<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    full-width
    full-height
  >
    <q-card
      class="h-full min-w-310px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px flex items-center justify-between pl-7">
        Plugins Manager

        <q-btn unelevated round v-close-popup>
          <i-ep-close-bold class="size-1.5em" />
        </q-btn>
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <q-list v-if="!error && data">
          <q-item
            clickable
            class="rounded-xl"
            @click="showDialogAddPlugin = true"
          >
            <q-item-section avatar class="min-w-0">
              <i-iconamoon-sign-plus-fill class="size-1.5em" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm plugin</q-item-label>
            </q-item-section>
          </q-item>

          <div v-if="!data.length" class="text-center py-6">Không có gì cả</div>
          <q-item
            v-else
            v-for="item in data"
            :key="item.id"
            clickable
            target="_blank"
            :href="item.homepage ?? item.source"
            class="rounded-xl"
          >
            <q-item-section avatar class="min-w-0">
              <img :src="`data:image/png;base64,${item.favicon}`" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{ item.name }}</q-item-label>
              <q-item-label lines="2" caption>{{
                item.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{ item.version }}
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="error" class="px-6 py-5">
          {{ error }}
        </div>
        <div v-else class="flex items-center justify-center py-6">
          <q-spinner size="40px" color="main-3" />
        </div>
      </q-card-section>
      <q-card-section
        class="flex flex-nowrap items-center justify-between !py-0"
      >
        footer
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDialogAddPlugin">
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
              'Địa chỉ plugin không hợp lệ',
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
import { QInput } from "quasar"

defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
}>()

const pluginStore = usePluginStore()
const $q = useQuasar()

const { data, error } = useRequest(() => pluginStore.getAllPlugins())

const showDialogAddPlugin = ref(false)

const pluginUrl = ref("")

const addingPlugin = ref(false)
async function addPlugin() {
  addingPlugin.value = true

  const plugin = pluginUrl.value
  try {
    const { name } = await pluginStore.installPlugin(plugin)

    $q.notify({
      message: `Đã thêm plugin ${name}`,
    })
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
      message,
    })
  } finally {
    addingPlugin.value = false
  }

  addingPlugin.value = false
}
</script>
