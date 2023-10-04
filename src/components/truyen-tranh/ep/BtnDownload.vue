<template>
  <q-btn round unelevated :disable="disable" @click="onClickDownload">
    <q-circular-progress
      v-if="modelValue && isTaskDLEp(modelValue)"
      :value="(modelValue.ref.downloaded / modelValue.ref.pages.length) * 100"
      show-value
      size="35px"
      color="main"
    >
      <i-solar-download-minimalistic-linear
        v-if="!modelValue.downloading"
        class="size-2em"
      />
      <template v-else>{{
        $t("val-per", [
          Math.round(
            (modelValue.ref.downloaded / modelValue.ref.pages.length) * 100
          )
        ])
      }}</template>
    </q-circular-progress>
    <i-solar-download-minimalistic-broken
      v-else-if="!modelValue"
      class="size-1.5em"
    />
    <i-material-symbols-offline-pin-rounded v-else class="size-2em" />
  </q-btn>
</template>

<script lang="ts" setup>
import type { ID } from "raiku-pgs/plugin"
import type { TaskDDEp, TaskDLEp } from "src/logic/download-manager"
import { isTaskDLEp } from "src/logic/download-manager"

const props = defineProps<{
  modelValue?: TaskDDEp | TaskDLEp | null
  mangaId: ID | null
  epId: ID | null
  canDownload: boolean
}>()
const $q = useQuasar()
const { t } = useI18n()
const emit = defineEmits<{
  (name: "update:model-value", value: undefined | TaskDDEp | TaskDDEp): void
  (name: "action:download"): void
  (name: "action:delete", ep_id: ID): void
}>()

const disable = computed(() => {
  if (props.modelValue) return false

  if (!props.canDownload) return true

  return false
})

function onClickDownload() {
  const value = props.modelValue
  if (value && isTaskDLEp(value)) {
    if (value.downloading) value.stop()
    else (value as TaskDLEp).resume()

    return
  }
  // confirm delete
  if (props.modelValue) {
    $q.dialog({
      message: t("quest-confirm-delete-ch"),
      ok: {
        label: t("xoa"),
        color: "red",
        rounded: true,
        noCaps: true,
        flat: true
      },
      cancel: {
        label: t("huy"),
        color: "white",
        rounded: true,
        noCaps: true,
        flat: true
      }
    }).onOk(async () => {
      if (props.mangaId !== null && props.epId !== null)
        await deleteEpisode(props.mangaId, props.epId)
      emit("update:model-value", undefined)
      if (props.epId) emit("action:delete", props.epId)
    })

    return
  }

  emit("action:download")
}
</script>
