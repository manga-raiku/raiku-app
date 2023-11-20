<template>
  <div class="text-center h-full absolute w-full">
    <div v-if="loading" class="pt-[140px]">
      <img
        class="w-240px sm:w-450px max-w-100% mx-auto mt-10"
        src="~assets/checking.webp"
        alt="checking"
      />

      <h3 class="text-[24px]">
        {{ $t("dang-kiem-tra-quyen-khoi-chay") }}
      </h3>
      <p class="text-[14px] mt-3 text-gray-400 leading-normal">
        <q-spinner color="main" size="40px" class="mx-auto" />
      </p>
    </div>
    <div v-else class="pt-[140px]">
      <h3 class="text-[24px] mt-10">{{ $t("ung-dung-da-dung-lai") }}</h3>
      <p class="text-[14px] mt-3 text-red-400 leading-normal">
        <span class="ml-2"
          >{{ $t("msg-not-allow") }}

          <a
            href="https://github.com/manga-raiku/raiku-app"
            target="_blank"
            class="text-blue-400"
            >https://github.com/manga-raiku/raiku-app</a
          >
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
