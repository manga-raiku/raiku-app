<template>
  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuHistory ? 'fluent:clock-24-filled' : 'fluent:clock-24-regular'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuHistory"
      class="flex flex-nowrap column bg-dark-page shadow-xl sm:rounded-xl <sm:w-full <sm:!left-0 <sm:!top-0 <sm:!max-w-full <sm:!max-h-full"
    >
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.sm" round v-close-popup>
          <Icon icon="fluent:arrow-left-24-regular" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Lịch sử đọc</q-toolbar-title>
      </q-toolbar>
      <q-card
        class="transparent shadow-none w-[415px] <sm:w-full <sm:h-full scrollbar-custom overflow-y-auto"
        ref="qCardRef"
      >
        <q-card-section>
          <CardVerticalSKT
            v-if="loading"
            v-for="i in 12"
            :key="i"
            class="mb-4"
          />
          <q-infinite-scroll
            v-else-if="data"
            @load="onLoad"
            :offset="250"
            :scroll-target="qCardRef as unknown as Element"
          >
            <CardVertical
              v-for="item in data?.items"
              :key="item.path"
              :data="item"
              read-continue
              class="mb-4"
            />
            <template #loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="main-3" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
          <div v-else class="text-center">
            <div class="text-subtitle1 font-weight-medium">
              Lỗi không xác định
            </div>
            <q-btn outline rounded color="main" @click="refreshAsync"
              >Thử lại</q-btn
            >
          </div>
        </q-card-section>
      </q-card>

      <router-link to="/lich-su" class="block py-2 text-center"
        >Xem tất cả</router-link
      >
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { QCard } from "quasar"
import LichSu from "src/apis/nettruyen/runs/lich-su"

const authStore = useAuthStore()
const $q = useQuasar()

const showMenuHistory = ref(false)

const { loading, data, refreshAsync } = useRequest(
  async () => {
    // eslint-disable-next-line functional/no-throw-statement
    if (!authStore.user_data) throw new Error("need_login")

    const data = await LichSu(1, authStore.user_data.token)
    data.items = shallowReactive(data.items)
    return data
  },
  {
    manual: true,
    cacheKey: "history",
    cacheTime: 5 * 60 * 1000, //
  }
)
const onLoad = useLoadMorePage((page) => {
  // eslint-disable-next-line functional/no-throw-statement
  if (!authStore.user_data) throw new Error("need_login")

  return LichSu(page, authStore.user_data.token)
}, data)
watch(showMenuHistory, (show) => {
  if (show) refreshAsync()
})
const qCardRef = ref<QCard>()

if ($q.screen.lt.sm) {
  const bodyOverflow = useBodyOverflow()
  watch(showMenuHistory, (show) => {
    bodyOverflow.value = show ? "hidden" : ""
  })
}
</script>
