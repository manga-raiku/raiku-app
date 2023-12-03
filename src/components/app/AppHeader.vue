<template>
  <div
    v-show="execScriptMeta($q, route.meta?.hiddenHeader) !== true"
    class="app-header q-layout__section--marginal pt-58px header-blur fixed z-2000 w-full"
    :class="{
      'translate-y--58px': reveal && !appHeaderReveal,
      '!bg-transparent': route.meta?.transparentHeader
    }"
  >
    <q-header-custom
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

        <q-space />

        <template v-if="$q.screen.md || $q.screen.gt.md">
          <AppHeaderSearch
            :source-id="(route.params.sourceId as string | undefined) ?? null"
          />
          <AppHeaderGithub />
        </template>
        <template v-else-if="!APP_STANDALONE">
          <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
            <q-icon name="search" />
          </q-btn>
          <AppHeaderSearchMB v-model:searching="showSearchMB" />
        </template>

        <q-btn
          v-if="!APP_NATIVE_MOBILE"
          round
          unelevated
          class="mr-2"
          target="_blank"
          href="https://github.com/anime-vsub/extension-animevsub-helper"
        >
          <img
            src="~assets/animevsub-helper-512.png"
            width="24"
            height="24"
            alt="animevsub helper icon"
            :class="{
              'grayscale-100': !Http.version
            }"
          />

          <q-menu
            class="bg-dark-menu !max-w-30% rounded-xl"
            anchor="bottom middle"
            self="top middle"
          >
            <div class="px-3 py-2">
              <div v-if="Http.version">v{{ Http.version }}</div>
              <div v-else>
                {{ $t("msg-suggest-ext") }}
              </div>
            </div>
          </q-menu>
        </q-btn>

        <AppHeaderFollows v-if="!APP_STANDALONE && !$q.screen.xs" />
        <AppHeaderHistory v-if="!APP_STANDALONE && !$q.screen.xs" />
        <AppHeaderNotify />

        <AppHeaderUser />
      </q-toolbar>
    </q-header-custom>
  </div>
</template>

<script lang="ts" setup>
import { Http } from "client-ext-animevsub-helper"
import { APP_NATIVE_MOBILE, APP_STANDALONE } from "src/constants"
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
const appHeaderReveal = ref(true)

const reveal = computed(
  () => execScriptMeta($q, route.meta.revealHeader) === true
)
</script>
