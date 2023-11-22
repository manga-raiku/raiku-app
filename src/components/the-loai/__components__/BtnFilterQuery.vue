<template>
  <q-btn
    no-caps
    rounded
    unelevated
    outline
    :to="parseRouteQuery(filterKey, item)"
    :title="item.title"
    class="font-size-inherit text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
    :class="{
      '!text-sakura3': route.query[filterKey] === item.value
    }"
    >{{ item.name }}</q-btn
  >
</template>

<script lang="ts" setup>
import type { FilterQuery } from "raiku-pgs"

defineProps<{
  filterKey: string
  item: FilterQuery["items"][0]
}>()

const route = useRoute()

function parseRouteQuery(key: string, filterItem: FilterQuery["items"][0]) {
  return {
    ...route,
    query: {
      ...route.query,
      [key]: filterItem.value
    },
    name: undefined
  }
}
</script>
