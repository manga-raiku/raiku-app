<template>
  <div
    class="w-1/2 h-full display-inline-block overflow-hidden relative"
    :class="{
      'w-full': singlePage
    }"
  >
    <PageView
      class="object-scale-down h-full"
      loader-absolute
      :class="{
        'ml-auto': prime,
        'mx-auto': singlePage
      }"
      :src="src"
      @load="(image, preload) => emit('load', image, preload)"
      ref="pageViewRef"
    >
      <template #loading>
        <slot name="loading" />
      </template>
    </PageView>
  </div>
</template>

<script lang="ts" setup>
import PageView from "./PageView.vue"

defineProps<{
  prime: boolean
  src: string | Promise<string>
  singlePage: boolean
}>()
const emit = defineEmits<{
  (name: "load", image: HTMLImageElement, preload: boolean): void
}>()

const pageViewRef = ref<InstanceType<typeof PageView>>()
defineExpose({
  startLoad: () => pageViewRef.value?.startLoad()
})
</script>
