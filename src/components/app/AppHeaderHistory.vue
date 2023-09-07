<template>
  <q-btn v-if="authStore.session" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuHistory ? 'fluent:clock-24-filled' : 'fluent:clock-24-regular'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuHistory"
      class="flex flex-nowrap flex-col bg-dark-page shadow-xl md:rounded-xl <md:w-full <md:!left-0 <md:!top-0 <md:!max-w-full <md:!max-h-full <md:!h-full"
    >
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" round v-close-popup>
          <Icon icon="line-md:arrow-left" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Lịch sử đọc</q-toolbar-title>
      </q-toolbar>

      <q-card
        class="transparent h-full flex-1 min-h-0 shadow-none scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <div v-if="loading" class="row">
            <CardVerticalSKT
              v-for="i in 12"
              :key="i"
              class="col-12 col-sm-6 px-2 pb-4"
            />
          </div>
          <q-infinite-scroll
            v-else-if="data"
            @load="onLoad"
            :offset="250"
            class="row"
          >
            <template v-for="(item, index) in data" :key="item.path">
              <div
                v-if="
                  !data[index - 1]?.updated_at.isSame(item.updated_at, 'day')
                "
                class="col-12 text-1em mb-1.2 text-weight-normal text-gray-300"
              >
                {{
                  item.updated_at.isToday()
                    ? "Hôm nay"
                    : item.updated_at.isYesterday()
                    ? "Hôm qua"
                    : `${item.updated_at.get("d")} thg ${item.updated_at.get(
                        "months",
                      )}`
                }}
              </div>
              <div class="col-12 col-sm-6 px-2 pb-4">
                <ItemBasicHistory
                  :path="item.manga_path"
                  :name="item.manga_name"
                  :image="item.image"
                  :history="{
                    name: item.last_ch_name,
                    path: item.last_ch_path,
                    updated_at: item.$updated_at,
                  }"
                />
              </div>
            </template>
            <template #loading>
              <div class="col-12 justify-center flex q-my-md">
                <q-spinner-dots color="main-3" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
          <div v-else class="text-center">
            <div class="text-subtitle1 font-weight-medium">
              Lỗi không xác định {{ error }}
            </div>
            <q-btn outline rounded color="main" @click="runAsync"
              >Thử lại</q-btn
            >
          </div>
        </q-card-section>
      </q-card>

      <router-link to="/library/history" class="block py-2 text-center"
        >Xem tất cả</router-link
      >
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()
const $q = useQuasar()
const historyStore = useHistoryStore()

const showMenuHistory = ref(false)

const { data, loading, error, runAsync } = useRequest(() =>
  historyStore.get().then((res) =>
    res.map((item) => ({
      ...item,
      $updated_at: item.updated_at,
      updated_at: dayjs(item.updated_at),
    })),
  ),
)
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await historyStore.get(data.value?.length).then((res) =>
    res.map((item) => ({
      ...item,
      $updated_at: item.updated_at,
      updated_at: dayjs(item.updated_at),
    })),
  )

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
