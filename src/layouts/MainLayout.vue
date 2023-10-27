<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      v-if="execScriptMeta($q, route.meta?.hiddenHeader) !== true"
      :reveal="route.meta.revealHeader"
      class="bg-dark-page py-1 px-2 header-blur"
      :class="{
        '!bg-transparent': route.meta?.transparentHeader
      }"
    >
      <q-toolbar>
        <q-btn
          v-if="$q.screen.gt.sm"
          dense
          flat
          round
          icon="menu"
          class="mr-5"
          @click="showDrawer = !showDrawer"
        />

        <AppHeaderIconApp :no-name="$q.screen.lt.sm" class="mr-8" />

        <!-- <template v-if="$q.screen.md || $q.screen.gt.md">
          <router-link
            to="/"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Trang chủ</router-link
          >
          <router-link
            to="/genre"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Thể loại</router-link
          >
          <router-link
            to="/bang-xep-hang/ngay"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Bảng xếp hạng</router-link
          >
        </template> -->

        <q-space />

        <template v-if="$q.screen.md || $q.screen.gt.md">
          <AppHeaderSearch
            :source-id="(route.params.sourceId as string | undefined) ?? null"
          />
          <AppHeaderGithub />
        </template>
        <template v-else>
          <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
            <q-icon name="search" />
          </q-btn>
          <AppHeaderSearchMB v-model:searching="showSearchMB" />
        </template>

        <AppHeaderFollows v-if="MODE !== 'capacitor'" />
        <AppHeaderHistory v-if="MODE !== 'capacitor'" />
        <AppHeaderNotify />

        <AppHeaderUser />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.sm"
      :model-value="hideDrawer ? showDrawer : true"
      @update:model-value="hideDrawer ? (showDrawer = $event) : undefined"
      :mini="hideDrawer ? showDrawer : false"
      show-if-above
      :width="250"
      :breakpoint="500"
      :overlay="hideDrawer"
      :behavior="hideDrawer ? 'mobile' : undefined"
      class="bg-dark-page overflow-visible column flex-nowrap"
    >
      <q-toolbar v-if="hideDrawer">
        <q-btn
          dense
          flat
          round
          icon="menu"
          class="mr-5"
          @click="showDrawer = !showDrawer"
        />

        <AppHeaderIconApp />
      </q-toolbar>

      <div class="h-full overflow-y-auto scrollbar-custom">
        <q-list class="mx-2">
          <template
            v-for="{ icon, active, name, path, divider } in drawers"
            :key="name"
          >
            <q-separator
              v-if="divider"
              class="bg-[rgba(255,255,255,0.1)] my-6 mr-2"
            />
            <q-item
              v-else
              clickable
              v-ripple
              class="min-h-0 my-2 rounded-xl"
              :to="path"
              active-class=""
              exact-active-class="bg-[rgba(255,255,255,0.1)] text-main"
            >
              <q-item-section avatar class="pr-0 min-w-0">
                <component
                  v-if="router.resolve(path!).fullPath !== route.fullPath"
                  :is="icon!"
                  width="23"
                  height="23"
                />
                <component v-else :is="active!" width="23" height="23" />
              </q-item-section>
              <q-item-section class="ml-5">
                <q-item-label>{{ name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>

        <div v-if="(hideDrawer ? true : !showDrawer) || route.meta.drawersBottom" class="text-gray-500 mt-7">
          <a
            v-for="item in drawersBottom"
            :key="item.name"
            class="py-2 px-4 block"
            :href="item.href"
            target="_blank"
            >{{ item.name }}</a
          >
        </div>
      </div>
    </q-drawer>

    <q-page-container
      :class="{
        '!pt-0': route.meta.noSpaceHeader
      }"
    >
      <router-view v-if="true" v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
      <q-page v-else>
        <NotExistsExtension />
      </q-page>
    </q-page-container>

    <q-footer
      v-if="$q.screen.lt.md"
      :model-value="!route.meta.hiddenFooter"
      class="bg-dark-page"
    >
      <q-tabs
        indicator-color="transparent"
        active-color="white"
        class="bg-transparent text-grey-5 !shadow-2 text-[12px] tabs-main children:w-20% children:min-w-0"
        no-caps
      >
        <q-route-tab replace class="pt-1" to="/">
          <component
            :is="pathEqual(route.fullPath, '/') ? Icons.home[1] : Icons.home[0]"
            width="24"
            height="24"
            class="mb-1"
          />
          Trang chủ
        </q-route-tab>
        <q-route-tab
          replace
          class="pt-1"
          to="/search"
          :class="{
            'q-router-link--exact-active': route.name === 'search'
          }"
        >
          <component
            :is="route.name === 'search' ? Icons.search[1] : Icons.search[0]"
            width="24"
            height="24"
            class="mb-1"
          />
          Tìm kiếm
        </q-route-tab>
        <q-route-tab
          replace
          class="pt-1"
          to="/genre"
          :class="{
            'q-router-link--exact-active': route.name === 'genre'
          }"
        >
          <component
            :is="route.name === 'genre' ? Icons.box[1] : Icons.box[0]"
            width="24"
            height="24"
            class="mb-1"
          />
          Thể loại
        </q-route-tab>
        <q-route-tab
          replace
          class="pt-1"
          to="/library"
          :class="{
            'q-router-link--exact-active': route.path.startsWith('/library')
          }"
        >
          <component
            :is="
              route.path.startsWith('/library')
                ? Icons.library[1]
                : Icons.library[0]
            "
            width="24"
            height="24"
            class="mb-1"
          />
          Thư viện
        </q-route-tab>
        <q-route-tab
          replace
          class="pt-1"
          to="/app"
          :class="{
            'q-router-link--exact-active': route.path.startsWith('/app')
          }"
        >
          <component
            :is="route.path.startsWith('/app') ? Icons.user[1] : Icons.user[0]"
            width="24"
            height="24"
            class="mb-1"
          />
          Tôi
        </q-route-tab>
      </q-tabs>
    </q-footer>

    <PluginManagerDialog v-model="stateStore.showPluginManagerDialog" />
    <PluginAddDialog
      v-model="stateStore.showPluginAddDialog"
      @installed="stateStore.showPluginAddDialog = false"
    />
  </q-layout>

  <canvas
    class="hidden fixed z-0 top-0 left-0"
    ref="canvasRef"
    :width="$q.screen.width"
    :height="$q.screen.height"
  />
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
// =========== suth

