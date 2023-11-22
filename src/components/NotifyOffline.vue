<template>
  <q-page-sticky position="bottom" class="z-200">
    <transition name="slide-fade">
      <q-card v-if="modelValue" class="bg-dark-page">
        <q-card-section class="flex flex-nowrap justify-between">
          <i-ic-sharp-download-for-offline class="size-40px text-gray-300" />

          <div class="ml-2">
            <div class="leading-normal">
              {{ $t("title-offline") }}
            </div>
            <small class="text-13px mt-1 text-gray-300">{{
              $t("desc-offline")
            }}</small>

            <div class="flex items-center justify-end mt-3">
              <q-btn
                rounded
                flat
                color="sakura3"
                no-caps
                @click="emit('update:modelValue', false)"
                >{{ $t("khong-cam-on") }}</q-btn
              >
              <q-btn
                rounded
                color="sakura3"
                no-caps
                class="text-black"
                to="/library/offline"
                @click="emit('update:modelValue', false)"
                >{{ $t("di-den-truyen-da-tai") }}</q-btn
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
    </transition>
  </q-page-sticky>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
}>()
</script>

<style lang="scss" scoped>
.bg-dark-page {
  &.slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  &.slide-fade-leave-active {
    transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
  }

  &.slide-fade-enter-from,
  &.slide-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
