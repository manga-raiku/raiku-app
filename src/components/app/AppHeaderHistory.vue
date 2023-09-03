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
        <q-btn v-if="$q.screen.lt.sm" round v-close-popup>
          <Icon icon="fluent:arrow-left-24-regular" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Lịch sử đọc</q-toolbar-title>
      </q-toolbar>

      <q-card
        class="transparent h-full flex-1 min-h-0 shadow-none scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <CardVerticalSKT
            v-if="loading"
            v-for="j in 12"
            :key="j"
            class="mb-4"
          />
          <div v-else-if="data">
            <ItemBasicHistory
              v-for="item in data"
              :key="item.manga_path"
              :path="item.manga_path"
              :name="item.manga_name"
              :image="item.image"
              :history="{
                name: item.last_ch_name,
                path: item.last_ch_path,
                updated_at: item.updated_at,
              }"
            />
          </div>
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

const { data, loading, error, runAsync } = useRequest(() => historyStore.get())
</script>
