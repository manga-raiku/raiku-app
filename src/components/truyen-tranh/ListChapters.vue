<template>
  <section
    v-if="segments.length > 1"
    class="mx--2 overflow-auto scrollbar-custom whitespace-nowrap"
  >
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
  </section>

  <q-tab-panels
    v-model="tabActive"
    animated
    swipeable
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
        :ref="($el) => (ulPanelRef = ($el as HTMLUListElement))"
      >
        <li
          v-for="item in items"
          :key="item.path"
          class="px-2 py-2"
          :class="[
            classItem ?? 'col-6 col-sm-4 col-md-3',
            {
              'text-main': item.readed,
            },
          ]"
        >
          <router-link
            :to="item.path"
            class="block bg-#f8f8f8 bg-opacity-7.5 hover:bg-opacity-12 transition-background-color duration-200 rounded-md py-7px px-4 relative cursor-pointer"
            exact-active-class="!text-main reading text-weight-medium"
          >
            <h5 class="text-16px">{{ item.name }}</h5>
            <span v-if="item.update" class="text-gray-300"
              >{{ (tmp = dayjs(item.update)).fromNow() }} ({{
                tmp.format("dd DD/MM/YYYY")
              }})</span
            >
            <span
              v-if="item.readed"
              class="absolute top-2 right-2 flex items-center"
            >
              <Icon
                icon="fluent:checkmark-starburst-24-regular"
                width="1.3em"
                height="1.3em"
                class="mr-1"
              />
              <span class="<sm:display-none">Đã đọc</span>
            </span>
          </router-link>
        </li>
      </ul>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
import { Icon } from "@iconify/vue"
import { QBtn } from "quasar"
import dayjs from "src/logic/dayjs"

const props = defineProps<{
  classItem?: string
  classPanels?: string
  classPanel?: string

  focusTabActive?: boolean

  chapters: {
    path: string
    name: string
    update?: number
    readed?: boolean
  }[]
}>()
const emit = defineEmits<{
  (name: "change-tab"): void
}>()

const route = useRoute()

const segments = computed(() => {
  return unflat(props.chapters, 50).map((items) => {
    const [from, to] = [
      normalizeChName(items[0].name),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      normalizeChName(items.at(-1)!.name),
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
        0
      )
    : 0
)
watch(tabActive, () => emit("change-tab"))

const btnActiveRef = ref<QBtn>()
watch(
  () => btnActiveRef.value?.$el,
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

    const reading = ulPanelRef.querySelector(".reading") as HTMLElement | null
    if (reading) scrollYIntoView(reading)
  }, 70)
})

let tmp: dayjs.Dayjs
</script>

<style lang="scss" scoped>
.tabs:deep(.q-tabs__content) {
  justify-content: start !important;
}
</style>
