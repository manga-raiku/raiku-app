<template>
  <div v-if="IDMStore.loadingDataInMemory">loading...</div>
  <div v-else class="relative row">
    <div
      v-for="item in IDMStore.listMangaSorted"
      :key="item.manga_id"
      class="col-4 col-sm-3 col-md-2 px-[10px] py-2"
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
  </div>

  <q-dialog
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="true"
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

          <q-btn round unelevated no-caps class="text-weight-normal"
            >Edit</q-btn
          >
        </q-toolbar>
      </q-header>

      <main class="pt-50px">
        <ul class="mx-4">
          <li v-for="item in list" :key="item.ref.ep_id" class="py-2">
            <EpControl
              :data="item.ref"
              :downloading="item.downloading"
              @stop="item.stop"
              @resume="IDMStore.resumeDownload(item)"
            />
          </li>
        </ul>
      </main>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const IDMStore = useIDMStore()

IDMStore.runLoadInMemory()

Object.assign(window, { IDMStore })

const metaMangaShowInfo = computed(() => IDMStore.listMangaSorted[0])
const listEpDownloaded = computedAsync(() => {
  const meta = metaMangaShowInfo.value
  if (!meta) return

  return getListEpisodes(meta.manga_id)
})

const listEpDownloading = computed(() => {
  const meta = metaMangaShowInfo.value
  if (!meta) return

  return IDMStore.queue.get(meta.manga_id)
})

const list = computed(() => {
  return [
    ...(listEpDownloading.value?.values() ?? []),
    ...(listEpDownloaded.value?.map((ref) => ({ ref })) ?? []),
  ].sort((a, b) => b.ref.start_download_at - a.ref.start_download_at)
})
</script>
