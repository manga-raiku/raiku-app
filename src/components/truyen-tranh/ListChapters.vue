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
          '!text-sakura3 segment': tabActive === index
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
          '!text-sakura3 segment': tabActive === index,
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
          <q-btn
            flat
            no-caps
            rounded
            :to="item.route"
            :replace="APP_STANDALONE"
            class="w-full bg-#f8f8f8 bg-opacity-7.5 py-1 px-4"
            :disable="
              offline &&
              (!mapOffline?.get(item.route.params.chap) ||
                isTaskDLEp(mapOffline?.get(item.route.params.chap)))
            "
            :class="{
              'text-#eee text-opacity-70': mapEpRead?.has(item.id),
              '!text-sakura reading text-weight-medium':
                CYPRESS ||
                route.fullPath === router.resolve(item.route).fullPath
            }"
          >
            <div class="flex-1 min-w-0 text-left">
              <h5 class="text-14px ellipsis">
                {{ $t("ch-name", [item.name]) }}
              </h5>
              <span v-if="item.updated_at" class="text-gray-300">{{
                dayjs(item.updated_at).fromNow()
              }}</span>
            </div>
            <div class="mr--2 flex justify-end">
              <!-- <span
                v-if="mapEpRead?.has(item.id)"
                class="mr--2 flex items-center"
              >
                <i-fluent-checkmark-starburst-24-regular
                  width="1.3em"
                  height="1.3em"
                  class="mr-1"
                />
                <span class="<sm:!hidden">{{ $t("da-doc") }}</span>
              </span> -->

              <span v-if="!noDownload" @click.stop.prevent>
                <BtnDownload
                  :model-value="mapOffline?.get(item.route.params.chap)"
                  @update:model-value="
                    mapOffline?.delete(item.route.params.chap)
                  "
                  :comic="item.route.params.comic ?? null"
                  :ep-param="item.route.params.chap"
                  :can-download="true"
                  :disable="!comic?.data"
                  @action:download="downloadEp(item)"
                />
              </span>
            </div>
            <!-- {{ mapOffline?.get(item.id) }} -->

            <q-linear-progress
              v-if="mapEpRead?.has(item.id)"
              :value="
                mapEpRead!.get(item.id)!.current_page /
                mapEpRead!.get(item.id)!.max_page
              "
              rounded
              color="sakura3"
              size="3px"
            />
          </q-btn>
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
import { QBtn, QTab, QTabs } from "quasar"
import type { Chapter, Comic, RouteComic } from "raiku-pgs/plugin"
import { APP_STANDALONE } from "src/constants"
import dayjs from "src/logic/dayjs"
import type { TaskDDEp, TaskDLEp } from "src/logic/download-manager"
import { isTaskDLEp } from "src/logic/download-manager"

const props = defineProps<{
  classItem?: string
  classPanels?: string
  classPanel?: string

  focusTabActive?: boolean

  mapEpRead?: Awaited<
    ReturnType<ReturnType<typeof useHistoryStore>["getMapEpRead"]>
  >
  mapOffline?: Map<string, TaskDDEp | TaskDLEp>
  offline: boolean
  comic?: {
    data: Comic | null | (() => Promise<Comic>)
    manga_id?: string
    route: RouteComic | null
  }

  chapters: readonly Chapter[]

  noDownload?: boolean
}>()
const emit = defineEmits<{
  (name: "change-tab"): void
  (name: "downloaded", value: TaskDDEp): void
}>()
const slots = useSlots()

const route = useRoute()
const router = useRouter()
const IDMStore = useIDMStore()
const pluginStore = usePluginStore()
const CYPRESS = process.env.CYPRESS

const segments = computed(() => {
  return unflat(props.chapters, 50).map((items) => {
    const [from, to] = [
      parseFloat(items[0].name) || items[0].name,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseFloat(items.at(-1)!.name) || items.at(-1)!.name
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
  if (!props.comic?.route || !props.comic?.data)
    return console.warn("[downloadEp]: can't run because ", props.comic)

  const { plugin } = await pluginStore.get(props.comic.route.params.sourceId)

  const conf = await plugin.getComicChapter(
    item.route.params.comic,
    item.route.params.chap,
    false
  )

  const task = await IDMStore.download(
    props.comic.route,
    typeof props.comic.data === "function"
      ? await props.comic.data()
      : props.comic.data,
    conf,
    item.name,
    item.route.params.chap,
    await plugin["servers:parse"](0, conf)
  ).catch((err) => {
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