import { Icons } from "src/constants"
import { execScriptMeta } from "src/logic/exec-script-meta"
import { pathEqual } from "src/logic/path-equal"

import NotExistsExtension from "./NotExistsExtension.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const pluginStore = usePluginStore()
const MODE = import.meta.env.MODE

const canvasRef = ref<HTMLCanvasElement>()
const instance = getCurrentInstance()
watch(canvasRef, (ref) => {
  if (!ref) return

  const { draw, stop } = useSakura(ref)

  draw()
  onBeforeUnmount(stop, instance)
})

const showSearchMB = ref(false)

const hideDrawer = computed(() => route.meta.hiddenDrawer ?? false)
const showDrawer = ref(false)

const drawers = computed(() => [
  {
    icon: Icons.home[0],
    active: Icons.home[1],
    name: "Trang chủ",
    path: "/"
  },
  {
    icon: Icons.box[0],
    active: Icons.box[1],
    name: "Thể loại",
    path: "/genre"
  },
  {
    icon: Icons.fire[0],
    active: Icons.fire[1],
    name: "Truyện hot",
    path: "/trending"
  },

  { divider: true },

  {
    icon: Icons.history[0],
    active: Icons.history[1],
    name: "Lịch sử",
    path: "/library/history"
  },
  {
    icon: Icons.favorite[0],
    active: Icons.favorite[1],
    name: "Yêu thích",
    path: "/library/follow"
  },
  {
    icon: Icons.download[0],
    active: Icons.download[1],
    name: "Nội dung tải xuống",
    path: "/library/offline"
  }
])
const drawersBottom = computed(() => [
  {
    name: "Về chúng tôi",
    href: "https://github.com/manga-raiku"
  },
  {
    name: "Liên hệ chúng tôi",
    href: "mailto:contact@mangaraiku.eu.org?subject=Phản hồi ứng dụng web Raiku"
  },
  {
    name: "Tải ứng dụng",
    href: "https://manga-raiku.github.io"
  },
  {
    name: "Điều khoản sử dụng",
    href: "https://manga-raiku.github.io/tems-of-use"
  },
  {
    name: "Chính sách riêng tư",
    href: "https://manga-raiku.github.io/privacy-police"
  },
  {
    name: "Khiếu nại vi phạm",
    href: "https://manga-raiku.github.io/disclaimer"
  }
])

// ========= plugin manager ========
const stateStore = useStateStore()
</script>

<style lang="scss">
.tabs-main .q-router-link--exact-active {
  svg {
    color: var(--sakura);
  }
}
.tabs-main .q-tab {
  width: (100% / 5) !important;
}
</style>
