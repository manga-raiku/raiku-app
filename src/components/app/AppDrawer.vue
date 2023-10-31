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
const $q = useQuasar()

const canvasRef = ref<HTMLCanvasElement>()
const instance = getCurrentInstance()
watch(canvasRef, (ref) => {
  if (!ref) return

  const { draw, stop } = useSakura(ref)

  draw()
  onBeforeUnmount(stop, instance)
})

const hideDrawer = computed(() => route.meta.hiddenDrawer ?? false)

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
</script>
