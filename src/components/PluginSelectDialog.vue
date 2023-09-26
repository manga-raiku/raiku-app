<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    full-width
    full-height
  >
    <q-card
      class="h-full min-w-310px flex flex-nowrap column min-h-0 rounded-xl"
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
          <q-item
            v-else
            v-for="item in data"
            :key="item.id"
            clickable
            target="_blank"
            :href="item.homepage ?? item.source"
            class="rounded-xl"
          >
            <q-item-section side class="min-w-0 pl-0">
              <q-radio
                v-model="pluginStore.pluginMain"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                color="orange"
                :val="item.id"
              />
            </q-item-section>
            <q-item-section avatar class="min-w-0">
              <img :src="item.favicon" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{ item.name }}</q-item-label>
              <q-item-label lines="2" caption>{{
                item.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{ item.version }}
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="error" class="px-6 py-5">
          {{ error }}
        </div>
        <div v-else class="flex items-center justify-center py-6">
          <q-spinner size="40px" color="main-3" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
}>()

const pluginStore = usePluginStore()
const stateStore = useStateStore()

const { data, error } = useRequest(() => pluginStore.getAllPlugins())
</script>
