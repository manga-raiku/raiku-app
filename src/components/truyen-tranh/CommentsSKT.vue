<template>
  <ul>
    <li v-for="item in 10" :key="item">
      <CommentSKT class="my-3" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import CommentSKT from "./__components__/CommentSKT.vue"
</script>
