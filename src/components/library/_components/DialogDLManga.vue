<template>
  <q-dialog
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="!!metaMangaShowInfo"
    @update:model-value="$event ? null : emit('update:model-value', null)"
  >
    <q-card
      v-if="metaMangaShowInfo"
      class="bg-dark-page h-full flex flex-col flex-nowrap"
    >
      <header>
        <q-toolbar>
          <q-btn round unelevated v-close-popup>
            <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
          </q-btn>

          <q-space />

          <div class="ellipsis text-16px text-weight-medium">
            {{ metaMangaShowInfo.manga_name }}
          </div>

          <q-space />

          <q-btn
            round
            unelevated
            no-caps
            class="text-weight-normal"
            @click="modeEdit = !modeEdit"
          >
            {{ modeEdit ? "Done" : "Edit" }}
          </q-btn>
        </q-toolbar>
      </header>

      <main
        class="h-full min-h-0 flex-1 overflow-y-auto scrollbar-custom pb-50px"
      >
        <!-- button more download -->
        <q-item @click="showDownloadMore = true" clickable>
          <q-item-section>
            <q-item-label>Download more episodes</q-item-label>
          </q-item-section>
          <q-item-section side>
            <Icon icon="fluent:chevron-right-24-regular" class="size-1.5em" />
          </q-item-section>
        </q-item>
        <!-- /button more download -->

        <ul class="mx-4">
          <li
            v-for="[ep_id, item] in mapEp"
            :key="item.ref.ep_id"
            class="py-2 flex flex-nowrap items-center"
          >
            <q-checkbox
              v-if="modeEdit"
              v-model="listEpRemove"
              dense
              :val="ep_id"
              class="mr-2"
            />
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
          </li>
        </ul>
      </main>

      <footer
        v-show="modeEdit"
        class="fixed bottom-0 left-0 w-full z-9999 bg-dark-page"
      >
        <q-toolbar>
          <q-btn
            no-caps
            unelevated
            class="w-1/2 text-weight-regular"
            @click="
              listEpRemove =
                listEpRemove.length > 0
                  ? []
                  : [...new Set([...listEpRemove, ...(mapEp?.keys() ?? [])])]
            "
          >
            <Icon icon="solar:check-circle-linear" class="size-1.5em mr-1" />
            <span class="whitespace-nowrap">{{
              listEpRemove.length > 0 ? "Unselect all" : "Select all"
            }}</span>
          </q-btn>
          <q-btn
            no-caps
            unelevated
            class="w-1/2 text-weight-regular"
            :loading="removing"
            @click="remove"
          >
            <Icon
              icon="solar:trash-bin-minimalistic-broken mr-1"
              class="size-1.5em"
            />
            Delete
          </q-btn>
        </q-toolbar>
      </footer>
    </q-card>
  </q-dialog>

  <q-dialog
    position="bottom"
    full-width
    :model-value="showDownloadMore && !!allEp"
    @update:model-value="$event ? null : (showDownloadMore = false)"
  >
    <q-card
      v-if="allEp"
      class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px">
        {{ allEp.length }} episodes
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <ListChapters
          :chapters="allEp"
          class-panels="px-1 overflow-y-auto scrollbar-custom"
        >
          <template #item="{ data }">
            <li class="px-1 py-1 col-3">
              <q-btn
                no-caps
                :outline="!mapEp?.has(data.id)"
                :disable="mapEp?.has(data.id)"
                class="bg-gray-400 bg-opacity-10 w-full text-light-200 text-opacity-90 text-weight-regular"
                :class="{
                  'text-blue': epsSelected.has(data),
                }"
                @click="
                  epsSelected.has(data)
                    ? epsSelected.delete(data)
                    : epsSelected.add(data)
                "
              >
                {{ parseFloat(data.name) }}
                <Icon
                  v-if="mapEp?.has(data.id)"
                  icon="iconoir:check"
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
          <Icon icon="solar:download-minimalistic-bold" class="size-1.5em" />
          Download
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
          <Icon
            :icon="
              epsSelected.size > 0
                ? 'solar:close-circle-linear'
                : 'solar:check-circle-linear'
            "
            class="size-1.5em"
          />
          <span class="whitespace-nowrap">{{
            epsSelected.size > 0 ? "Unselect all" : "Select all"
          }}</span>
        </q-btn>

        <q-btn
          no-caps
          unelevated
          color="blue"
          class="w-60%"
          :disable="epsSelected.size === 0"
          @click="download"
          :loading="downloading"
          >Download</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { SERVERS } from "src/apis/nettruyen/parsers/truyen-tranh/[slug]/[ep-id]"
