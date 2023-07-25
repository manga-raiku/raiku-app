<template>
  <q-menu
    v-if="useMenu"
    :model-value="modelValue"
    no-parent-event
    v-bind="menuProps"
    @update:model-value="emit('update:model-value', $event)"
  >
    <slot />
  </q-menu>
  <q-dialog
    v-else
    :model-value="modelValue"
    v-bind="dialogProps"
    @update:model-value="emit('update:model-value', $event)"
  >
    <slot />
  </q-dialog>
</template>

<script lang="ts" setup>
import type { QDialogProps, QMenuProps } from "quasar"

defineProps<{
  useMenu: boolean
  modelValue: boolean

  dialogProps: QDialogProps
  menuProps: QMenuProps
}>()
const emit = defineEmits<{
  (name: "update:model-value", value: boolean): void
}>()
</script>
