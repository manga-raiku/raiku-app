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
          '!text-main-3 segment': tabActive === index,
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
          :key="item.path"
          :class="[classItem ?? 'col-6 col-sm-4 col-md-3']"
        >
          <router-link
            :to="item.path"
            class="flex flex-nowrap bg-#f8f8f8 bg-opacity-7.5 hover:bg-opacity-12 transition-background-color duration-200 rounded-md py-1 px-4 relative cursor-pointer"
            exact-active-class="!text-main reading text-weight-medium"
            :class="{
              'text-#eee text-opacity-70': readsChapter?.has(item.id),
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
import { SERVERS } from "src/apis/nettruyen/parsers/truyen-tranh/[slug]/[ep-id]"
import SlugChapChap from "src/apis/nettruyen/runs/truyen-tranh/[slug]-chap-[chap]"
import dayjs from "src/logic/dayjs"
import type { MetaManga, TaskDDEp, TaskDLEp } from "src/logic/download-manager"

const props = defineProps<{
  classItem?: string
  classPanels?: string
  classPanel?: string

  focusTabActive?: boolean

  readsChapter?: Set<number>
  mapOffline?: Map<number, TaskDDEp | TaskDLEp>
  metaManga?: MetaManga

  chapters: {
    id: number
    path: string
    name: string
    updated_at: number | null
  }[]

  noDownload?: boolean
}>()
const emit = defineEmits<{
  (name: "change-tab"): void
}>()
const slots = useSlots()

const route = useRoute()
const IDMStore = useIDMStore()

const segments = computed(() => {
  return unflat(props.chapters, 50).map((items) => {
    const [from, to] = [
      parseFloat(normalizeChName(items[0].name)),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseFloat(normalizeChName(items.at(-1)!.name)),
    ]

    return { from, to, items }
  })
})

const tabActive = ref(
  props.focusTabActive
    ? Math.max(
        segments.value.findIndex(({ items }) => {
          return items.some((item) => pathEqual(item.path, route.path))
        }),
        0,
      )
    : 0,
)
watch(tabActive, () => emit("change-tab"))

const btnActiveRef = ref<QBtn | QTab>()
watch(
  () => btnActiveRef.value?.$el,
  (segment) => {
    if (!segment) return

    setTimeout(() => {
      if (segment) scrollXIntoView(segment)
    }, 70)
  },
)

const ulPanelRef = ref<HTMLUListElement>()
watch(ulPanelRef, (ulPanelRef) => {
  if (!ulPanelRef) return

  setTimeout(() => {
    // ulPanelRef.querySelector(".reading")?.scrollIntoView({ behavior: 'smooth' })

    const reading = ulPanelRef.querySelector(".reading") as HTMLElement | null
    if (reading) scrollYIntoView(reading)
  }, 70)
})

const qTabsRef = ref<QTabs>()

function onWheelTabs(event: WheelEvent) {
  qTabsRef.value?.$el
    ?.querySelector(".q-tabs__content")
    ?.scrollBy({ left: event.deltaY * 2, behavior: "smooth" })
}

async function downloadEp(item: { path: string; id: number; name: string }) {
  const conf = await SlugChapChap(
    item.path.split("/").slice(2).join("/"),
    false,
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  IDMStore.download(props.metaManga!, {
    path: item.path,
    ep_id: item.id,
    ep_name: item.name,
    pages: conf.pages.map((item) => SERVERS[0].parse(item, conf)),
  })
}
</script>

<style lang="scss" scoped>
.tabs:deep(.q-tabs__content) {
  justify-content: start !important;
}
</style>
