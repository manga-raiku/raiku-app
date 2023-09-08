<template>
  <q-card class="transparent min-h-0 shadow-none overflow-y-auto">
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
          v-if="!data[index - 1]?.updated_at.isSame(item.updated_at, 'day')"
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
      <div class="text-subtitle1 font-weight-medium">Lỗi không xác định</div>
      <q-btn outline rounded color="main" @click="refreshAsync">Thử lại</q-btn>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
const historyStore = useHistoryStore()

const { loading, data, refreshAsync } = useRequest(() =>
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
