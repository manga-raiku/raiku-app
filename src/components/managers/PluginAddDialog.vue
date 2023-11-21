<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="flex flex-nowrap flex-col w-full h-full mx-6 !max-w-560px">
      <q-card-section class="pb-0">
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

        <div class="text-gray-300">{{ $t("plugin-da-xac-minh") }}</div>
      </q-card-section>

      <q-card-section
        class="pt-0 min-h-0 flex-1 overflow-y-auto scrollbar-custom"
      >
        <div class="mt-4 text-gray-300">
          <q-list v-if="data">
            <q-item
              v-for="item in data"
              :key="item.meta.id"
              class="min-h-0 my-2 rounded-xl"
            >
              <q-item-section side class="pr-2 min-w-0">
                <q-img
                  width="1.8em"
                  height="1.8em"
                  class="rounded"
                  :src="item.favicon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  {{ item.meta.name }}
                  <q-badge
                    rounded
                    class="text-10px bg-light-blue-400 bg-opacity-800"
                    size="sm"
                    >{{ item.meta.version }}</q-badge
                  >
                  <q-badge
                    v-if="item.meta.isNSFW"
                    rounded
                    color="pink-7"
                    class="text-10px ml-1"
                    >NSFW</q-badge
                  >
                </q-item-label>
                <q-item-label lines="2" caption>
                  {{ item.meta.description }}
                </q-item-label>
                <q-item-label lines="1" caption>
                  {{ $t("tag-user", [item.sender]) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round no-caps @click="addPlugin(item.url)">
                  <i-solar-download-minimalistic-bold-duotone
                    class="size-1.5em"
                  />
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else-if="error" class="py-4 px-3 text-gray-300">
            {{ error }}
          </div>
          <div v-else class="flex items-center justify-center py-6">
            <q-spinner size="40px" color="main-3" />
          </div>
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
          @click="addPlugin(pluginUrl)"
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

const { data, error, runAsync } = useRequest<
  {
    sender: string
    url: string
    meta: {
      id: string
      name: string
      version: string
      description: string
      author: string
      homepage: string
      isNSFW: boolean
      language: string
      support: boolean
      updatedAt: number
    }
    favicon: string
  }[]
>(
  () =>
    fetch("https://services.mangaraiku.eu.org/v1/list-plugin").then(
      (res) => res.json()
    ),
  {
    manual: true
  }
)

const pluginUrl = ref("")
const devMode = ref(false)

const addingPlugin = ref(false)
async function addPlugin(plugin: string) {
  addingPlugin.value = true
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
    } else {
      void runAsync()
    }
  }
)
</script>
