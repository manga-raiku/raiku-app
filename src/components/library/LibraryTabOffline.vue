<template>
  <div v-if="IDMStore.loadingDataInMemory">loading...</div>
  <div v-else class="relative row">
    <div
      v-if="IDMStore.listMangaSorted.length > 0"
      v-for="item in IDMStore.listMangaSorted"
      :key="item.manga_id"
      class="col-4 col-sm-3 col-md-2 px-[10px] py-2"
      @click="metaMangaShowInfo = item"
    >
      <q-card class="transparent cursor-pointer">
        <ImageView :src="item.manga_image" />

        <div class="text-1em ellipsis">{{ item.manga_name }}</div>
        <div class="text-0.92em text-gray-300 text-opacity-90">
          ({{ item.count_ep }}/{{
            item.count_ep + (IDMStore.queue.get(item.manga_id)?.size ?? 0)
          }})
        </div>
      </q-card>
    </div>
    <div v-else class="text-center text-subtitle1 py-6 col-12">
      Chưa có tải xuống nào
    </div>
  </div>

  <q-dialog
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="!!metaMangaShowInfo"
    @update:model-value="$event ? null : (metaMangaShowInfo = undefined)"
  >
    <q-card v-if="metaMangaShowInfo" class="bg-dark-page">
      <q-header class="bg-dark-page">
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
      </q-header>

      <main class="pt-50px">
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
            v-for="[ep_id, item] in list"
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
                :downloading="item.downloading"
                @stop="item.stop"
                @resume="resume(item)"
              />
            </div>
          </li>
        </ul>
      </main>

      <q-footer :model-value="modeEdit" class="bg-dark-page">
        <q-toolbar>
          <q-btn
            no-caps
            unelevated
            class="w-1/2 text-weight-regular"
            @click="
              listEpRemove =
                listEpRemove.length === list?.size
                  ? []
                  : [...new Set([...listEpRemove, ...list.keys()])]
            "
          >
            <Icon icon="solar:check-circle-linear" class="size-1.5em mr-1" />
            <span class="whitespace-nowrap">{{
              listEpRemove.length === list?.size ? "Unselect all" : "Select all"
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
      </q-footer>
    </q-card>
  </q-dialog>

  <q-dialog
    position="bottom"
    full-width
    :model-value="showDownloadMore && !!allEpisodes"
    @update:model-value="$event ? null : (showDownloadMore = false)"
  >
    <q-card
      v-if="allEpisodes"
      class="h-full <md:!max-h-80vh sm:!max-h-70vh min-w-310px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px">
        {{ allEpisodes.length }} episodes
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <ListChapters
          :chapters="allEpisodes"
          class-panels="px-1 overflow-y-auto scrollbar-custom"
        >
          <template #item="{ data }">
            <li class="px-1 py-1 col-3">
              <q-btn
                no-caps
                :outline="!list.has(data.id)"
                :disable="list.has(data.id)"
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
                  v-if="list.has(data.id)"
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
          <q-badge floating>{{ list.size }}</q-badge>
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
import type { UnwrapRef } from "vue"
import GetListChapters from "src/apis/nettruyen/runs/get-list-chapters"
import SlugChapChap from "src/apis/nettruyen/runs/truyen-tranh/[slug]-chap-[chap]"
import { SERVERS } from "src/apis/nettruyen/parsers/truyen-tranh/[slug]/[ep-id]"

const IDMStore = useIDMStore()
const $q = useQuasar()

IDMStore.runLoadInMemory()

const metaMangaShowInfo = ref<(typeof IDMStore.listMangaSorted)[0]>()
const listEpDownloaded = ref<Awaited<ReturnType<typeof getListEpisodes>>>()
watch(
  metaMangaShowInfo,
  async (meta) => {
    console.log(meta)
    if (meta) {
      listEpDownloaded.value = shallowReactive(
        await getListEpisodes(meta.manga_id).catch(() => [])
      )
    } else {
      listEpDownloaded.value = void 0
    }
  },
  { immediate: true }
)

const listEpDownloading = computed(() => {
  const meta = metaMangaShowInfo.value
  if (!meta) return

  return [...(IDMStore.queue.get(meta.manga_id)?.values() ?? [])]
})

const list = computed(() => {
  if (!listEpDownloading.value || !listEpDownloaded.value) return

  return new Map(
    [
      ...(listEpDownloaded.value.map((ref) => ({ ref })) ?? []),
      ...(listEpDownloading.value as UnwrapRef<
        ReturnType<typeof createTaskDownloadEpisode>
      >[]),
    ]
      .sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
      .map((item) => [item.ref.ep_id, item])
  )
})

async function resume(item) {
  try {
    const { ref } = await IDMStore.resumeDownload(metaMangaShowInfo.value, item)
    listEpDownloaded.value.splice(
      listEpDownloaded.value.findIndex((item) => item.ep_id === ref.ep_id) >>>
        0,
      1,
      ref
    )
  } catch (err) {
    if (err?.message === "user_paused") return
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
  const { manga_id } = meta
  await Promise.allSettled(
    listEpRemove.value.map(async (ep_id) => {
      await IDMStore.deleteEpisode(manga_id, ep_id)
    })
  )

  const storeTask = IDMStore.queue.get(manga_id)
  if (storeTask?.size > 0)
    listEpRemove.value.forEach((ep_id) => {
      // clear
      storeTask.delete(ep_id)
    })
  listEpDownloaded.value = listEpDownloaded.value.filter((item) => {
    return !listEpRemove.value.includes(item.ep_id)
  })

  if (list.size === 0) {
    IDMStore.listMangaSorted.splice(
      IDMStore.listMangaSorted.indexOf(meta) >>> 0,
      1
    )
  }

  removing.value = false
}
// ===== download more =====

const showDownloadMore = ref(false)
const allEpisodes = shallowRef<Awaited<ReturnType<typeof GetListChapters>>[]>()
const epsSelected = shallowReactive<
  Set<Awaited<ReturnType<typeof GetListChapters>>>
>(new Set())

watch(showDownloadMore, async (state) => {
  allEpisodes.value = void 0
  epsSelected.clear()

  if (!state || !list.value) return

  const meta = metaMangaShowInfo.value
  if (!meta) return

  // get port

  const loader = $q.loading.show({
    spinnerColor: "white",
  })

  // load episodes
  const episodes = await GetListChapters(meta.manga_id)

  loader()

  allEpisodes.value = episodes
})

function selectAll() {
  allEpisodes.value?.forEach((item) => {
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
    const { pages } = await SlugChapChap(
      ep.path.split("/").slice(2).join("/"),
      false
    )
    IDMStore.download(metaMangaShowInfo.value, {
      path: ep.path,
      ep_id: ep.id,
      ep_name: ep.name,
      pages: pages.map((item) => SERVERS[0].parse(item)),
    }).then(({ ref }) => {
      listEpDownloaded.value.splice(
        listEpDownloaded.value.findIndex((item) => item.ep_id === ref.ep_id) >>>
          0,
        1,
        ref
      )
    })
  }
  downloading.value = false

  showDownloadMore.value = false
}
</script>
