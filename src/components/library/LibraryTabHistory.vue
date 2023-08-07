<template>
  <CardVerticalSKT v-if="loading" v-for="i in 12" :key="i" class="mb-4" />
  <q-infinite-scroll
    v-else-if="data"
    @load="onLoad"
    :offset="250"
    :scroll-target="(qCardRef as unknown as Element)"
  >
    <template v-for="item in data?.items" :key="item.path">
      <div
        v-if="
          !data.items[index - 1] ||
          !data.items[index - 1].read_at.isSame(item.read_at, 'day')
        "
        class="text-subtitle2 text-weight-normal"
      >
        {{
          item.read_at.isToday()
            ? "Hôm nay"
            : item.read_at.isYesterday()
            ? "Hôm qua"
            : item.read_at.format("d thag mm")
        }}
      </div>
      <CardVertical :data="item" read-continue class="mb-4" />
    </template>
    <template #loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="main-3" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
  <div v-else class="text-center">
    <div class="text-subtitle1 font-weight-medium">Lỗi không xác định</div>
    <q-btn outline rounded color="main" @click="refreshAsync">Thử lại</q-btn>
  </div>
</template>

<script lang="ts" setup>
import LichSu from "src/apis/nettruyen/runs/lich-su"
import dayjs from "src/logic/dayjs"

const authStore = useAuthStore()
const $q = useQuasar()

const showMenuHistory = ref(false)

const { loading, data, refreshAsync } = useRequest(
  async () => {
    // eslint-disable-next-line functional/no-throw-statement
    if (!authStore.user_data) throw new Error("need_login")

    const data = await LichSu(1, authStore.user_data.token)
    data.items = shallowReactive(data.items.map(item => {
      item.read_at = dayjs(read_at)
      return item
    }))
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
</script>

<style></style>
