<template>
  <ul>
    <li v-for="(item, index) in comments" :key="index">
      <Comment :comment="item" class="my-4" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { RComment } from "src/apis/nettruyen/parsers/__helpers__/parseComment"

import Comment from "./__components__/Comment.vue"

defineProps<{
  comments: RComment[]
}>()
</script>
