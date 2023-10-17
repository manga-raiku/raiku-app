<template>
  <section v-if="segments.length > 1" class="py-1">
    <q-tabs
      v-model="tabActive"
      narrow-indicator
      no-caps
      @wheel.prevent="onWheelTabs"
      ref="qTabsRef"
    >
      <q-tab
        v-for="({ from, to }, index) in segments"
        :key="`${from}-${to}`"
        :name="index"
        :label="$t('ch-from-to', [from, to])"
        class="rounded-30px text-[rgba(255,255,255,0.86)] bg-[#fbe0ef] bg-opacity-8 text-weight-light font-family-poppins !min-h-32px mx-2"
        :class="{
          '!text-main-3 segment': tabActive === index
        }"
        :ref="
          ($el: QTab) => {
            if (tabActive === index) btnActiveRef = $el
          }
        "
      />
    </q-tabs>
    <!-- <ScrollDimPart class="overflow-auto whitespace-nowrap">
      <q-btn
        v-for="({ from, to }, index) in segments"
        :key="`${from}-${to}`"
        :label="`Ch. ${from} - ${to}`"
        no-caps
        rounded
        unelevated
        class="text-[rgba(255,255,255,0.86)] bg-[#fbe0ef] bg-opacity-8 text-weight-light font-family-poppins !min-h-32px mx-2"
        :class="{
          '!text-main-3 segment': tabActive === index,
        }"
        :ref="($el: QBtn) => {
        if (tabActive === index) btnActiveRef = $el
      }"
        @click="tabActive = index"
      />
    </ScrollDimPart> -->
  </section>

  <q-tab-panels
    v-model="tabActive"
    animated
    swipeable
    infinite
    keep-alive
    class="transparent children:overflow-visible flex-0"
    :class="classPanels"
  >
    <q-tab-panel
      v-for="({ items }, index) in segments"
      :key="index"
      :name="index"
      class="px-0"
      :class="classPanel"
    >
      <ul
        class="row mx--2"
        :ref="($el) => (ulPanelRef = $el as HTMLUListElement)"
      >
        <li
          v-if="!slots.item"
          v-for="item in items"
          class="px-2 py-1"
          :key="item.name"
          :class="[classItem ?? 'col-6 col-sm-4 col-md-3']"
        >
          <router-link
            :to="item.route"
            class="flex flex-nowrap bg-#f8f8f8 bg-opacity-7.5 hover:bg-opacity-12 transition-background-color duration-200 rounded-md py-1 px-4 relative cursor-pointer"
            exact-active-class="!text-main reading text-weight-medium"
            :class="{
              'text-#eee text-opacity-70': readsChapter?.has(item.id)
            }"
          >
            <div class="flex-1 min-w-0">
              <h5 class="text-14px ellipsis">
                {{ $t("ch-name", [item.name]) }}
              </h5>
              <span v-if="item.updated_at" class="text-gray-300">{{
                dayjs(item.updated_at).fromNow()
              }}</span>
            </div>
            <div class="mr--2 flex justify-end">
              <span
                v-if="readsChapter?.has(item.id)"
                class="mr--2 flex items-center"
              >
                <i-fluent-checkmark-starburst-24-regular
                  width="1.3em"
                  height="1.3em"
                  class="mr-1"
                />
                <span class="<sm:!hidden">{{ $t("da-doc") }}</span>
              </span>

              <span v-if="!noDownload" @click.stop.prevent>
                <BtnDownload
                  :model-value="mapOffline?.get(item.id)"
                  @update:model-value="mapOffline?.delete(item.id)"
                  :manga-id="metaManga?.manga_id ?? null"
                  :ep-id="item.id"
                  :can-download="true"
                  :disable="!sourceId"
                  @action:download="downloadEp(item)"
                />
              </span>
            </div>
            <!-- {{ mapOffline?.get(item.id) }} -->
          </router-link>
        </li>

        <slot
          v-else
          name="item"
          v-for="item in items"
          :key="item.id"
          :data="item"
        />
      </ul>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
import type { QBtn } from "quasar"
import { QTab, QTabs } from "quasar"
import type { Chapter, ID } from "raiku-pgs/plugin"
import dayjs from "src/logic/dayjs"
import type { MetaManga, TaskDDEp, TaskDLEp } from "src/logic/download-manager"

const props = defineProps<{
  classItem?: string
  classPanels?: string
  classPanel?: string

  focusTabActive?: boolean

  readsChapter?: Set<ID>
  mapOffline?: Map<ID, TaskDDEp | TaskDLEp>
  metaManga?: MetaManga

  chapters: readonly Chapter[]

  noDownload?: boolean
  sourceId: string | null
}>()
const emit = defineEmits<{
  (name: "change-tab"): void
  (name: "downloaded", value: TaskDDEp): void
}>()
const slots = useSlots()

const route = useRoute()
const IDMStore = useIDMStore()
const pluginStore = usePluginStore()

const segments = computed(() => {
  return unflat(props.chapters, 50).map((items) => {
    const [from, to] = [
      parseFloat((items[0].name)) || items[0].name,
      parseFloat((items.at(-1)!.name)) || items.at(-1)!.name
    ]

    return { from, to, items }
  })
})

const tabActive = ref(
  props.focusTabActive
    ? Math.max(
        segments.value.findIndex(({ items }) => {
          return items.some(
            (item) =>
              item.route.params.chap === route.params.chap &&
              item.route.params.comic === route.params.comic
          )
        }),
        0
      )
    : 0
)
watch(tabActive, () => emit("change-tab"))

const btnActiveRef = ref<QBtn | QTab>()
watch(
  () => btnActiveRef.value?.$el as HTMLDivElement,
  (segment) => {
    if (!segment) return

    setTimeout(() => {
      if (segment) scrollXIntoView(segment)
    }, 70)
  }
)

const ulPanelRef = ref<HTMLUListElement>()
watch(ulPanelRef, (ulPanelRef) => {
  if (!ulPanelRef) return

  setTimeout(() => {
    // ulPanelRef.querySelector(".reading")?.scrollIntoView({ behavior: 'smooth' })

    const reading = ulPanelRef.querySelector(".reading")
    if (reading) scrollYIntoView(reading as HTMLDivElement)
  }, 70)
})

const qTabsRef = ref<QTabs>()

function onWheelTabs(event: WheelEvent) {
  qTabsRef.value?.$el
    ?.querySelector(".q-tabs__content")
    ?.scrollBy({ left: event.deltaY * 2, behavior: "smooth" })
}

async function downloadEp(item: Chapter) {
  if (!props.sourceId) return

  const { plugin } = await pluginStore.get(props.sourceId)

  const conf = await plugin.getComicChapter(
    item.route.params.comic,
    item.route.params.chap,
    false
  )


  const task = await IDMStore.download(props.metaManga!, {
    ep_id: item.id,
    ep_name: item.name,
    ep_param: item.route.params.chap,
    pages: await plugin["servers:parse"](0, conf, APP_MODE)
  }).catch((err) => {
    if (err?.message === "user_paused") return
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  })

  if (task && !isTaskDLEp(task)) emit("downloaded", task)
}
</script>

<style lang="scss" scoped>
.tabs:deep(.q-tabs__content) {
  justify-content: start !important;
}
</style>
