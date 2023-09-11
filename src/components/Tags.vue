<template>
  <div class="flex items-center font-family-poppins">
    <i-fluent-tag-24-regular :rotate="3" width="20" height="20" class="mr-1" />

    <q-btn
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      no-caps
      rounded
      unelevated
      class="text-main-2 text-opacity-50 min-h-0 px-2 bg-light-100 bg-opacity-10 text-13px my-1 mx-1"
      >#{{ item.name.replace(/ /g, "_") }}</q-btn
    >
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  items: {
    name: string
    path: string
  }[]
}>()
</script>
