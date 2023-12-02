<template>
  <q-card-section>
    <slot v-if="imageSlot" name="image" />
    <img
      v-else
      :src="image"
      class="w-240px sm:w-450px max-w-100% mx-auto"
      :alt="alt"
    />

    <div class="text-20px text-weight-normal q-my-sm">
      <slot v-if="titleSlot" name="title" />
      <template v-else>{{ title }}</template>
    </div>

    <div
      class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
    >
      <slot v-if="captionSlot" name="caption" />
      <template v-else>{{ caption }}</template>
    </div>
  </q-card-section>
  <q-card-actions
    align="center"
    class="flex-nowrap children:mx-1 children:py-2"
  >
    <q-btn
      rounded
      outline
      class="before:text-#fff before:text-opacity-20 px-4"
      color="sakura3"
      padding="8px 20px"
      no-caps
      :loading="retrying"
      @click="retry"
    >
      <i-solar-refresh-circle-line-duotone class="size-1.5em mr-1" />
      {{ $t("thu-lai") }}
    </q-btn>

    <slot name="actions" />
  </q-card-actions>
</template>

<script lang="ts" setup>
defineProps<{
  image?: string
  imageSlot?: boolean
  alt?: string
  title?: string
  titleSlot?: boolean
  caption?: string
  captionSlot?: boolean
  retrying: boolean
  retry: () => void
}>()
</script>
