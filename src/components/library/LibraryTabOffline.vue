<template>
  <div v-if="IDMStore.loadingDataInMemory" class="row">
    <CardVerticalSKT
      v-for="i in 12"
      :key="i"
      class="col-12 col-sm-6 px-2 pb-4"
    />
  </div>
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

  <DialogDLManga v-model="metaMangaShowInfo" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  visible?: boolean
}>()

const IDMStore = useIDMStore()

watch(
  () => props.visible,
  (visible) => {
    if (visible !== false) IDMStore.runLoadInMemory()
  },
  { immediate: true },
)

const metaMangaShowInfo = ref<(typeof IDMStore.listMangaSorted)[0] | null>(null)
</script>
