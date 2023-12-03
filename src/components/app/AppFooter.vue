<template>
  <q-footer-custom class="transparent app-footer">
    <div
      class="app-footer-prepend"
      :ref="(ref) => (stateStore.appFooterPrependRef = ref as HTMLDivElement)"
    />

    <q-tabs
      indicator-color="transparent"
      active-color="white"
      class="bg-dark-page text-grey-5 !shadow-2 text-[12px] tabs-main"
      no-caps
    >
      <q-route-tab
        v-for="btn in buttons"
        :key="btn.to"
        replace
        :ripple="false"
        class="pt-1"
        :to="btn.to"
        :class="{
          'q-router-link--exact-active': btn.check()
        }"
      >
        <div
          class="bg-icon"
          :class="{
            'bg-transparent': !btn.check()
          }"
        >
          <component
            :is="btn.check() ? btn.icon[1] : btn.icon[0]"
            width="24"
            height="24"
            class="my-1"
          />
        </div>
        {{ btn.name() }}
      </q-route-tab>
    </q-tabs>

    <div v-if="!networkStore.isOnline" class="text-center">
      {{ $t("khong-co-ket-noi") }}
    </div>
  </q-footer-custom>
</template>

<script lang="ts" setup>
import { type Icon, Icons } from "src/Icons"

const route = useRoute()
const i18n = useI18n()
const networkStore = useNetworkStore()
const stateStore = useStateStore()

onUnmounted(() => (stateStore.appFooterPrependRef = undefined))

const buttons: {
  to: string
  icon: [Icon, Icon]
  name: () => string
  check: () => boolean
}[] = [
  {
    to: "/",
    icon: Icons.home,
    name: () => i18n.t("trang-chu"),
    check: () => route.name === "index"
  },
  {
    to: "/search",
    icon: Icons.search,
    name: () => i18n.t("tim-kiem"),
    check: () => route.name === "search"
  },
  {
    to: "/genre",
    icon: Icons.box,
    name: () => i18n.t("the-loai"),
    check: () => route.name === "genre"
  },
  {
    to: "/library",
    icon: Icons.library,
    name: () => i18n.t("thu-vien"),
    check: () => route.path.startsWith("/library")
  },
  {
    to: "/app",
    icon: Icons.user,
    name: () => i18n.t("toi"),
    check: () => route.path.startsWith("/app")
  }
]
</script>

<style lang="scss" scoped>
.tabs-main :deep(.q-router-link--exact-active) {
  svg {
    color: var(--sakura);
  }
}
.tabs-main :deep(.q-tab) {
  width: (100% / 5) !important;
  min-width: 0 !important;

  .q-focus-helper {
    display: none;
  }

  .bg-icon {
    @apply px-3 rounded-30px bg-pink-300 bg-opacity-10 transition transition-bg duration-222;
  }

  &:hover {
    .bg-icon {
      @apply \!bg-pink-300 \!bg-opacity-5;
    }
  }
}
</style>
