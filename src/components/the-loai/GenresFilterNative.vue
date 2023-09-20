<template>
  <q-page-sticky
    expand
    position="top"
    class="w-auto bg-dark-page text-13px sm:text-14px z-9999 header-blur"
  >
    <q-toolbar class="font-family-poppins">
      <div class="w-full min-w-0 whitespace-nowrap">
        <div
          v-for="(item, index) in filter"
          :key="index"
          v-show="index === 0 || !showOnlyFirst"
          class="flex flex-nowrap"
        >
          <label class="whitespace-nowrap mt-2 text-gray-400 pr-2">{{
            item.type
          }}</label>

          <div
            v-if="isSelectMode(item)"
            class="w-full whitespace-normal min-w-0"
          >
            <div class="flex flex-nowrap w-full min-w-0">
              <div
                class="min-w-0 max-w-full overflow-x-auto scrollbar-hide max-h-[max(220px,50vh)]"
                :class="{
                  'whitespace-nowrap': !showFullGenres,
                  'overflow-y-scroll': showFullGenres,
                }"
              >
                <q-btn
                  v-for="{ path, name } in item.select"
                  :key="path"
                  no-caps
                  rounded
                  unelevated
                  outline
                  :to="{
                    ...route,
                    query: {
                      ...route.query,
                      page: undefined,
                    },
                    name: undefined,
                    path
                  }"
                  class="font-size-inherit text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
                  :class="{
                    '!text-main-3': pathEqual(
                      router.resolve(path).path,
                      route.path,
                    ),
                  }"
                  >{{ name }}</q-btn
                >
              </div>
              <q-btn
                v-if="!showFullGenres && item.select.length > 5"
                dense
                round
                @click="showFullGenres = true"
              >
                <i-fluent-chevron-down-24-regular class="size-1.5em" />
              </q-btn>
            </div>
            <!-- <q-btn></q-btn> -->
          </div>
          <div v-else class="display-table-cell whitespace-normal">
            <q-btn
              v-for="{ value, name } in item.items"
              :key="value"
              no-caps
              rounded
              unelevated
              outline
              :to="{
                ...route,
                query: {
                  ...route.query,
                  [item.key]: value,
                },
              }"
              class="font-size-inherit text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
              :class="{
                '!text-main-3': route.query[item.key] === value,
              }"
              >{{ name }}</q-btn
            >
          </div>
        </div>

        <q-separator v-show="showOnlyFirst" class="mb-1 opacity-50" />

        <q-btn
          v-for="item in filter.slice(1)"
          :key="item.type"
          v-show="showOnlyFirst"
          no-caps
          rounded
          unelevated
          outline
          class="font-size-inherit text-[rgba(255,255,255,0.86)] text-weight-normal my-1 !py-1 !px-3 min-h-0 mx-1"
          @click="showOnlyFirst = false"
        >
          {{ item.type }}
          <i-fluent-chevron-down-24-regular class="size-1.5em ml-1" />
        </q-btn>
      </div>
    </q-toolbar>
  </q-page-sticky>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import type { FilterQuery, FilterURI } from "raiku-pgs"
import { pathEqual } from "src/logic/path-equal"

import "@fontsource/poppins"

defineProps<{
  filter: readonly (FilterQuery | FilterURI)[]
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSelectMode(val: any): val is FilterURI {
  return val.select !== undefined
}

const router = useRouter()
const route = useRoute()

const showFullGenres = ref(false)
const showOnlyFirst = ref(true)
useEventListener(window, "scroll", () => {
  showFullGenres.value = false
  showOnlyFirst.value = true
})
</script>