import GetListChapters from "src/apis/nettruyen/runs/get-list-chapters"
import SlugChapChap from "src/apis/nettruyen/runs/truyen-tranh/[slug]-chap-[chap]"

const $q = useQuasar()
const IDMStore = useIDMStore()

const props = defineProps<{
  modelValue: (typeof IDMStore.listMangaSorted)[0] | null
}>()
const metaMangaShowInfo = toRef(props, "modelValue")
const emit = defineEmits<{
  (
    name: "update:model-value",
    value: (typeof IDMStore.listMangaSorted)[0] | null,
  ): void
}>()

interface TaskDDEp {
  ref: Awaited<ReturnType<typeof getListEpisodes>>[0]
  downloading?: boolean
  stop?: () => void
}
type TaskDLEp = Pick<
  ReturnType<typeof createTaskDownloadEpisode>,
  "ref" | "downloading" | "stop"
>

const lsEpDL = computedAsync<TaskDDEp[] | undefined>(async () => {
  const meta = metaMangaShowInfo.value

  if (meta) {
    return shallowReactive(
      await getListEpisodes(meta.manga_id).catch(() => []),
    ).map((ref) => ({ ref }))
  }
})
const lsEpDD = computed<TaskDLEp[] | undefined>(() => {
  const meta = metaMangaShowInfo.value
  if (!meta) return

  return [...(IDMStore.queue.get(meta.manga_id)?.values() ?? [])]
})

const mapEp = computed<Map<number, TaskDDEp | TaskDLEp> | undefined>(() => {
  if (!lsEpDD.value || !lsEpDL.value) return

  return new Map(
    [...(lsEpDL.value ?? []), ...lsEpDD.value]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_id, item]),
  )
})

async function resume(item: TaskDLEp | TaskDDEp) {
  if (!metaMangaShowInfo.value || !lsEpDL.value) return

  try {
    const result = await IDMStore.resumeDownload(metaMangaShowInfo.value, item)

    lsEpDL.value.splice(
      lsEpDL.value.findIndex((item) => item.ref.ep_id === result.ref.ep_id) >>>
        0,
      1,
      result as unknown as Omit<typeof result, "downloading"> & {
        downloading: boolean
      },
    )
  } catch (err) {
    if ((err as Error | undefined)?.message === "user_paused") return
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  }
}

const modeEdit = ref(false)
const listEpRemove = shallowRef<number[]>([])
const removing = ref(false)
async function remove() {
  if (!metaMangaShowInfo.value) return

  removing.value = true

  const meta = metaMangaShowInfo.value
  // eslint-disable-next-line camelcase
  const { manga_id } = meta
  await Promise.allSettled(
    // eslint-disable-next-line camelcase
    listEpRemove.value.map(async (ep_id) => {
      await IDMStore.deleteEpisode(manga_id, ep_id)
    }),
  )

  const storeTask = IDMStore.queue.get(manga_id)
  if (storeTask && storeTask?.size > 0)
    // eslint-disable-next-line camelcase
    listEpRemove.value.forEach((ep_id) => {
      // clear
      storeTask.delete(ep_id)
    })
  if (lsEpDL.value)
    lsEpDL.value = lsEpDL.value.filter((item) => {
      return !listEpRemove.value.includes(item.ref.ep_id)
    })

  if (mapEp.value?.size === 0) {
    IDMStore.listMangaSorted.splice(
      IDMStore.listMangaSorted.indexOf(meta) >>> 0,
      1,
    )
  }

  removing.value = false
}

// =========== show download more ==========
type MetaEpOnline = Awaited<ReturnType<typeof GetListChapters>>[0]
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
    spinnerColor: "white",
  })

  // load episodes
  const episodes = await GetListChapters(meta.manga_id)

  loader()

  allEp.value = episodes
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
  for (const ep of epsSelected) {
    const conf = await SlugChapChap(
      ep.path.split("/").slice(2).join("/"),
      false,
    )
    // eslint-disable-next-line promise/catch-or-return
    IDMStore.download(metaMangaShowInfo.value, {
      path: ep.path,
      ep_id: ep.id,
      ep_name: ep.name,
      pages: conf.pages.map((item) => SERVERS[0].parse(item, conf)),
    }).then((result) => {
      if (lsEpDD.value)
        lsEpDD.value.splice(
          lsEpDD.value.findIndex(
            (item) => item.ref.ep_id === result.ref.ep_id,
          ) >>> 0,
          1,
          result,
        )
      // eslint-disable-next-line no-useless-return
      return
    })
  }
  downloading.value = false

  showDownloadMore.value = false
}
</script>
