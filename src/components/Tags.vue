<template>
  <router-link
    v-if="flat"
    v-for="item in items"
    :key="item.name"
    :to="
      item.route.name === 'genre'
        ? {
            ...item.route,
            name: undefined,
            path: `/~${item.route.params!.sourceId}/genre/${
              item.route.params!.type ?? ''
            }`
          }
        : item.route
    "
    class="text-gray-300"
  >
    {{ $t("tag-_val", [item.name]) }}
  </router-link>
  <div v-else class="flex items-center font-family-poppins">
    <i-fluent-tag-24-regular :rotate="3" width="20" height="20" class="mr-1" />
    <q-btn
      v-for="item in items"
      :key="item.name"
      :to="
        item.route.name === 'genre'
          ? {
              ...item.route,
              name: undefined,
              path: `/~${item.route.params!.sourceId}/genre/${
                item.route.params!.type ?? ''
              }`
            }
          : item.route
      "
      no-caps
      rounded
      unelevated
      class="text-sakura2 text-opacity-50 min-h-0 px-2 bg-light-100 bg-opacity-10 text-13px my-1 mx-1"
      >{{ $t("tag-_val", [item.name.replace(/ /g, "_")]) }}</q-btn
    >
  </div>
</template>

<script lang="ts" setup>
import type { RouteGenre } from "raiku-pgs/plugin"

defineProps<{
  items: readonly { name: string; route: RouteGenre }[]
  flat?: boolean
}>()
</script>
