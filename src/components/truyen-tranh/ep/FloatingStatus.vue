<template>
  <div
    class="fixed left-2% bottom-2% z-2 px-12px py-8px text-12px text-[hsla(0,0%,100%,.7)] bg-[rgba(48,48,48,.7)] rounded-3px font-family-poppins flex items-center"
  >
    <div
      class="vertical-middle relative text-[hsla(0,0%,100%,.3)]"
      data-cy="image"
    >
      <img
        :src="scrollingMode || singlePage || isSingle ? img_single : img_double"
        class="h-32px my-auto"
        :class="{
          'rotate-90': scrollingMode,
          'rotate-180': rightToLeft
        }"
      />

      <template v-if="scrollingMode || singlePage || isSingle">
        <span class="absolute top-1/2 left-1/2 translate--1/2">
          {{ currentPage + 1 }}
        </span>
      </template>
      <template v-else>
        <span class="absolute top-1/2 left-1/4 translate--1/2">
          {{ rightToLeft ? currentPage + 2 : currentPage + 1 }}
        </span>
        <span class="absolute top-1/2 left-3/4 translate--1/2">
          {{ rightToLeft ? currentPage + 1 : currentPage + 2 }}
        </span>
      </template>
    </div>

    <div class="ml-2" data-cy="text">
      <div>
        {{
          $t("page-p-per", [
            sizePage ?? "_",
            Math.round(((currentPage + 1) / sizePage) * 100)
          ])
        }}
      </div>
      <div class="truncate max-w-5em">
        {{
          $t("ep-name", [metaEp ? parseFloat(metaEp.name) || metaEp.name : "_"])
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line camelcase
import img_double from "src/assets/img_double.png?url"
// eslint-disable-next-line camelcase
import img_single from "src/assets/img_single.png?url"

const props = defineProps<{
  scrollingMode: boolean
  singlePage: boolean
  rightToLeft: boolean
  sizeOldPages: number

  sizes?: Map<number, readonly [number, number]>
  currentPage: number // current page
  sizePage: number // max page

  metaEp?: {
    name: string
  }
}>()

const isSingle = computed(() => {
  if (!props.sizes) return false

  // index
  const indexImageShow = props.currentPage

  return pageIsModeSingle(props.sizes, indexImageShow)
})
</script>
