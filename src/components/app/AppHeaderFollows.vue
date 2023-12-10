<template>
  <q-btn v-if="authStore.session" round unelevated class="mr-2">
    <i-majesticons-bookmark-plus v-if="showMenuFollow" width="24" height="24" />
    <i-majesticons-bookmark-plus-line v-else width="24" height="24" />

    <q-menu
      v-model="showMenuFollow"
      class="flex flex-nowrap flex-col bg-dark-page shadow-xl md:rounded-xl md:!max-w-420px <md:w-full <md:!left-0 <md:!top-0 <md:!max-w-full <md:!max-h-full <md:!h-full"
      ref="menuRef"
    >
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" round v-close-popup>
          <i-line-md-arrow-left class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("truyen-dang-theo-doi") }}</q-toolbar-title>
      </q-toolbar>

      <q-card
        class="transparent h-full flex-1 min-h-0 shadow-none scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <q-infinite-scroll
            v-if="data && !loading"
            @load="onLoad"
            :offset="250"
            class="row md:block"
          >
            <div
              v-for="item in data"
              :key="item.manga_param"
              class="col-12 col-sm-6 col-md-12 px-2 pb-4"
            >
              <ItemBasicHistory
                class="mb-4"
                :comic="item.manga_param"
                :name="item.manga_name"
                :image="item.image"
                :history="item.history"
                :source-id="item.source_id"
              />
            </div>
            <template #loading>
              <div class="col-12 justify-center flex q-my-md">
                <q-spinner-dots color="sakura3" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
          <ErrorDisplay
            v-else-if="error"
            :error="error"
            :retry-async="runAsync"
          />
          <div v-else class="row">
            <CardVerticalSKT
              v-for="i in 12"
              :key="i"
              class="col-12 col-sm-6 col-md-12 px-2 pb-4"
            />
          </div>
        </q-card-section>
      </q-card>

      <router-link to="/library/follow" class="block py-2 text-center">{{
        $t("xem-tat-ca")
      }}</router-link>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { QCard, QMenu } from "quasar"

const authStore = useAuthStore()
const $q = useQuasar()
const followStore = useFollowStore()

const menuRef = ref<QMenu>()

const showMenuFollow = ref(false)

const { data, error, loading, runAsync } = useRequest(() => followStore.get(), {
  manual: true
})
watch(data, async (data) => {
  if (data) {
    await nextTick()
    menuRef.value?.updatePosition()
  }
})
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await followStore.get(data.value?.length)

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}

watch(showMenuFollow, (show) => {
  if (show) void runAsync()
  else data.value = undefined
})
</script>
