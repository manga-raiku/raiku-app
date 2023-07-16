<template>
  <section class="display-table font-family-poppins">
    <div v-for="(item, index) in filter" :key="index" class="display-table-row">
      <label class="display-table-cell whitespace-nowrap mt-2 text-gray-400">{{
        item.type
      }}</label>

      <div v-if="isSelectMode(item)" class="display-table-cell">
        <q-btn
          v-for="{ path, name } in item.select"
          :key="path"
          no-caps
          rounded
          unelevated
          outline
          :to="path"
          class="text-[rgba(255,255,255,0.86)] before:display-none text-weight-normal my-1 !py-1 !px-3 min-h-0"
          :class="{
            '!text-main-3 before:!display-block': pathEqual(
              router.resolve(path).path,
              route.path
            ),
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
              [item.key]: value,
            },
          }"
          class="text-[rgba(255,255,255,0.86)] before:display-none text-weight-normal my-1 !py-1 !px-3 min-h-0"
          :class="{
            '!text-main-3 before:!display-block':
              route.query[item.key] === value,
          }"
          >{{ name }}</q-btn
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { pathEqual } from "src/logic/path-equal"

import "@fontsource/poppins"

defineProps<{
  filter: (
    | {
        type: string
        select: {
          path: string
          name: string
        }[]
      }
    | {
        type: string
        key: string
        items: {
          value: string
          name: string
        }[]
      }
  )[]
}>()

const route = useRoute()
const router = useRouter()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSelectMode(val: any): val is {
  type: string
  select: {
    path: string
    name: string
  }[]
} {
  return val.select !== undefined
}
</script>
