<template>
  <section class="display-table font-family-poppins">
    <div v-for="(item, index) in filter" :key="index" class="display-table-row">
      <label class="display-table-cell whitespace-nowrap mt-2 text-gray-400">{{
        item.type
      }}</label>

      <div v-if="item.select" class="display-table-cell">
        <q-btn
          v-for="item in item.select"
          :key="item.path"
          no-caps
          rounded
          unelevated
          outline
          :to="item.path"
          class="text-[rgba(255,255,255,0.86)] before:display-none text-weight-normal my-1 !py-1 !px-3 min-h-0"
          :class="{
            '!text-main-3 before:!display-block': pathEqual(
              router.resolve(item.path).path,
              route.path
            ),
          }"
          >{{ item.name }}</q-btn
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
          to="/the-loai/isekai-85"
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
        key: string
        select: {
          path: string
          name: string
        }[]
      }
    | {
        type: string
        items: {
          value: string
          name: string
        }[]
      }
  )[]
}>()

const route = useRoute()
const router = useRouter()
</script>
