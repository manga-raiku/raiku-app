<template>
  <q-toolbar class="font-family-poppins">
    <div class="w-full min-w-0 whitespace-nowrap">
      <div
        v-for="(item, index) in filters"
        :key="index"
        v-show="index === 0 || !showOnlyFirst"
        class="flex flex-nowrap"
      >
        <label class="whitespace-nowrap mt-2 text-gray-400 pr-2">{{
          item.type
        }}</label>

        <div v-if="index === 0" class="w-full whitespace-normal min-w-0">
          <div class="flex flex-nowrap w-full min-w-0">
            <div
              class="min-w-0 max-w-full overflow-x-auto scrollbar-hide max-h-[max(220px,50vh)]"
              :class="{
                'whitespace-nowrap': !showFullGenres,
                'overflow-y-scroll': showFullGenres
              }"
              ref="overflowRefs"
            >
              <BtnFilterURI
                v-if="isSelectMode(item)"
                v-for="item2 in item.select"
                :key="item2.name"
                :filter-param="filterParam"
                :item="item2"
              />
              <BtnFilterQuery
                v-else
                v-for="item2 in item.items"
                :key="item2.value"
                :filter-key="item.key"
                :item="item2"
              />
            </div>
            <q-btn
              v-if="
                !showFullGenres &&
                (isSelectMode(item) ? item.select : item.items).length > 5
              "
              dense
              round
              unelevated
              @click="showFullGenres = true"
            >
              <i-fluent-chevron-down-24-regular class="size-1.5em" />
            </q-btn>
          </div>
          <!-- <q-btn></q-btn> -->
        </div>
        <div v-else class="display-table-cell whitespace-normal">
          <BtnFilterURI
            v-if="isSelectMode(item)"
            v-for="item2 in item.select"
            :key="item2.name"
            filter-param="type"
            :item="item2"
          />
          <BtnFilterQuery
            v-else
            v-for="item2 in item.items"
            :key="item2.value"
            :filter-key="item.key"
            :item="item2"
          />
        </div>
      </div>

      <q-separator v-show="showOnlyFirst" class="mb-1 opacity-50" />

      <q-btn
        v-for="item in filters.slice(1)"
        :key="item.type"
        v-show="showOnlyFirst"
        no-caps
        rounded
        unelevated
        outline
        class="font-size-inherit text-[rgba(255,255,255,0.86)] text-weight-normal my-1 !py-1 !px-3 min-h-0 mx-1"
        :class="{
          '!text-sakura3': getValueFilter(item)
        }"
        @click="showOnlyFirst = false"
      >
        {{ getValueFilter(item) ?? item.type }}
        <i-fluent-chevron-down-24-regular class="size-1.5em ml-1" />
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import type { FilterQuery, FilterURI } from "raiku-pgs/plugin"

import "@fontsource/poppins"

const props = defineProps<{
  filters: readonly (FilterQuery | FilterURI)[]
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSelectMode(val: any): val is FilterURI {
  return val.select !== undefined
}
function getValueFilter(item: FilterQuery | FilterURI) {
  return isSelectMode(item)
    ? item.select.find(
        (item) => item.route.params.type === route.params[filterParam]
      )?.name
    : item.items.find((item2) => item2.value === route.query[item.key])?.name
}

const route = useRoute()
const filterParam = "type"

const showFullGenres = ref(false)
const showOnlyFirst = ref(true)
useEventListener(window, "scroll", () => {
  showFullGenres.value = false
  showOnlyFirst.value = true
})

const overflowRefs = shallowReactive<HTMLDivElement[]>([])
watchImmediate(
  () => {
    if (props.filters.length === 0) return

    if (isSelectMode(props.filters[0])) {
      return route.params[filterParam]
    }

    return route.query[props.filters[0].key]
  },
  async () => {
    await nextTick()
    setTimeout(() => {
      const el = overflowRefs[0]?.querySelector(".\\!text-sakura3") as
        | HTMLDivElement
        | undefined

      if (!el) return console.warn("can't find element active")

      if (showFullGenres.value) scrollYIntoView(el)
      else scrollXIntoView(el)
    }, 70)
  }
)
</script>
