<template>
  <q-card-section>
    <img
      src="~assets/no_internet.svg"
      class="w-240px sm:w-450px max-w-100% mx-auto"
      alt="plugin_error"
    />

    <div class="text-20px text-weight-normal q-my-sm">
      {{ $t("khong-co-ket-noi-internet") }}
    </div>

    <div
      class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
    >
      {{ $t("desc-offline") }}
    </div>
  </q-card-section>
  <q-card-actions align="center">
    <q-btn
      rounded
      class="before:text-#fff text-black before:text-opacity-20 px-4"
      color="main-3"
      padding="8px 20px"
      no-caps
      :loading="retrying"
      @click="retry"
    >
      <i-solar-refresh-circle-line-duotone class="size-1.5em mr-1" />
      {{ $t("thu-lai") }}
    </q-btn>
    <q-btn rounded flat color="main-3" no-caps to="/library/offline">{{
      $t("di-den-truyen-da-tai")
    }}</q-btn>
  </q-card-actions>
</template>

<script lang="ts" setup>
defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()

const stateStore = useStateStore()
</script>
