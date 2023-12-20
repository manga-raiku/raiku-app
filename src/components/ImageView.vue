<template>
  <q-img
    no-spinner
    :src="srcImage"
    :ratio="190 / 247"
    :initial-ratio="190 / 247"
    class="!rounded-4px"
    @load="onLoad"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  src: string
}>()

const srcImage = ref("")
// Free memory
watch(srcImage, (n, o) => {
  if (o?.startsWith("blob:")) URL.revokeObjectURL(o)
})
function onLoad() {
  if (srcImage.value.startsWith("blob:")) URL.revokeObjectURL(srcImage.value)
}

watch(
  () => props.src,
  async (src, _, onClean) => {
    srcImage.value = await fastProcessImage(src)
    onClean(() => URL.revokeObjectURL(srcImage.value))
  },
  { immediate: true }
)
</script>
