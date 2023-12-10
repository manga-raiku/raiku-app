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

let unmounted = false
onBeforeUnmount(() => (unmounted = true))
watch(
  () => props.src,
  async (src, _, onClean) => {
    if (src.startsWith(PROTOCOL_OFFLINE)) {
      // load arrayBuffer
      const { buffer } = await Filesystem.readFile({
        path: src.slice(11),
        directory: Directory.External
      }).then((res) => base64ToUint8(res.data))

      if (unmounted) return

      srcImage.value = URL.createObjectURL(new Blob([buffer]))
      onClean(() => URL.revokeObjectURL(srcImage.value))
    } else {
      srcImage.value = src
    }
  },
  { immediate: true }
)
</script>
