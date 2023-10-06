<template>
  <div v-if="IDMStore.lsingComicOnDisk" class="row">
    <CardVerticalSKT
      v-for="i in 12"
      :key="i"
      class="col-12 col-sm-6 px-2 pb-4"
    />
  </div>
  <div v-else class="relative row">
    <div class="col-12 flex justify-end">
      <q-btn
        dense
        rounded
        no-caps
        :label="editMode ? $t('xong') : $t('sua')"
        @click="editMode = !editMode"
      />
    </div>

    <div
      v-if="IDMStore.listComicOnDisk.size > 0"
      v-for="[, item] in IDMStore.listComicOnDisk"
      :key="item.manga_id"
      class="col-4 col-sm-3 col-md-2 px-[10px] py-2"
      @click="metaMangaShowInfo = item"
    >
      <q-card class="transparent cursor-pointer">
        <div class="relative">
          <ImageView :src="item.manga_image" />
          <div
            v-if="editMode"
            class="absolute w-full h-full top-0 left-0 bg-#000 bg-opacity-50"
          >
            <q-radio
              :model-value="mangaSelected.has(item.manga_id) ? '1' : undefined"
              @click="
                mangaSelected.has(item.manga_id)
                  ? mangaSelected.delete(item.manga_id)
                  : mangaSelected.add(item.manga_id)
              "
              val="1"
              color="white        "
              class="absolute top-1 right-1 z-10"
            />
          </div>
        </div>

        <div class="text-1em ellipsis">{{ item.manga_name }}</div>
        <div class="text-0.92em text-gray-300 text-opacity-90">
          {{
            $t("a-slash-b", [
              item.count_ep,
              item.count_ep + (IDMStore.queue.get(item.manga_id)?.size ?? 0)
            ])
          }}
        </div>
      </q-card>
    </div>
    <div v-else class="text-center text-subtitle1 py-6 col-12">
      {{ $t("chua-co-tai-xuong-nao") }}
    </div>
  </div>

  <DialogDLManga v-model="metaMangaShowInfo" />

  <teleport to="body">
    <q-page-sticky
      v-if="visible && editMode"
      position="bottom"
      expand
      :offset="[0, 0]"
      class="z-9999 bg-dark-page"
    >
      <q-toolbar>
        <q-btn
          no-caps
          unelevated
          class="w-1/2 text-weight-regular"
          @click="mangaSelected.size > 0 ? mangaSelected.clear() : selectAll()"
        >
          <i-solar-check-circle-linear class="size-1.5em mr-1" />
          <span class="whitespace-nowrap">{{
            mangaSelected.size > 0 ? $t("bo-chon") : $t("chon-tat")
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
    </q-page-sticky>
  </teleport>
</template>

<script lang="ts" setup>
import type { ID } from "raiku-pgs/plugin"
import type { MetaMangaAndCountOnDisk } from "stores/IDM"

const props = defineProps<{
  visible?: boolean
}>()

const IDMStore = useIDMStore()

watch(
  () => props.visible,
  (visible) => {
    if (visible !== false) IDMStore.runLoadInMemory()
  },
  { immediate: true }
)

const editMode = ref(false)
const mangaSelected = shallowReactive<Set<ID>>(new Set())

const metaMangaShowInfo = ref<MetaMangaAndCountOnDisk | null>(null)

function selectAll() {
  // eslint-disable-next-line camelcase
  IDMStore.listComicOnDisk.forEach(({ manga_id }) => {
    mangaSelected.add(manga_id)
  })
}
const removing = ref(false)
async function remove() {
  removing.value = true
  // eslint-disable-next-line camelcase
  for (const manga_id of mangaSelected) {
    await deleteManga(manga_id)
  }
  IDMStore.listComicOnDisk.forEach((item, index) => {
    if (mangaSelected.has(item.manga_id)) IDMStore.listComicOnDisk.delete(index)
  })
  removing.value = false
}
</script>
