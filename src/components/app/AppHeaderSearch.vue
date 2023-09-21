<template>
  <form
    @submit.prevent="router.push(`/search?query=${query}`)"
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
          @click.stop.prevent="router.push({
            name: 'search',
            query: {query}
          })"
          @mousedown.stop.prevent
        >
          <q-icon name="search" class="pl-6 pr-4 cursor-pointer" />
        </button>
      </template>
    </q-input>

    <transition name="q-transition--fade">
      <ul
        class="absolute w-full bg-dark-page left-0 max-h-[80vh] overflow-y-auto scrollbar-custom pb-4 top-[calc(100%+8px)] !shadow-8"
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
        <li
          v-else-if="searchResult?.length"
          v-for="item in searchResult"
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
              <div class="text-subtitle1 text-weight-medium">
                {{ item.name }}
              </div>
              <div v-if="item.othername" class="text-12px">
                {{ item.othername }}
              </div>
              <div class="text-gray-500">{{ item.last_chapter }}</div>
            </div>
          </router-link>
        </li>
        <li v-else class="px-4 py-5 text-center text-gray-400 w-full">
          {{ query ? $t("khong-tim-thay") : $t("nhap-de-tim-kiem") }}
        </li>
      </ul>
    </transition>
  </form>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import { debounce } from "perfect-debounce"
import { QInput } from "quasar"
import type { API } from "raiku-pgs"

// key bind

const { t } = useI18n()

const router = useRouter()
const pluginStore = usePluginStore()

const query = ref("")
const {
  data: searchResult,
  loading: searchLoading,
  runAsync,
} = useRequest(
  () => {
    return pluginStore
      .get("nettruyen")
      .then((res) => res.plugin.searchQuickly(query.value, 1))
  },
  {
    manual: true,
  },
)
watch(query, debounce(runAsync, 300))

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
