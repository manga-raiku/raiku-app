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
            <i-fluent-chevron-left-24-filled class="size-1.5em" />
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
            {{ modeEdit ? $t("xong") : $t("sua") }}
          </q-btn>
        </q-toolbar>
      </header>

      <main
        class="h-full min-h-0 flex-1 overflow-y-auto scrollbar-custom pb-50px"
      >
        <!-- button more download -->
        <q-item @click="showDownloadMore = true" clickable>
          <q-item-section>
            <q-item-label>{{ $t("tai-them-chuong-khac") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <i-fluent-chevron-right-24-regular class="size-1.5em" />
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
            <i-solar-check-circle-linear class="size-1.5em mr-1" />
            <span class="whitespace-nowrap">{{
              listEpRemove.length > 0 ? $t("bo-chon") : $t("chon-tat")
            }}</span>
          </q-btn>
          <q-btn
            no-caps
            unelevated
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
    full-width
    :model-value="showDownloadMore && !!allEp"
    @update:model-value="$event ? null : (showDownloadMore = false)"
  >
    <q-card
      v-if="allEp"
      class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px">
        {{ $t("count-chuong", [allEp.length]) }}
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
                class="bg-gray-400 bg-opacity-10 w-full text-light-200 text-opacity-90 text-weight-regular class=before:text-#fff before:text-opacity-20 px-4"
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
          <component
            :is="
              epsSelected.size > 0
                ? 'solar:close-circle-linear'
                : 'solar:check-circle-linear'
            "
            class="size-1.5em"
          />
          <span class="whitespace-nowrap">{{
            epsSelected.size > 0 ? $t("bo-chon") : $t("chon-tat")
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
          >{{ $t("tai-xuong") }}</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import type { API, ID } from "raiku-pgs"
import { Nettruyen, nettruyen } from "src/apis/nettruyen/runs/$"
import type { TaskDDEp, TaskDLEp } from "src/logic/download-manager"

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

const mapEp = computed<Map<ID, TaskDDEp | TaskDLEp> | undefined>(() => {
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

    if (!isTaskDLEp(result))
      lsEpDL.value.splice(
        lsEpDL.value.findIndex(
          (item) => item.ref.ep_id === result.ref.ep_id,
        ) >>> 0,
        1,
        result,
      )
  } catch (err) {
    if ((err as Error | undefined)?.message === "user_paused") return
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  }
}

const modeEdit = ref(false)
const listEpRemove = shallowRef<ID[]>([])
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
    spinnerColor: "white",
  })

  // load episodes
  const episodes = await nettruyen.getListChapters(meta.manga_id)

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
    const { mangaId, epId } = nettruyen.resolveUrlComicChapter(ep.path)
    const conf = await nettruyen.getComicChapter(mangaId, epId, false)
    // eslint-disable-next-line promise/catch-or-return
    IDMStore.download(metaMangaShowInfo.value, {
      path: ep.path,
      ep_id: ep.id,
      ep_name: ep.name,
      pages: conf.pages.map((item) => nettruyen.Servers[0].parse(item, conf)),
    }).then((result) => {
      if (lsEpDL.value && !isTaskDLEp(result)) {
        lsEpDL.value.splice(
          lsEpDL.value.findIndex(
            (item) => item.ref.ep_id === result.ref.ep_id,
          ) >>> 0,
          1,
          result,
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
