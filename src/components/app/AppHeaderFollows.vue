<template>
  <q-btn v-if="authStore.session" round unelevated class="mr-2">
    <i-majesticons-bookmark-plus v-if="showMenuFollow" width="24" height="24" />
    <i-majesticons-bookmark-plus-line v-else width="24" height="24" />

    <q-menu
      v-model="showMenuFollow"
      class="flex flex-nowrap flex-col bg-dark-page shadow-xl md:rounded-xl <md:w-full <md:!left-0 <md:!top-0 <md:!max-w-full <md:!max-h-full <md:!h-full"
    >
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" round v-close-popup>
          <i-line-md-arrow-left class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Truyện đang theo dõi</q-toolbar-title>
      </q-toolbar>

      <q-card
        class="transparent h-full flex-1 min-h-0 shadow-none scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <div v-if="loading" class="row">
            <CardVerticalSKT
              v-for="i in 12"
              :key="i"
              class="col-12 col-sm-6 col-md-12 px-2 pb-4"
            />
          </div>
          <q-infinite-scroll
            v-else-if="data"
            @load="onLoad"
            :offset="250"
            class="row md:block"
          >
            <div
              v-for="item in data"
              :key="item.path"
              class="col-12 col-sm-6 col-md-12 px-2 pb-4"
            >
              <ItemBasicHistory
                :path="item.path"
                :name="item.manga_name"
                :image="item.image"
                :history="item.history"
              />
            </div>
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

      <router-link to="/library/follow" class="block py-2 text-center"
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
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await followStore.get(data.value?.length)

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
