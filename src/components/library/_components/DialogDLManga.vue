<template>
  <q-dialog
    :maximized="!$q.screen.gt.sm"
    :full-height="$q.screen.gt.sm"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="!!metaMangaShowInfo"
    @update:model-value="$event ? null : emit('update:model-value', null)"
  >
    <q-card
      v-if="metaMangaShowInfo"
      class="bg-dark-page h-full flex flex-col flex-nowrap min-w-[min(500px,100%)] max-w-100%"
    >
      <header>
        <q-toolbar>
          <q-btn round unelevated v-close-popup>
            <i-fluent-chevron-left-24-filled class="size-1.5em" />
          </q-btn>

          <q-space />

          <div class="ellipsis text-16px text-weight-medium">
            {{ metaMangaShowInfo.name }}
          </div>

          <q-space />

          <q-btn
            round
            unelevated
            no-caps
            class="text-weight-normal"
            @click="modeEdit = !modeEdit"
          >
            {{ modeEdit ? $t("xong") : $t("sua") }}
          </q-btn>
        </q-toolbar>
      </header>

      <main
        class="h-full min-h-0 flex-1 overflow-y-auto scrollbar-custom pb-50px"
      >
        <!-- button more download -->
        <q-item
          @click="showDownloadMore = true"
          clickable
          :disable="!networkStore.isOnline"
        >
          <q-item-section>
            <q-item-label>{{ $t("tai-them-chuong-khac") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <i-fluent-chevron-right-24-regular class="size-1.5em" />
          </q-item-section>
        </q-item>
        <!-- /button more download -->

        <ul class="mx-4">
          <q-item
            v-for="[ep_param, item] in mapEp"
            :key="ep_param"
            clickable
            v-ripple
            :to="{
              name: 'comic chap',
              params: {
                ...item.ref.route.params,
                chap: item.ref.ep_param
              }
            }"
            class="!px-2 rounded-xl"
          >
            <q-item-section v-if="modeEdit" side>
              <q-checkbox
                v-model="listEpRemove"
                dense
                :val="ep_param"
                class="mr-2"
              />
            </q-item-section>
            <q-item-section>
              <div class="w-full min-w-0">
                <EpControl
                  :data="item.ref"
                  :downloading="
                    // eslint-disable-next-line vue/no-deprecated-filter
                    item.downloading as unknown as boolean | undefined
                  "
                  @stop="item.stop"
                  @resume="resume(item)"
                />
              </div>
            </q-item-section>
          </q-item>
        </ul>
      </main>

      <footer
        v-show="modeEdit"
        class="fixed md:absolute bottom-0 left-0 w-full z-9999 bg-dark-page"
      >
        <q-toolbar>
          <q-btn
            no-caps
            unelevated
            rounded
            class="w-1/2 text-weight-regular"
            @click="
              listEpRemove =
                listEpRemove.length > 0
                  ? []
                  : [...new Set([...listEpRemove, ...(mapEp?.keys() ?? [])])]
            "
          >
            <i-solar-close-circle-linear
              v-if="listEpRemove.length > 0"
              class="size-1.5em"
            />
            <i-solar-check-circle-linear v-else class="size-1.5em" />
            <span class="whitespace-nowrap">{{
              listEpRemove.length > 0 ? $t("bo-chon") : $t("chon-tat")
            }}</span>
          </q-btn>
          <q-btn
            no-caps
            unelevated
            rounded
            class="w-1/2 text-weight-regular text-red"
            :loading="removing"
            @click="remove"
          >
            <i-solar-trash-bin-minimalistic-broken class="size-1.5em mr-1" />
            {{ $t("xoa") }}
          </q-btn>
        </q-toolbar>
      </footer>
    </q-card>
  </q-dialog>

  <q-dialog
    position="bottom"
    :full-width="!$q.screen.gt.sm"
    :model-value="showDownloadMore && !!allEp"
    @update:model-value="$event ? null : (showDownloadMore = false)"
  >
    <q-card
      v-if="allEp"
      class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-[min(500px,100%)] max-w-100% flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px">
        {{ $t("count-chuong", [allEp.length]) }}
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <ListChapters
          :chapters="allEp"
          :comic="{
            data: null,
            manga_id: metaMangaShowInfo?.manga_id,
            route: metaMangaShowInfo?.route ?? null
          }"
          :offline="!networkStore.isOnline"
          class-panels="px-1 overflow-y-auto scrollbar-custom"
        >
          <template #item="{ data }">
            <li class="px-1 py-1 col-3">
              <q-btn
                no-caps
                rounded
                :outline="!mapEp?.has(data.id)"
                :disable="mapEp?.has(data.id)"
                class="bg-gray-400 bg-opacity-10 w-full text-light-400 text-opacity-90 text-weight-regular class=before:text-#fff before:text-opacity-20 px-4"
                :class="{
                  'text-blue': epsSelected.has(data)
                }"
                @click="
                  epsSelected.has(data)
                    ? epsSelected.delete(data)
                    : epsSelected.add(data)
                "
              >
                {{ parseFloat(data.name) || data.name }}
                <i-iconoir-check
                  v-if="mapEp?.has(data.id)"
                  class="absolute top-1 left-1 size-1.2em text-green-400"
                />
              </q-btn>
            </li>
          </template>
        </ListChapters>
      </q-card-section>
      <q-card-section
        class="flex flex-nowrap items-center justify-between !py-0"
      >
        <q-btn no-caps stack unelevated class="min-w-15% text-weight-regular">
          <i-solar-download-minimalistic-bold class="size-1.5em" />
          {{ $t("tai-xuong") }}
          <q-badge v-if="mapEp && mapEp.size > 0" floating>{{
            epsSelected.size
          }}</q-badge>
        </q-btn>
        <q-btn
          no-caps
          stack
          unelevated
          class="min-w-15% text-weight-regular"
          @click="epsSelected.size > 0 ? unSelectAll() : selectAll()"
        >
          <i-solar-close-circle-linear
            v-if="epsSelected.size > 0"
            class="size-1.5em"
          />
          <i-solar-check-circle-linear v-else class="size-1.5em" />
          <span class="whitespace-nowrap">{{
            epsSelected.size > 0 ? $t("bo-chon") : $t("chon-tat")
          }}</span>
        </q-btn>

        <q-btn
          no-caps
          unelevated
          rounded
          color="blue"
          class="w-60%"
          :disable="epsSelected.size === 0"
          @click="download"
          :loading="downloading"
          >{{ $t("tai-xuong") }}</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import type { API, ID } from "raiku-pgs/plugin"
