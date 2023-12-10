<template>
  <section v-if="showToolbar" class="font-family-poppins flex flex-nowrap">
    <div v-for="(item, index) in filter.slice(0, 3)" :key="index" class="col">
      <q-btn
        class="w-full max-w-120px mx-auto"
        no-wrap
        no-caps
        unelevated
        color="dark-4"
        @click="showStateStore.set(item.type, true)"
      >
        <div class="ellipsis">
          {{ item.type }}
        </div>
        <i-fluent-chevron-down-24-regular class="ml-1" />
      </q-btn>
    </div>
  </section>

  <q-dialog
    v-for="(item, index) in filter"
    :key="index"
    :model-value="showStateStore.get(item.type)"
    @update:model-value="showStateStore.set(item.type, $event)"
    position="bottom"
    no-route-dismiss
    class="children:!px-0"
    full-width
  >
    <q-card flat class="w-full pt-3 !max-h-[60vh]">
      <q-card-section class="py-0 flex items-center justify-between">
        <div class="text-subtitle1 mx-1">{{ item.type }}</div>

        <q-btn dense flat no-caps class="text-weight-normal">{{
          $t("dat-lai")
        }}</q-btn>
      </q-card-section>

      <q-card-section class="row">
        <div v-if="isSelectMode(item)" class="row">
          <div
            v-for="{ path, name } in item.select"
            :key="path"
            class="px-1 py-1"
            :class="{
              col: item.select.length < 4,
              'col-4 col-sm-3 col-md-4': item.select.length >= 4
            }"
          >
            <q-btn
              no-caps
              no-wrap
              rounded
              unelevated
              outline
              :to="{
                ...route,
                query: {
                  ...route.query,
                  page: undefined
                },
                name: undefined,
                path
              }"
              class="py-2 bg-[#292929] text-weight-normal w-full ease-bg ellipsis"
              :class="{
                '!text-sakura3': pathEqual(
                  router.resolve(path).path,
                  route.path
                )
              }"
            >
              <div class="ellipsis">{{ name }}</div>
            </q-btn>
          </div>
        </div>
        <div v-else class="row">
          <div
            v-for="{ value, name } in item.items"
            :key="value"
            class="px-1 py-1"
            :class="{
              col: item.items.length < 4,
              'col-4 col-sm-3 col-md-4': item.items.length >= 4
            }"
          >
            <q-btn
              no-caps
              no-wrap
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
              class="py-2 bg-[#292929] text-weight-normal w-full ease-bg"
              :class="{
                '!text-sakura3': route.query[item.key] === value
              }"
            >
              <div class="ellipsis">{{ name }}</div>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-btn flat no-caps class="w-full py-2 mb-2" v-close-popup>{{
        $t("huy")
      }}</q-btn>
    </q-card>
  </q-dialog>

  <!-- dialog full -->
  <q-dialog
    :model-value="showFull"
    @update:model-value="emit('update:show-full', $event)"
    position="bottom"
    no-route-dismiss
    class="children:!px-0"
    full-width
  >
    <q-card flat class="w-full pt-3 !max-h-[80vh] scrollbar-custom">
      <template v-for="(item, index) in filter" :key="index">
        <q-card-section class="py-0 flex items-center justify-between">
          <div class="text-subtitle1 mx-1">{{ item.type }}</div>

          <q-btn dense flat no-caps class="text-weight-normal">{{
            $t("dat-lai")
          }}</q-btn>
        </q-card-section>

        <q-card-section class="row">
          <div v-if="isSelectMode(item)" class="row">
            <div
              v-for="{ path, name } in item.select"
              :key="path"
              class="px-1 py-1"
              :class="{
                col: item.select.length < 4,
                'col-4 col-sm-3 col-md-4': item.select.length >= 4
              }"
            >
              <q-btn
                no-caps
                no-wrap
                unelevated
                :to="{
                  ...route,
                  query: {
                    ...route.query,
                    page: undefined
                  },
                  name: undefined,
                  path
                }"
                class="py-2 bg-[#292929] text-weight-normal w-full ease-bg ellipsis"
                :class="{
                  '!text-sakura': pathEqual(
                    router.resolve(path).path,
                    route.path
                  )
                }"
              >
                <div class="ellipsis">{{ name }}</div>
              </q-btn>
            </div>
          </div>
          <div v-else class="row">
            <div
              v-for="{ value, name } in item.items"
              :key="value"
              class="px-1 py-1"
              :class="{
                col: item.items.length < 4,
                'col-4 col-sm-3 col-md-4': item.items.length >= 4
              }"
            >
              <q-btn
                no-caps
                no-wrap
                unelevated
                :to="{
                  ...route,
                  query: {
                    ...route.query,
                    [item.key]: value
                  }
                }"
                class="py-2 bg-[#292929] text-weight-normal w-full ease-bg"
                :class="{
                  '!text-sakura': route.query[item.key] === value
                }"
              >
                <div class="ellipsis">{{ name }}</div>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </template>
      <q-btn flat no-caps class="w-full py-2 mb-2" v-close-popup>{{
        $t("huy")
      }}</q-btn>
    </q-card>
  </q-dialog>
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

  showToolbar: boolean
  showFull: boolean
}>()
const emit = defineEmits<{
  (name: "update:show-full", value: boolean): void
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

const showStateStore = shallowReactive<Map<string, boolean>>(new Map())
</script>
