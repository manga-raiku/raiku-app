<template>
  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuFollow
          ? 'majesticons:bookmark-plus'
          : 'majesticons:bookmark-plus-line'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuFollow"
      class="flex flex-nowrap column bg-dark-page shadow-xl"
    >
      <q-card
        class="transparent shadow-none w-[415px] scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <CardVerticalSKT
            v-if="loading"
            v-for="i in 12"
            :key="i"
            class="mb-4"
          />
          <CardVertical
            v-else-if="data"
            v-for="item in data?.items"
            :key="item.path"
            :data="item"
            class="mb-4"
          />
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

      <router-link to="/truyen-dang-theo-doi" class="block py-2 text-center"
        >Xem tất cả</router-link
      >
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import TruyenDangTheoDoi from "src/apis/runs/truyen-dang-theo-doi"

const authStore = useAuthStore()

const showMenuFollow = ref(false)

const { loading, data, refreshAsync } = useRequest(() => TruyenDangTheoDoi(1), {
  manual: true,
  cacheKey: "follows",
  cacheTime: 5 * 60 * 1000, //
})
watch(showMenuFollow, (show) => {
  if (show) refreshAsync()
})
</script>
