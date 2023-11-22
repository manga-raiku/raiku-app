<template>
  <section class="display-table font-family-poppins">
    <div
      v-for="(item, index) in filters"
      :key="index"
      class="display-table-row"
    >
      <label
        class="display-table-cell whitespace-nowrap mt-2 text-gray-400 pr-2"
        >{{ item.type }}</label
      >

      <div v-if="isSelectMode(item)" class="display-table-cell">
        <q-btn
          v-for="{ route: route2, name } in item.select"
          :key="name"
          no-caps
          rounded
          unelevated
          outline
          :to="{
            ...route2,
            query: {
              ...route2.query,
              page: undefined
            },
            name: undefined
          }"
          class="text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
          :class="{
            '!text-sakura3': route2.params.type === route.params.type
          }"
          >{{ name }}</q-btn
        >
      </div>
      <div v-else class="display-table-cell">
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
              [item.key]: value
            }
          }"
          class="text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
          :class="{
            '!text-sakura3': route.query[item.key] === value
          }"
          >{{ name }}</q-btn
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { FilterQuery, FilterURI } from "raiku-pgs/plugin"

import "@fontsource/poppins"

defineProps<{
  filters: readonly (FilterQuery | FilterURI)[]
}>()

const route = useRoute()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSelectMode(val: any): val is FilterURI {
  return val.select !== undefined
}
</script>
