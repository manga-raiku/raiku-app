<template>
  <router-view />
</template>

<script setup lang="ts">
import eruda2 from "eruda2"

if (import.meta.env.DEV) eruda2.init()
</script>
