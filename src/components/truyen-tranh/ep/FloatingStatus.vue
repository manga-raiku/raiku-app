<template>
  <div
    class="fixed left-2% bottom-2% z-2 px-12px py-8px text-12px text-[hsla(0,0%,100%,.7)] bg-[rgba(48,48,48,.7)] rounded-3px font-family-poppins flex items-center"
  >
    <div
      class="vertical-middle relative text-[hsla(0,0%,100%,.3)]"
      data-cy="image"
    >
      <img
        :src="scrollingMode || singlePage ? img_single : img_double"
        class="h-32px my-auto"
        :class="{
          'rotate-90': scrollingMode,
          'rotate-180': rightToLeft
        }"
      />

      <template v-if="scrollingMode || singlePage">
        <span class="absolute top-1/2 left-1/2 translate--1/2">
          {{ currentPage + 1 }}
        </span>
      </template>
      <template v-else>
        <span class="absolute top-1/2 left-1/4 translate--1/2">
          {{
            indexed?.[absCurrentPage]?.[rightToLeft ? 1 : 0] ??
            absCurrentPage * (singlePage ? 1 : 2) +
              1 +
              (rightToLeft ? 1 : 0) -
              sizeOldPages
          }}
        </span>
        <span class="absolute top-1/2 left-3/4 translate--1/2">
          {{
            indexed?.[absCurrentPage]?.[rightToLeft ? 0 : 1] ??
            absCurrentPage * (singlePage ? 1 : 2) +
              1 +
              (rightToLeft ? 0 : 1) -
              sizeOldPages
          }}
        </span>
      </template>
    </div>

    <div class="ml-2" data-cy="text">
      <div>
        {{
          $t("page-p-per", [
            pagesLength ?? "_",
            Math.round(((absCurrentPage + 1) / sizePage) * 100)
          ])
        }}
      </div>
      <div>
        {{ $t("ep-name", [metaEp ? (metaEp?.name) : "_"]) }}
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
  pagesLength?: number
  sizeOldPages: number

  sizes?: Map<number, readonly [number, number]>
  currentPage: number
  sizePage: number

  metaEp?: {
    name: string
  }
}>()

const absCurrentPage = computed(() => Math.abs(props.currentPage))

const indexed = computed(() => {
  if (!props.sizes) return
  const indexed: [number, number?][] = []

  const iMax = props.sizes.size - 1

  for (let i = 0; i < props.sizes.size; i++) {
    const val = props.sizes.get(i)

    if ((val && val?.[0] > 1_200) || i === iMax) {
      // single page
      indexed.push([i + 1])
      continue
    }
    indexed.push([i + 1, ++i + 1])
  }

  return indexed
})
</script>
