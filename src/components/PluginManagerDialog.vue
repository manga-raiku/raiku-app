<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    full-height
  >
    <q-card
      class="h-full min-w-[min(500px,100%)] max-w-100% flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px flex items-center justify-between pl-7">
        {{ $t("trinh-quan-ly-plugin") }}

        <div>
          <q-btn unelevated round @click="triggerCheckUpdate">
            <i-solar-refresh-line-duotone class="size-1.5em" />
          </q-btn>
          <q-btn unelevated round v-close-popup>
            <i-ep-close-bold class="size-1.5em" />
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <q-list v-if="!error && data">
          <div class="flex items-center justify-between">
            <q-item
              clickable
              class="rounded-xl"
              @click="stateStore.showPluginAddDialog = true"
            >
              <q-item-section avatar class="min-w-0">
                <i-iconamoon-sign-plus-fill class="size-1.5em" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("them-plugin") }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item-section side class="mr--2" @click="showEdit = !showEdit">
              <q-btn rounded no-caps flat class="text-main-3">{{
                showEdit ? "Hủy" : "Sửa"
              }}</q-btn>
            </q-item-section>
          </div>

          <div v-if="!data.length" class="text-center py-6">
            {{ $t("khong-co-gi-ca") }}
          </div>
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
              <img :src="item.favicon" :alt="item.name" class="size-1.2em" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{ item.name }}
                <span class="text-0.8em text-gray-300">{{
                  $t("v-item-version", [item.version])
                }}</span>
                <q-badge v-if="item.devMode" rounded color="blue" class="ml-1"
                  >dev</q-badge
                >
              </q-item-label>
              <q-item-label lines="2" caption>{{
                item.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <i-eos-icons-bubble-loading
                v-if="updateMap.get(item.id)?.loading.value"
              />
              <template v-else-if="updateMap.get(item.id)?.status.value">
                <q-btn
                  v-if="updateMap.get(item.id)?.status.value?.ok"
                  no-caps
                  unelevated
                  rounded
                  stack
                  class="text-white"
                  @click.stop.prevent="onClickUpdate(item)"
                  @mousedown.stop
                >
                  <i-ic-outline-update
                    class="mx-auto icon"
                    :class="{
                      rotating: updatingMap.has(item.id)
                    }"
                  />
                  <div class="text-0.8em">
                    {{
                      $t("cap-nhat-v", [
                        (
                          updateMap.get(item.id)?.status.value
                            ?.data as unknown as any
                        )?.version
                      ])
                    }}
                  </div>
                </q-btn>
                <div v-else class="relative">
                  <i-codicon-error class="text-red-400" />
                  <q-tooltip>{{
                    updateMap.get(item.id)?.status.value?.data + ""
                  }}</q-tooltip>
                </div>
              </template>

              <q-btn
                v-if="showEdit"
                round
                @click.stop.prevent="removePlugin(item)"
                @mousedown.stop
              >
                <i-iconamoon-sign-minus-circle-light
                  class="text-red-300 text-1.5em"
                />
              </q-btn>
            </q-item-section>
          </q-item>
          <!-- Noncomliant -->
        </q-list>
        <div v-else-if="error" class="px-6 py-5">
          {{ error }}
        </div>
        <div v-else class="flex items-center justify-center py-6">
          <q-spinner size="40px" color="main-3" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import type { Package } from "raiku-pgs/plugin"
import type { PackageDisk } from "stores/plugin"
import type { ShallowRef } from "vue"

defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<(name: "update:modelValue", value: boolean) => void>()

const pluginStore = usePluginStore()
const stateStore = useStateStore()
const $q = useQuasar()
const { t } = useI18n()

const { data, error } = useRequest(() =>
  pluginStore.getAllPlugins().then((list) => shallowReactive(list))
)
pluginStore.busses.on("install plugin", (meta) => {
  data.value?.splice(
    data.value.findIndex((item) => item.id === meta.id) >>> 0,
    1
  )
  data.value?.unshift(meta)
})
pluginStore.busses.on("remove plugin", (id) => {
  data.value?.splice(data.value.findIndex((item) => item.id === id) >>> 0, 1)
})

const counter = ref(0)
const updateMap = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = counter.value
  const map = shallowReactive(
    new Map<
      string,
      {
        readonly loading: Ref<boolean>
        readonly status: ShallowRef<{
          ok: boolean
          data: Package | Error
        } | null>
      }
    >()
  )
  data.value?.forEach(({ id }) => {
    const status = shallowRef<{
      ok: boolean
      data: Package | Error
    } | null>(null)
    const loading = ref(true)

    pluginStore
      .checkForUpdate(id)
      .finally(() => (loading.value = false))
      .then((meta) => {
        // eslint-disable-next-line promise/always-return
        if (meta)
          status.value = {
            ok: true,
            data: meta
          }
        else status.value = null
      })
      .catch((err) => {
        status.value = {
          ok: false,
          data: err as Error
        }
      })

    map.set(id, { loading, status })
  })

  return map
})
const triggerCheckUpdate = () => counter.value++
const updatingMap = shallowReactive(new Set<string>())

async function onClickUpdate(item: PackageDisk) {
  updatingMap.add(item.id)
  await pluginStore.updatePlugin(item.id)
  updateMap.value.delete(item.id)
  updatingMap.delete(item.id)
}

async function removePlugin(item: PackageDisk) {
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
  }).onOk(async () => {
    await pluginStore.removePlugin(item.id)
    $q.notify({
      message: t("da-xoa-plugin", [item.name])
    })
  })
}
// ===== edit ====
const showEdit = ref(false)
</script>

<style lang="scss" scoped>
.icon {
  .rotating {
    animation: rotating 1s infinite ease-in-out;
    @keyframes rotating {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
