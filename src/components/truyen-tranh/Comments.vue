<template>
  <ul>
    <li v-for="(item, index) in comments" :key="index">
      <Comment :comment="item" class="my-4" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { Comment as CommentT } from "raiku-pgs/plugin"

import Comment from "./__components__/Comment.vue"

defineProps<{
  comments: readonly CommentT[]
}>()
</script>
