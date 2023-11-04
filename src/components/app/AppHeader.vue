<template>
  <div
    v-if="execScriptMeta($q, route.meta?.hiddenHeader) !== true"
    class="app-header q-layout__section--marginal pt-58px header-blur fixed z-2000 w-full"
    :class="{
      'translate-y--58px': reveal && !appHeaderReveal,
      '!bg-transparent': route.meta?.transparentHeader
    }"
  >
    <q-header
      :reveal="reveal"
      @reveal="appHeaderReveal = $event"
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
          @click="emit('update:showDrawer', !showDrawer)"
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

        <AppHeaderFollows v-if="APP_STANDALONE" />
        <AppHeaderHistory v-if="APP_STANDALONE" />
        <AppHeaderNotify />

        <AppHeaderUser />
      </q-toolbar>
    </q-header>
  </div>
</template>

<script lang="ts" setup>
import { APP_STANDALONE } from "src/constants"
import { execScriptMeta } from "src/logic/exec-script-meta"

defineProps<{
  showDrawer: boolean
}>()
const emit = defineEmits<{
  (name: "update:showDrawer", value: boolean): void
}>()

const route = useRoute()
const $q = useQuasar()

const showSearchMB = ref(false)
const appHeaderReveal = ref(false)

const reveal = computed(
  () => execScriptMeta($q, route.meta.revealHeader) === true
)
</script>
