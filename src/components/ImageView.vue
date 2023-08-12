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
function onLoad(event: Event) {
  if (srcImage.value.startsWith("blob:")) URL.revokeObjectURL(srcImage.value)
}

watch(
  () => props.src,
  async (src) => {
    if (src.startsWith("offline://")) {
      // load arrayBuffer
      const { buffer } = await Filesystem.readFile({
        path: src.slice(11),
        directory: Directory.External,
      }).then((res) => base64ToUint8(res.data))

      srcImage.value = URL.createObjectURL(new Blob([buffer]))
    } else {
      srcImage.value = src
    }
  },
  { immediate: true }
)
</script>

<style></style>