import type { TaskDDEp, TaskDLEp } from "src/logic/download-manager"
import type { ComicAndCountOnDisk } from "stores/IDM"

const $q = useQuasar()
const IDMStore = useIDMStore()
const pluginStore = usePluginStore()
const networkStore = useNetworkStore()

const props = defineProps<{
  modelValue: ComicAndCountOnDisk | null
}>()
const metaMangaShowInfo = toRef(props, "modelValue")
const emit = defineEmits<{
  (name: "update:model-value", value: ComicAndCountOnDisk | null): void
}>()

const lsEpDL = computedAsync<TaskDDEp[] | undefined>(async () => {
  const meta = metaMangaShowInfo.value

  if (meta) {
    return shallowReactive(
      (await getListEpisodes(meta.route.params.comic).catch(() => [])).map(
        (ref) => ({
          ref
        })
      )
    )
  }
})
const lsEpDD = computed<TaskDLEp[] | undefined>(() => {
  const meta = metaMangaShowInfo.value
  if (!meta) return

  return [...(IDMStore.queue.get(meta.route.params.comic)?.values() ?? [])]
})

const mapEp = computed<Map<ID, TaskDDEp | TaskDLEp> | undefined>(() => {
  if (!lsEpDD.value || !lsEpDL.value) return

  return new Map(
    [...(lsEpDL.value ?? []), ...lsEpDD.value]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_param, item])
  )
})

