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
          color="sakura2"
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
          color="sakura3"
          :label="$t('dev-mode')"
          class="ml--2"
        />

        <div class="text-gray-300">{{ $t("plugin-da-xac-minh") }}</div>
      </q-card-section>

      <q-card-section
        class="pt-0 min-h-0 flex-1 overflow-y-auto scrollbar-custom"
      >
        <form class="text-14px mx-8">
          <div class="table">
            <div class="table-row">
              <div class="table-cell text-right py-3 text-12px">Search:</div>
              <div class="table-cell pl-4">
                <q-input
                  v-model="search"
                  outline
                  :placeholder="$t('search-plugin-by-name-or-id')"
                />
              </div>
            </div>

            <div class="table-row">
              <div class="table-cell text-right py-3 text-12px">
                {{ $t("language") }}
              </div>
              <div class="table-cell pl-4">
                <q-select
                  v-model="language"
                  outline
                  emit-value
                  map-options
                  :options="languages"
                  :placeholder="$t('show-specific-languages')"
                />
              </div>
            </div>

            <div class="table-row">
              <div class="table-cell text-right py-3 text-12px">
                {{ t("sort-by") }}
              </div>
              <div class="table-cell pl-4">
                <div class="flex items-end">
                  <q-option-group
                    v-model="sortBy"
                    :options="sorts"
                    color="pink"
                    spacing="lg"
                    inline
                    dense
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div class="table-row">
              <div class="table-cell text-right py-3 text-12px">
                {{ $t("display-mode") }}
              </div>
              <div class="table-cell pl-4">
                <div class="flex items-end">
                  <q-option-group
                    v-model="displayMode"
                    :options="modes"
                    color="pink"
                    spacing="lg"
                    inline
                    dense
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="mt-4 text-gray-300">
          <q-list v-if="data">
            <template
              v-for="[languageCode, plugins] in pluginsShow"
              :key="languageCode"
            >
              <div class="py-2 font-medium text-18px mt-6">
                {{ ISO6391.getNativeName(languageCode) || "All" }}
              </div>

              <q-item
                v-for="item in plugins"
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

                    <span class="text-12px text-gray-300 ml-2">{{
                      dayjs(item.meta.updatedAt).locale("vi").fromNow()
                    }}</span>
                  </q-item-label>
                  <q-item-label lines="2" caption>
                    {{ item.meta.description }}
                  </q-item-label>
                  <q-item-label lines="1" caption>
                    @{{ item.sender }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    v-if="!allPlugins?.has(item.meta.id)"
                    flat
                    round
                    no-caps
                    @click="addPlugin(item.url)"
                  >
                    <i-solar-download-minimalistic-bold-duotone
                      class="size-1.5em"
                    />
                  </q-btn>
                  <q-btn
                    v-else
                    flat
                    round
                    no-caps
                    @click="removePlugin(item.meta)"
                  >
                    <i-solar-trash-bin-minimalistic-bold-duotone
                      class="size-1.5em"
                    />
                  </q-btn>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
          <div v-else-if="error" class="py-4 px-3 text-gray-300">
            {{ error }}
          </div>
          <div v-else class="flex items-center justify-center py-6">
            <q-spinner size="40px" color="sakura3" />
          </div>
        </div>
      </q-card-section>

      <q-card-section align="right">
        <q-btn flat no-caps rounded v-close-popup>{{ $t("huy") }}</q-btn>
        <q-btn
          flat
          no-caps
          rounded
          color="sakura3"
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
import ISO6391 from "iso-639-1"
import type { Package } from "raiku-pgs/dist/API"
import dayjs from "src/logic/dayjs"
import type { PackageDisk } from "src/stores/plugin"

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
    fetch("https://services.mangaraiku.eu.org/v1/list-plugin").then((res) =>
      res.json()
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

function removePlugin(item: Pick<PackageDisk, "name" | "id">) {
  $q.dialog({
    title: t("xoa-plugin"),
    message: t("ban-chac-chan-muon-xoa-plugin-item-name-chu", [item.name]),
    cancel: { label: t("huy"), flat: true, noCaps: true, rounded: true },
    ok: {
      label: t("xoa"),
      color: "red",
      flat: true,
      noCaps: true,
      rounded: true
    },
    persistent: true
  }).onOk(() => {
    void pluginStore.removePlugin(item.id)
    $q.notify({
      message: t("da-xoa-plugin", [item.name])
    })
  })
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

// ========== search plugin =========

const { data: allPlugins } = useRequest(() =>
  pluginStore
    .getAllPlugins()
    .then((list) => shallowReactive(new Set(list.map((item) => item.id))))
)
pluginStore.busses.on("install plugin", (meta) => {
  allPlugins.value?.add(meta.id)
})
pluginStore.busses.on("remove plugin", (id) => {
  allPlugins.value?.delete(id)
})

const sorts = computed(() => [
  {
    label: t("ascending"),
    value: "asc"
  },
  {
    label: t("descending"),
    value: "desc"
  }
])
const modes = computed(() => [
  {
    label: "NSFW",
    value: "nsfw"
  },
  {
    label: "SFW",
    value: "sfw"
  },
  {
    label: t("all"),
    value: "all"
  }
])

const search = ref("")
const language = ref("")
console.log({ language })
const sortBy = ref<"asc" | "desc">("asc")
const displayMode = ref<"nsfw" | "sfw" | "all">("all")

interface PluginInfo {
  meta: Omit<Package, "favicon">
  sender: string
  url: string
  favicon: string
}

const pluginsGroupedLanguage = computed(
  () =>
    data.value?.reduce(
      (prev, item) => {
        if (!prev[item.meta.language]) {
          prev[item.meta.language] = []
        }

        prev[item.meta.language].push(item)

        return prev
      },
      {} as Record<string, PluginInfo[]>
    )
)
const languages = computed(() => [
  {
    label: t("all"),
    value: ""
  },
  ...Object.keys(pluginsGroupedLanguage.value ?? {}).map((item) => ({
    value: item,
    label: ISO6391.getNativeName(item)
  }))
])

const pluginsShow = computed(() =>
  Object.entries(pluginsGroupedLanguage.value ?? {})
    .filter(
      ([languageCode]) => !language.value || languageCode === language.value
    )
    .map(
      ([language, items]) =>
        [
          language,
          items
            .filter((item) => {
              let validMode = false

              switch (displayMode.value) {
                case "nsfw":
                  validMode = item.meta.isNSFW
                  break
                case "sfw":
                  validMode = !item.meta.isNSFW
                  break
                default:
                  validMode = true
                  break
              }

              if (!validMode) return false

              return (
                !search ||
                item.meta.name.includes(search.value) ||
                item.meta.id.includes(search.value) ||
                item.meta.author.includes(search.value) ||
                item.sender.includes(search.value) ||
                item.meta.description.includes(search.value)
              )
            })
            .sort((a, b) => {
              if (sortBy.value === "asc") {
                return b.meta.updatedAt - a.meta.updatedAt
              }

              return a.meta.updatedAt - b.meta.updatedAt
            })
        ] as const
    )
)
// ========== /search plugin =========
</script>
