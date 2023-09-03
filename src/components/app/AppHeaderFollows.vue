<template>
  <q-btn v-if="authStore.session" round unelevated class="mr-2">
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
      class="flex flex-nowrap column bg-dark-page shadow-xl sm:rounded-xl <sm:w-full <sm:!left-0 <sm:!top-0 <sm:!max-w-full <sm:!max-h-full"
    >
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.sm" round v-close-popup>
          <Icon icon="fluent:arrow-left-24-regular" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Truyện đang theo dõi</q-toolbar-title>
      </q-toolbar>

      <q-card
        class="transparent min-h-0 shadow-none scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <CardVerticalSKT
            v-if="loading"
            v-for="j in 12"
            :key="j"
            class="mb-4"
          />
          <div v-else-if="data">
            {{data}}
            <CardVertical
              v-for="item in data"
              :key="item.path"
              :data="item"
              read-continue
              class="mb-4"
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

      <router-link to="/truyen-dang-theo-doi" class="block py-2 text-center"
        >Xem tất cả</router-link
      >
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { QCard } from "quasar"

const authStore = useAuthStore()
const $q = useQuasar()
const followStore = useFollowStore()

const showMenuFollow = ref(false)

const { data, loading, error, runAsync } = useRequest(() => followStore.get())
</script>
