<template>
  <q-btn
    no-caps
    rounded
    unelevated
    outline
    :to="parseRouteURI(item)"
    :title="item.title"
    class="font-size-inherit text-[rgba(255,255,255,0.86)] before:!hidden text-weight-normal my-1 !py-1 !px-3 min-h-0"
    :class="{
      '!text-sakura3': item.route.params[filterParam] === route.params.type
    }"
    >{{ item.name }}</q-btn
  >
</template>

<script lang="ts" setup>
import type { FilterURI } from "raiku-pgs"

defineProps<{
  filterParam: "type"
  item: FilterURI["select"][0]
}>()

const route = useRoute()

function parseRouteURI(filterItem: FilterURI["select"][0]) {
  return {
    ...filterItem.route,
    query: {
      ...filterItem.route.query,
      page: undefined
    },
    name: undefined,
    path: `/~${filterItem.route.params.sourceId}/genre/${
      filterItem.route.params.type ?? ""
    }`
  }
}
</script>
