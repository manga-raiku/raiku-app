<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]" class="z-20">
    <q-btn rounded no-caps color="black" @click="showDialog = true">
      <i-mingcute-plugin-2-line class="size-1.5em mr-1" />
      {{ currentPlugin?.meta.name ?? modelValue }}
    </q-btn>
  </q-page-sticky>

  <q-dialog v-model="showDialog" full-width full-height>
    <q-card
      class="h-full min-w-310px max-w-560px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px flex items-center justify-between pl-7">
        Chọn Plugin chính

        <q-btn unelevated round v-close-popup>
          <i-ep-close-bold class="size-1.5em" />
        </q-btn>
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <q-list v-if="!error && data">
          <q-item
            clickable
            class="rounded-xl"
            @click="stateStore.showPluginAddDialog = true"
          >
            <q-item-section avatar class="min-w-0">
              <i-iconamoon-sign-plus-fill class="size-1.5em" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm plugin</q-item-label>
            </q-item-section>
          </q-item>

          <div v-if="!data.length" class="text-center py-6">Không có gì cả</div>
          <template v-else>
            <q-item
              v-for="item in data"
              :key="item.id"
              clickable
              target="_blank"
              :href="item.homepage ?? item.source"
              class="rounded-xl"
            >
              <q-item-section side class="min-w-0 pl-0">
                <q-radio
                  :model-value="modelValue"
                  @update:model-value="emit('update:modelValue', $event)"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  color="orange"
                  :val="item.id"
                />
              </q-item-section>
              <q-item-section v-if="item.favicon" avatar class="min-w-0">
                <img :src="item.favicon" :alt="item.name" class="size-1.2em" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">
                  {{ item.name }}
                  <q-badge
                    v-if="item.devMode"
                    rounded
                    color="blue"
                    class="text-10px ml-1"
                    >dev</q-badge
                  >
                  <q-badge
                    v-if="item.isNSFW"
                    rounded
                    color="pink-7"
                    class="text-10px ml-1"
                    >NSFW</q-badge
                  >
                </q-item-label>
                <q-item-label v-if="item.description" lines="2" caption>{{
                  item.description
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ item.version }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
        <div v-else-if="error" class="px-6 py-5">
          {{ error }}
        </div>
        <div v-else class="flex items-center justify-center py-6">
          <q-spinner size="40px" color="sakura3" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string | null
}>()
const emit =
  defineEmits<(name: "update:modelValue", value: string | null) => void>()

const pluginStore = usePluginStore()
const stateStore = useStateStore()

const showDialog = ref(false)

const { data, error } = useRequest(() =>
  pluginStore.getAllPlugins().then((list) => shallowReactive(list))
)
pluginStore.busses.on("install plugin", (meta) => {
  data.value?.splice(
    data.value.findIndex((item) => item.id === meta.id) >>> 0,
    1
  )
  data.value?.unshift(meta)
})
pluginStore.busses.on("remove plugin", (id) => {
  data.value?.splice(data.value.findIndex((item) => item.id === id) >>> 0, 1)
})

const currentPlugin = computedAsync(() =>
  pluginStore.getPluginOrDefault(props.modelValue)
)
</script>
