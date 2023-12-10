<template>
  <form
    @submit.prevent="
      router.push({
        name: 'search',
        query: { query }
      })
    "
    class="relative md:min-w-[164px] md:w-full max-w-370px"
  >
    <q-input
      v-model="query"
      dense
      rounded
      outlined
      clearable
      class="font-weight-normal input-search bg-[rgba(255,255,255,0)] w-full"
      input-style="background-color: transparent"
      :placeholder="t('tim-kiem')"
      @focus="focusing = true"
      @blur="focusing = false"
      @keydown.stop
      ref="inputSearchRef"
    >
      <template #append>
        <q-separator vertical inset class="bg-[rgba(153,153,153,0.3)]" />
        <button
          type="submit"
          class="flex items-center"
          @click.stop.prevent="
            router.push({
              name: 'search',
              query: { query }
            })
          "
          @mousedown.stop.prevent
        >
          <q-icon name="search" class="pl-6 pr-4 cursor-pointer" />
        </button>
      </template>
    </q-input>

    <transition name="q-transition--fade">
      <ul
        class="absolute w-full bg-[rgba(0,0,0,.5)] backdrop-filter backdrop-blur-12px rounded-xl left-0 max-h-[80vh] overflow-y-auto scrollbar-custom pt-2 py-4 top-[calc(100%+8px)] !shadow-8"
        v-show="focusing"
        @click.stop.prevent
        @mousedown="
          (event: MouseEvent) => {
            if (event.button === 2) event.preventDefault()
          }
        "
      >
        <li
          v-if="query"
          class="px-4 mt-1 py-[0.5rem] flex items-center w-full justify-between"
        >
          <div>
            <span class="text-gray-400 mr-1"
              >{{ t("tim-kiem-_keyword") }}
            </span>
            <span class="font-bold truncate">{{ query }}</span>
          </div>

          <button class="key-enter" type="submit">
            <span>{{ t("enter") }}</span>
          </button>
        </li>
        <li
          v-if="searchLoading"
          v-for="i in 12"
          :key="i"
          class="flex mt-5 mx-4"
        >
          <q-responsive :ratio="267 / 400" class="w-[90px] rounded">
            <q-skeleton type="rect" class="absolute w-full h-full" />
          </q-responsive>

          <div class="ml-2 flex-1">
            <q-skeleton type="text" width="60%" />
            <q-skeleton type="text" width="100px" height="15px" />
          </div>
        </li>
        <template
          v-else-if="query && searchResult?.length"
          v-for="{ meta, promise } in searchResult"
          :key="meta.id"
        >
          <li class="relative text-gray-400 text-12px mx-4">{{ meta.name }}</li>
          <li v-if="!promise.value">
            <div class="w-full">
              <q-spinner size="1.5em" class="my-6 mx-10" />
            </div>
          </li>
          <li
            v-else-if="promise.value.ok && promise.value.data.length > 0"
            v-for="item in promise.value.data"
            :key="item.name"
            class="relative"
            v-ripple
          >
            <!-- !TODO: need fix -->
            <router-link :to="item.route" class="flex flex-nowrap mt-5 mx-4">
              <div>
                <q-img
                  no-spinner
                  :ratio="267 / 400"
                  :src="item.image"
                  referrerpolicy="no-referrer"
                  width="90px"
                  class="rounded"
                />
              </div>

              <div class="ml-2">
                <div class="text-subtitle1 text-weight-medium leading-normal">
                  {{ item.name }}
                </div>
                <div v-if="item.othername" class="text-12px text-gray-300 mt-1">
                  {{ item.othername }}
                </div>
                <div class="text-gray-500 mt-1">
                  {{ $t("chuong-name", [item.last_chapter]) }}
                </div>
              </div>
            </router-link>
          </li>
          <li v-else-if="promise.value.ok && promise.value.data.length === 0">
            <div
              class="text-gray-300 py-6 px-10 w-full text-center q-my-sm text-16px"
            >
              <div class="text-18px leading-normal text-white mb-1">
                {{ randomEmoji("sad") }}
              </div>

              {{ $t("khong-co-ket-qua") }}
            </div>
          </li>
          <li v-else>
            <div class="text-20px text-weight-normal q-my-sm">
              {{ $t("rat-tiec-da-xay-ra-loi") }}
            </div>
            <div
              class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
            >
              {{ promise.value.data + "" }}
            </div>
          </li>
        </template>
        <li v-else class="px-4 py-5 text-center text-gray-400 w-full">
          {{ query ? $t("khong-tim-thay") : $t("nhap-de-tim-kiem") }}
        </li>
      </ul>
    </transition>
  </form>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import { debounce, QInput } from "quasar"
import { randomEmoji } from "src/logic/emoji-charater"

// const props = defineProps<{
//   sourceId: string
// }>()
// key bind

const { t } = useI18n()

const router = useRouter()
const pluginStore = usePluginStore()

const allPlugins = computed(() =>
  pluginStore
    .getAllPlugins()
    .then((plugins) => plugins.map(({ id }) => pluginStore.get(id)))
)

const query = ref("")
const {
  data: searchResult,
  loading: searchLoading,
  runAsync
} = useRequest(
  () => {
    return allPlugins.value
      .then((plugins) => Promise.all(plugins))
      .then((plugins) =>
        Promise.all(
          plugins.map(({ meta, plugin }) => {
            return {
              meta,
              promise: computedAsync<
                | {
                    ok: true
                    data: Awaited<ReturnType<typeof plugin.searchQuickly>>
                  }
                | {
                    ok: false
                    data: unknown
                  }
              >(async () => {
                try {
                  return {
                    ok: true,
                    data: await plugin.searchQuickly(query.value, 1)
                  }
                } catch (err) {
                  return { ok: false, data: err }
                }
              })
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

const focusing = ref(false)

// key bind /
const inputSearchRef = ref<QInput>()
useEventListener(window, "keypress", (event) => {
  if (checkContentEditable(document.activeElement)) return

  if (event.code === "Slash") {
    event.preventDefault()
    inputSearchRef.value?.focus()
  }
})
</script>

<style lang="scss" scoped>
.input-search {
  :deep(.q-field__control) {
    height: 40px !important;
    input,
    input:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
    &:before {
      border-color: rgba(153, 153, 153, 0.3) !important;
    }

    &:after {
      border-width: 1px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.key-enter {
  color: #f6f6f7;
  forced-color-adjust: none;
  height: 23px;
  width: auto;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;

  &:hover {
    @apply pt-1;
  }

  span {
    background-color: #727d74;
    box-shadow: inset 0 -4px #202225;
    border: 1px solid hsl(220deg, 7.7%, 22.9%);
    padding: 3px 6px 4px;
    border-radius: 4px;
    min-width: 14px;
    min-height: 14px;
    height: 23px;
    color: #b9bbbe;
  }
}
</style>
