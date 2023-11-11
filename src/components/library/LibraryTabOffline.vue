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
      v-for="[comic, item] in IDMStore.listComicOnDisk"
      :key="comic"
      class="col-4 col-sm-3 col-md-2 px-[10px] py-2"
      @click="metaMangaShowInfo = item"
    >
      <q-card class="transparent cursor-pointer">
        <div class="relative">
          <ImageView :src="item.image" />
          <div
            v-if="editMode"
            class="absolute w-full h-full top-0 left-0 bg-#000 bg-opacity-50"
          >
            <q-radio
              :model-value="mangaSelected.has(item.route) ? '1' : undefined"
              @click="
                mangaSelected.has(item.route)
                  ? mangaSelected.delete(item.route)
                  : mangaSelected.add(item.route)
              "
              val="1"
              color="white        "
              class="absolute top-1 right-1 z-10"
            />
          </div>
        </div>

        <div class="text-1em ellipsis">{{ item.name }}</div>
        <div class="text-0.92em text-gray-300 text-opacity-90">
          {{
            $t("a-slash-b", [
              item.count_ep,
              item.count_ep +
                (IDMStore.queue.get(item.route.params.comic)?.size ?? 0)
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
      v-if="activated && visible && editMode"
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
          <i-solar-close-circle-linear
            v-if="mangaSelected.size > 0"
            class="size-1.5em"
          />
          <i-solar-check-circle-linear v-else class="size-1.5em" />
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
import type { RouteComic } from "raiku-pgs/plugin"
import type { ComicAndCountOnDisk } from "src/stores/IDM"

const props = defineProps<{
  visible?: boolean
}>()

const IDMStore = useIDMStore()

const activated = useActivated()

watch(
  () => props.visible,
  (visible) => {
    if (visible !== false) void IDMStore.runLoadInMemory()
  },
  { immediate: true }
)

const editMode = ref(false)
const mangaSelected = shallowReactive<Set<RouteComic>>(new Set())

const metaMangaShowInfo = ref<ComicAndCountOnDisk | null>(null)

function selectAll() {
  IDMStore.listComicOnDisk.forEach(({ route }) => {
    mangaSelected.add(route)
  })
}
const removing = ref(false)
async function remove() {
  removing.value = true
  for (const {
    params: { comic }
  } of mangaSelected) {
    await deleteManga(comic)
  }
  IDMStore.listComicOnDisk.forEach(({ route }, index) => {
    if (mangaSelected.has(route)) IDMStore.listComicOnDisk.delete(index)
  })
  removing.value = false
}
</script>
