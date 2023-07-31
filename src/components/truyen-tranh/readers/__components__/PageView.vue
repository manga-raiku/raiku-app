<template>
  <img :src="srcImage" @load="onLoad" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  src: string
}>()

const srcImage = ref<string | undefined>()
// Free memory
watch(srcImage, (n, o) => {
  if (o?.startsWith("blob:")) URL.revokeObjectURL(o)
})
function onLoad(event: Event) {
  const { src } = event.target as HTMLImageElement
  if (src.startsWith("blob:")) URL.revokeObjectURL(src)
}

// try use ajax
watch(
  () => props.src,
  async (src) => {
    const response = await fetchRetry(src, {
      retries: 5,
      retryDelay: 300,
    })

    // eslint-disable-next-line functional/no-throw-statement
    if (!response.ok) throw new Error("die")

    srcImage.value = URL.createObjectURL(
      new Blob([await response.arrayBuffer()])
    )
  },
  { immediate: true }
)
</script>
