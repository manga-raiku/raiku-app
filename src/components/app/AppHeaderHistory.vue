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
            read-continue
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

      <router-link to="/lich-su" class="block py-2 text-center"
        >Xem tất cả</router-link
      >
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import LichSu from "src/apis/runs/lich-su"

const authStore = useAuthStore()

const showMenuHistory = ref(false)

const { loading, data, refreshAsync } = useRequest(() => LichSu(1), {
  manual: true,
  cacheKey: "history",
  cacheTime: 5 * 60 * 1000, //
})
watch(showMenuHistory, (show) => {
  if (show) refreshAsync()
})
</script>
