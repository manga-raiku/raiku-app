<template>
  <q-header
    v-if="searching"
    @update:model-value="emit('update:searching', $event)"
    class="bg-dark-page"
  >
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
      <div class="w-full flex items-center py-3">
        <div
          class="relative w-full flex items-center flex-nowrap py-3 bg-[#2a2a2a] rounded-[30px] h-[39px] <md:h-[35px]"
        >
          <input
            class="min-w-0 w-full bg-transparent placeholder-[#818181] focus-visible:outline-none pl-6"
            placeholder="Tìm kiếm"
            v-model="query"
            autofocus
            @keyup="query = ($event.target as HTMLInputElement).value"
            @keypress.enter="
              () => {
                router.push({
                  path: '/tim-kiem',
                  query: { query },
                })
                emit('update:searching', false)
              }
            "
            ref="inputRef"
          />
          <q-btn
            round
            class="text-[#aaa] h-full flex items-center"
            v-show="query"
            @click="query = ''"
          >
            <Icon icon="ep:close-bold" class="size-1.5em" />
          </q-btn>
          <q-btn
            round
            class="text-[#aaa] h-full flex items-center mr-2"
            type="submit"
            @click="
              () => {
                router.push({
                  path: '/tim-kiem',
                  query: { query },
                })
                emit('update:searching', false)
              }
            "
          >
            <Icon icon="fluent:search-24-regular" class="size-1.5em" />
          </q-btn>
        </div>
      </div>
    </q-toolbar>

    <div
      v-if="searching"
      class="fixed h-full w-full overflow-y-auto px-2 bg-dark-page scrollbar-custom"
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
                - {{ item.last_chapter }}
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
import { debounce } from "quasar"
import PreSearch from "src/apis/nettruyen/runs/pre-search"

const props = defineProps<{
  searching: boolean
}>()
const emit = defineEmits<{
  (name: "update:searching", value: boolean): void
}>()

const router = useRouter()
const route = useRoute()

const keyword = ref("")

const query = ref((route.query.query ?? "") + "")
const { data, loading, run } = useRequest(() => PreSearch(query.value,1), {
  manual: true,
})
watch(query, debounce(run, 300))

function onBack() {
  if (props.searching) emit("update:searching", false)
  else router.back()
}
function onClickItemPreLoad(
  item: Exclude<typeof data.value, undefined>[0],
  load?: boolean
) {
  if (load) {
    query.value = item.name
  } else {
    router.push(item.path)
  }
}

const inputRef = ref<HTMLInputElement>()
watch(inputRef, (input) => {
  if (!input) return
  setTimeout(() => input?.focus(), 70)
})
</script>

<style></style>
