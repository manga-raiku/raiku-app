<template>
  <pre>{{ IDMStore.queue }}</pre>
</template>

<script lang="ts" setup>
const IDMStore = useIDMStore()

Object.assign(window, { IDMStore })
</script>
