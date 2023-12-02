<template>
  <teleport to="body">
    <header
      v-if="searching"
      v-show="activated"
      class="fixed top-0 left-0 w-full bg-dark-page z-9999"
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
          <i-fluent-chevron-left-24-regular width="25" height="25" />
        </q-btn>
        <div class="w-full flex items-center py-2">
          <div
            class="relative w-full flex items-center flex-nowrap py-3 bg-[#2a2a2a] rounded-[30px] h-[39px] <md:h-[35px]"
          >
            <input
              class="min-w-0 w-full bg-transparent placeholder-[#818181] focus-visible:outline-none !pl-6"
              :placeholder="$t('tim-kiem')"
              v-model="query"
              autofocus
              @keyup="query = ($event.target as HTMLInputElement).value"
              @keypress.enter="
                () => {
                  router.push({
                    name: 'search',
                    query: { query }
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
              <i-ep-close-bold class="size-1.5em" />
            </q-btn>
            <q-btn
              round
              class="text-[#aaa] h-full flex items-center mr-2"
              type="submit"
              @click="
                () => {
                  router.push({
                    name: 'search',
                    query: { query }
                  })
                  emit('update:searching', false)
                }
              "
            >
              <i-fluent-search-24-regular class="size-1.5em" />
            </q-btn>
          </div>
        </div>
      </q-toolbar>

      <div
        v-if="searching"
        class="fixed h-full w-full overflow-y-auto px-2 bg-dark-page scrollbar-custom"
      >
        <q-list dense>
          <template v-for="{ meta, promise } in searchResult" :key="meta.id">
            <div class="relative text-gray-400 text-12px">{{ meta.name }}</div>
            <q-item
              v-for="item in promise.value"
              :key="item.name"
              clickable
              v-ripple
              @click="onClickItemPreLoad(item)"
            >
              <q-item-section avatar class="min-w-0">
                <i-fluent-search-24-regular v-if="typeof item === 'object'" />
                <i-fluent-history-24-regular v-else />
              </q-item-section>
              <q-item-section>
                <q-item-label class="flex items-center">
                  <div class="max-w-full line-clamp-1">
                    {{ typeof item === "object" ? item.name : item }}
                  </div>
                  <div
                    v-if="typeof item === 'object'"
                    class="text-gray-500 pl-2"
                  >
                    - {{ $t("chuong-name", [item.last_chapter]) }}
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section
                avatar
                class="min-w-0"
                @click.stop.prevent="onClickItemPreLoad(item, true)"
              >
                <i-fluent-arrow-up-left-24-regular />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </header>
  </teleport>
</template>

<script lang="ts" setup>
import { debounce } from "quasar"
import type { API } from "raiku-pgs/plugin"

const props = defineProps<{
  searching: boolean
}>()
const emit = defineEmits<{
  (name: "update:searching", value: boolean): void
}>()

const router = useRouter()
const route = useRoute()
const pluginStore = usePluginStore()

const activated = useActivated()

const allPlugins = computed(() =>
  pluginStore
    .getAllPlugins()
    .then((plugins) => plugins.map(({ id }) => pluginStore.get(id)))
)

const keyword = ref("")

const query = ref((route.query.query ?? "") + "")
const { data: searchResult, runAsync } = useRequest(
  () => {
    return allPlugins.value
      .then((plugins) => Promise.all(plugins))
      .then((plugins) =>
        Promise.all(
          plugins.map(({ meta, plugin }) => {
            return {
              meta,
              promise: computedAsync<
                Awaited<ReturnType<typeof plugin.searchQuickly>> | undefined
              >(() => plugin.searchQuickly(query.value, 1))
            }
          })
        )
      )
  },
  {
    manual: true
  }
)
watch(query, debounce(runAsync, 1000))

function onBack() {
  if (props.searching) emit("update:searching", false)
  else router.back()
}
function onClickItemPreLoad(
  item: Awaited<ReturnType<API["searchQuickly"]>>[0],
  load?: boolean
) {
  if (load) {
    query.value = item.name
  } else {
    void router.push(item.route)
    emit("update:searching", false)
  }
}

const inputRef = ref<HTMLInputElement>()
watch(inputRef, (input) => {
  if (!input) return
  setTimeout(() => input?.focus(), 70)
})
</script>