async function resume(item: TaskDLEp | TaskDDEp) {
  if (!metaMangaShowInfo.value || !lsEpDL.value) return

  try {
    const result = await IDMStore.resumeDownload(
      metaMangaShowInfo.value,
      item.ref.ep_name,
      item.ref.ep_param,
      item
    )

    if (!isTaskDLEp(result))
      lsEpDL.value.splice(
        lsEpDL.value.findIndex(
          (item) => item.ref.ep_param === result.ref.ep_param
        ) >>> 0,
        1,
        result
      )
  } catch (err) {
    if ((err as Error | undefined)?.message === "user_paused") return
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  }
}

const modeEdit = ref(false)
const listEpRemove = shallowRef<string[]>([])
const removing = ref(false)
async function remove() {
  if (!metaMangaShowInfo.value) return

  removing.value = true

  const meta = metaMangaShowInfo.value
  const { route } = meta
  await Promise.allSettled(
    // eslint-disable-next-line camelcase
    listEpRemove.value.map(async (ep_param) => {
      await IDMStore.deleteEpisode(route.params.comic, ep_param)
    })
  )

  const storeTask = IDMStore.queue.get(route.params.comic)
  if (storeTask && storeTask?.size > 0)
    // eslint-disable-next-line camelcase
    listEpRemove.value.forEach((ep_param) => {
      // clear
      storeTask.delete(ep_param)
    })
  if (lsEpDL.value)
    lsEpDL.value = lsEpDL.value.filter((item) => {
      return !listEpRemove.value.includes(item.ref.ep_param)
    })

  if (mapEp.value?.size === 0) {
    IDMStore.listComicOnDisk.delete(route.params.comic)
  }

  removing.value = false
}

// =========== show download more ==========
type MetaEpOnline = Awaited<ReturnType<API["getListChapters"]>>[0]
const showDownloadMore = ref(false)
const allEp = shallowRef<MetaEpOnline[]>()
const epsSelected = shallowReactive<Set<MetaEpOnline>>(new Set())

watch(showDownloadMore, async (state) => {
  allEp.value = undefined
  epsSelected.clear()

  if (!state) return

  const meta = metaMangaShowInfo.value
  if (!meta) return

  // get port

  const loader = $q.loading.show({
    spinnerColor: "white"
  })

  try {
    // load episodes
    const episodes = await (
      await pluginStore.get(meta.route.params.sourceId)
    ).plugin.getListChapters(meta.manga_id, meta.route.params.comic)
    allEp.value = episodes
  } catch (err) {
    $q.notify({
      message: err + ""
    })
  }
  loader()
})

function selectAll() {
  allEp.value?.forEach((item) => {
    epsSelected.add(item)
  })
}
function unSelectAll() {
  epsSelected.clear()
}

const downloading = ref(false)
async function download() {
  if (!metaMangaShowInfo.value) return

  downloading.value = true

  const { plugin } = await pluginStore.get(
    metaMangaShowInfo.value.route.params.sourceId
  )

  for (const ep of epsSelected) {
    const { comic, chap } = ep.route.params
    const conf = await plugin.getComicChapter(comic, chap, false)
    void IDMStore.download(
      metaMangaShowInfo.value.route,
      metaMangaShowInfo.value,
      conf,
      ep.name,
      chap,
      await plugin["servers:parse"](0, conf)
    ).then((result) => {
      if (lsEpDL.value && !isTaskDLEp(result)) {
        lsEpDL.value.splice(
          lsEpDL.value.findIndex(
            (item) => item.ref.ep_param === result.ref.ep_param
          ) >>> 0,
          1,
          result
        )
      }

      // eslint-disable-next-line no-useless-return
      return
    })
  }
  downloading.value = false

  showDownloadMore.value = false
}
</script>
