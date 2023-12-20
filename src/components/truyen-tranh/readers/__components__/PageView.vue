<template>
  <img
    v-bind="attrs"
    :src="empty"
    loading="lazy"
    @load="onLoad"
    ref="imgRef"
    class="min-h-1px border-none"
  />
  <div
    v-if="error"
    v-bind="attrs"
    class="w-550px max-w-100% aspect-ratio-2 flex items-center justify-center py-10"
    :class="loaderAbsolute ? 'absolute top-0 left-0 w-full h-full' : undefined"
  >
    <p>
      {{ $t("error-load-image", [error + "" || -1]) }}
    </p>

    <q-btn
      rounded
      outline
      class="before:text-#fff before:text-opacity-20 px-4"
      color="sakura3"
      padding="8px 20px"
      no-caps
      @click="startLoad"
      :label="$t('thu-lai')"
    />
  </div>
  <div
    v-else-if="!loaded"
    v-bind="attrs"
    class="text-center w-100% min-h-40vh aspect-ratio-2 flex items-center justify-center"
    :class="loaderAbsolute ? 'absolute top-0 left-0 w-full h-full' : undefined"
  >
    <slot name="loading" />
  </div>
</template>

<script lang="ts" setup>
import empty from "src/assets/empty.png?base64"

defineOptions({
  inheritAttrs: true
})

const props = defineProps<{
  src: string | Promise<string>
  loaderAbsolute?: boolean
  observer?: IntersectionObserver
}>()
const emit = defineEmits<{
  (name: "load", img: HTMLImageElement, preload: boolean): void
}>()
const attrs = useAttrs()

const loaded = ref(false)
const error = ref<unknown>()
const emitByAutoLoad = ref(false)
watch(
  () => props.src,
  () => {
    emitByAutoLoad.value = false
  }
)

const imgRef = ref<HTMLImageElement>()
defineExpose({ imgRef, startLoad })
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = imgRef.value

    if (!img) return reject(new Error("Failed load image."))

    img.onerror?.(new Event("error"))

    const clean = () => {
      img.onload = img.onerror = null
      img.loading = "lazy"
    }

    img.onload = function () {
      resolve(img)
      clean()
    }
    img.onerror = function () {
      reject(new Error("Failed load image."))
      clean()
    }
    img.loading = "eager"
    img.src = src
  })
}

async function onLoad() {
  console.log("onload")
  // return
  if (emitByAutoLoad.value) return
  emit("load", imgRef.value!, true)
  return startLoad()
}

// ===========================

let srcLoaded: string | null = null
async function startLoad() {
  emitByAutoLoad.value = true

  const rawSrc = await props.src

  if (rawSrc === srcLoaded) return
  srcLoaded = null

  loaded.value = false
  error.value = null

  try {
    for (let i = 0; i < 5; i++) {
      try {
        const src = await fastProcessImage(rawSrc)
        emit("load", await loadImage(src), false)
        if (src.startsWith("blob:")) URL.revokeObjectURL(src)

        srcLoaded = rawSrc
        return
      } catch (err) {
        if (i < 5) await sleep(300)
        // eslint-disable-next-line functional/no-throw-statement
        else throw err
      }
    }
  } catch (err) {
    WARN("Load image failed: ", { err, url: rawSrc })
    error.value = err

    await sleep(30_000)

    void startLoad()
  } finally {
    loaded.value = true
  }
}

watch([() => props.observer, imgRef], ([observer, img], [, old]) => {
  if (!observer) return
  if (old) props.observer?.unobserve(old)
  if (img) props.observer?.observe(img)
})
onBeforeUnmount(() => imgRef.value && props.observer?.unobserve(imgRef.value))
</script>
