<template>
  <ul>
    <li v-for="(item, index) in comments" :key="index">
      <Comment
        :comment="item"
        class="my-3"
        :book-id="bookId"
        :team-id="teamId"
        @deleted="emit('deleted', index)"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { Comment as CommentType } from "./__components__/Comment.vue"
import Comment from "./__components__/Comment.vue"

const props = defineProps<{
  comments: CommentType[]
  bookId: number
  teamId: number
}>()
const emit = defineEmits<{
  (name: "deleted", index: number): void
}>()
</script>
