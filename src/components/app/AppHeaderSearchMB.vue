<template>
  <q-header :model-value="searching" @update:model-value="emit('update:searching', $event)" class="bg-dark-page">
    <q-toolbar class="relative">
      <q-btn
        flat
        dense
        round
        class="mr-2"
        v-show="keyword || searching"
        @click="onBack"
      >
        <Icon icon="fluent:chevron-left-24-regular" width="25" height="25" />
      </q-btn>
      <div class="relative w-full">
        <input
          class="w-full bg-[#2a2a2a] placeholder-[#818181] h-[39px] rounded-[30px] focus-visible:outline-none pl-6"
          placeholder="Tìm kiếm"
          v-model="query"
          @keyup="query = ($event.target as HTMLInputElement).value"
          @focus="searching = true"
          @keypress.enter="onEnter"
        />
        <button
          class="text-[#aaa] absolute right-6 top-0 h-full flex items-center"
          v-show="query"
          @click="query = ''"
        >
          <Icon icon="ep:close-bold" />
        </button>
      </div>
    </q-toolbar>

    <div
      v-if="searching"
      class="fixed h-full w-full overflow-y-auto px-2 bg-dark-page"
    >
      <q-list dense>
        <q-item
          v-for="item in data"
          :key="item.path"
          clickable
          v-ripple
          @click="onClickItemPreLoad(item)"
        >
          <q-item-section avatar class="min-w-0">
            <Icon
              v-if="typeof item === 'object'"
              icon="fluent:search-24-regular"
            />
            <Icon v-else icon="fluent:history-24-regular" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="flex items-center">
              <div class="max-w-full line-clamp-1">
                {{ typeof item === "object" ? item.name : item }}
              </div>
              <div v-if="typeof item === 'object'" class="text-grey pl-2">
                - {{ item.chapter }}
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section
            avatar
            class="min-w-0"
            @click.stop.prevent="onClickItemPreLoad(item, true)"
          >
            <Icon icon="fluent:arrow-up-left-24-regular" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-header>
</template>

<script lang="ts" setup>
import PreSearch from "src/apis/runs/frontend/pre-search"
import { debounce, QInput } from "quasar"

const props = defineProps<{
  searching: boolean
}>()
const emit = defineEmits<{
  (name: "update:searching", value: boolean): void
}>()

const router = useRouter()

const keyword = ref("")

const query = ref("")
const { data, loading, run } = useRequest(() => PreSearch(query.value), {
  manual: true,
})
watch(query, debounce(run, 300))

function onBack() {
  if (props.searching) emit("update:searching", false)
  else router.back()
}
function onEnter() {
  router.push("/tim-kiem", {
    query: { query },
  })
}
function onClickItemPreLoad(item: (typeof data)[0], load: boolean) {
  if (load) {
    query.value = item.name
  } else {
    router.push(item.path)
  }
}
</script>

<style></style>
