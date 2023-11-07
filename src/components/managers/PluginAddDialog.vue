<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="w-full mx-6 max-w-560px">
      <q-card-section>
        <h2 class="text-h6">{{ $t("them-plugin") }}</h2>
        <div class="text-subtitle2 text-weight-normal mt-4">
          {{ $t("nhap-dia-chi-plugin") }}
        </div>

        <q-input
          v-model="pluginUrl"
          type="url"
          bottom-slots
          clearable
          autofocus
          :placeholder="$t('placeholder-input-url-plugin')"
          color="main-2"
          :rules="[
            (v) => !!v || $t('vui-long-nhap-dia-chi-plugin'),
            (v) =>
              !!v.match(/^https?:\/\/[^.]+(?:(\.[^.]{2,})|(?:\:\d+))/) ||
              $t('dia-chi-plugin-khong-hop-le')
          ]"
          @keydown.enter="addPlugin"
        />

        <q-toggle
          v-model="devMode"
          color="main-3"
          label="Dev Mode"
          class="ml--2"
        />

        <div class="mt-4 text-gray-300">
          Đây là 2 plugin cho phiên bản Raiku beta:
          <ul>
            <li
              v-for="item in plugins"
              :key="item"
              class="flex flex-nowrap text-blue-400 items-center justify-between"
            >
              {{ item.slice(item.lastIndexOf("/") + 1) }}
              <q-btn flat rounded no-caps @click="pluginUrl = item">{{
                $t("cai-dat")
              }}</q-btn>
            </li>
          </ul>
        </div>
      </q-card-section>

      <q-card-section align="right">
        <q-btn flat no-caps rounded v-close-popup>{{ $t("huy") }}</q-btn>
        <q-btn
          flat
          no-caps
          rounded
          color="main-3"
          :disable="!pluginUrl"
          :loading="addingPlugin"
          @click="addPlugin"
          >{{ $t("them-plugin") }}</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
  (name: "installed"): void
}>()

const pluginStore = usePluginStore()
const $q = useQuasar()
const { t } = useI18n()

const pluginUrl = ref("")
const devMode = ref(false)

const addingPlugin = ref(false)
async function addPlugin() {
  addingPlugin.value = true

  const plugin = pluginUrl.value
  try {
    const { name } = await pluginStore.installPlugin(plugin, devMode.value)

    $q.notify({
      message: t("da-them-plugin-name", [name])
    })
    emit("installed")
  } catch (err) {
    WARN(err)
    let message: string
    switch ((err as Response)?.status) {
      case 404:
        message = t("khong-co-plugin-nao-duoc-tim-thay")
        break
      default:
        if (
          err instanceof PluginError &&
          err.code === STATUS_PLUGIN_INSTALL.NOT_SUPPORT_PLATFORM
        )
          message = t("plugin-nay-khong-ho-tro-moi-truong-nay")
        else
          message = t("loi-khi-them-plugin", [
            import.meta.env.DEV ? ` (${err})` : ""
          ])
    }

    $q.notify({
      message
    })
  } finally {
    addingPlugin.value = false
  }

  addingPlugin.value = false
}

watch(
  () => props.modelValue,
  (modelValue) => {
    if (!modelValue) {
      pluginUrl.value = ""
      devMode.value = false
      addingPlugin.value = false
    }
  }
)

const plugins = [
  "https://manga-raiku.github.io/raiku-plugin-nettruyen",
  "https://manga-raiku.github.io/raiku-plugin-truyenqq"
]
</script>
