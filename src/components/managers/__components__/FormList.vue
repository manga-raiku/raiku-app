<template>
  <div
    v-for="(item, index) in modelValue"
    :key="index"
    class="flex flex-nowrap mt-2"
  >
    <div class="flex-1 flex flex-nowrap">
      <q-input
        :model-value="item[0]"
        @update:model-value="
          emit('edit', {
            index,
            type: 0,
            value: ($event as string) ?? ''
          })
        "
        filled
        dense
        color="sakura3"
        class="mx-1"
        placeholder="Name"
      />
      <q-input
        :model-value="item[1]"
        @update:model-value="
          emit('edit', {
            index,
            type: 1,
            value: ($event as string) ?? ''
          })
        "
        filled
        dense
        color="sakura3"
        class="mx-1"
        placeholder="Value"
      />
    </div>

    <div class="">
      <q-btn round flat unelevated @click="emit('remove', index)">
        <i-solar-trash-bin-2-bold-duotone />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [string, string][]
}>()
const emit = defineEmits<{
  (
    name: "edit",
    value: {
      index: number
      type: 0 | 1
      value: string
    }
  ): void
  (name: "push", value: [string, string]): void
  (name: "remove", index: number): void
}>()

watchImmediate(
  () => props.modelValue.at(-1),
  (item) => {
    if (!item || item[0]) emit("push", ["", ""])
  },
  {
    deep: true
  }
)
</script>
