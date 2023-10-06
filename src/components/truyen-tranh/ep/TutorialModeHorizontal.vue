<template>
  <transition name="q-transition--fade">
    <div
      v-if="modelValue"
      class="fixed left-1/2 bottom-120px translate-x--1/2 z-10 min-w-280px px-3 pt-3 pb-6 bg-[#000] bg-opacity-96 rounded-3px font-family-poppins"
    >
      <img
        src="~/assets/horizontal_arrow.png"
        class="size-96px mx-auto"
        :class="{
          'rotate-180': rightToLeft
        }"
      />
      <div class="text-16px text-[hsla(0,0%,88.2%,.5)] text-center mx-auto">
        {{ $t("huong-lat") }}
      </div>
      <div
        class="text-24px text-[hsla(0,0%,100%,.9)] text-center mx-auto mt-6px"
      >
        {{ rightToLeft ? $t("phai-sang-trai") : $t("trai-sang-phai") }}
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  rightToLeft: boolean
  modelValue: boolean
}>()

const emit = defineEmits<{
  (name: "update:model-value", value: boolean): void
}>()

watch(
  () => props.modelValue,
  (modelValue) => {
    if (!modelValue) return
    setTimeout(() => emit("update:model-value", false), 3_000)
  }
)
</script>
