<template>
  <q-drawer
    v-if="$q.screen.gt.sm"
    :model-value="hideDrawer ? modelValue : true"
    @update:model-value="
      hideDrawer ? emit('update:modelValue', $event) : undefined
    "
    :mini="hideDrawer ? modelValue : false"
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
        @click="emit('update:modelValue', !modelValue)"
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
            exact-active-class="bg-[rgba(255,255,255,0.1)] text-sakura"
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

      <div v-if="hideDrawer ? true : !modelValue" class="text-gray-500 mt-7">
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
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
}>()

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const $q = useQuasar()

const hideDrawer = computed(() => route.meta.hiddenDrawer ?? false)

const drawers = computed(() => [
  {
    icon: Icons.home[0],
    active: Icons.home[1],
    name: i18n.t("trang-chu"),
    path: "/"
  },
  {
    icon: Icons.box[0],
    active: Icons.box[1],
    name: i18n.t("the-loai"),
    path: "/genre"
  },
  {
    icon: Icons.fire[0],
    active: Icons.fire[1],
    name: i18n.t("truyen-hot"),
    path: "/trending"
  },

  { divider: true },

  {
    icon: Icons.history[0],
    active: Icons.history[1],
    name: i18n.t("lich-su"),
    path: "/library/history"
  },
  {
    icon: Icons.favorite[0],
    active: Icons.favorite[1],
    name: i18n.t("yeu-thich"),
    path: "/library/follow"
  },
  {
    icon: Icons.download[0],
    active: Icons.download[1],
    name: i18n.t("noi-dung-tai-xuong"),
    path: "/library/offline"
  }
])
const drawersBottom = computed(() => [
  {
    name: i18n.t("ve-chung-toi"),
    href: "https://github.com/manga-raiku"
  },
  {
    name: i18n.t("lien-he-chung-toi"),
    href: "mailto:contact@mangaraiku.eu.org?subject=Phản hồi ứng dụng web Raiku"
  },
  {
    name: i18n.t("tai-ung-dung"),
    href: "https://manga-raiku.github.io"
  },
  {
    name: i18n.t("dieu-khoan-su-dung"),
    href: "https://manga-raiku.github.io/tems-of-use"
  },
  {
    name: i18n.t("chinh-sach-rieng-tu"),
    href: "https://manga-raiku.github.io/privacy-police"
  },
  {
    name: i18n.t("khieu-nai-vi-pham"),
    href: "https://manga-raiku.github.io/disclaimer"
  }
])
</script>

<style lang="scss">
.q-drawer {
  z-index: 2000 !important;
  &.q-drawer--on-top {
    z-index: 3000 !important;
  }
}
</style>
