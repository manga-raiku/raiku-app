<template>
  <div class="flex flex-nowrap">
    <div>
      <Avatar
        size="40"
        :srcs="
          [
            comment.author.avatar,
            `https://ui-avatars.com/api/?name=${comment.author.name}`,
          ].filter((item) => item !== NO_AVATAR)
        "
      />
    </div>
    <div>
      <div class="ml-3 min-w-0 bg-[rgba(50,50,50,0.5)] py-1 px-3 rounded-xl">
        <h5 class="text-17px font-regular leading-normal">
          {{ comment.author.name }}
        </h5>
        <h6 class="text-gray-300 leading-normal">
          {{ comment.author.level.name }}
        </h6>

        <p v-html="comment.content" class="leading-normal pt-2 font-16px" />
      </div>

      <div
        class="text-gray-300 text-weight-medium px-5 mt-1 text-13px flex items-center"
      >
        <span class="flex items-center mr-4 cursor-pointer" @click="like">
          <Icon
            icon="fluent:thumb-like-28-filled"
            width="1.3em"
            height="1.3em"
            class="mr-1"
          />
          Thích
          <template v-if="comment.likes || liked"
            >({{ comment.likes + (liked ? 1 : 0) }})</template
          >
        </span>

        <span class="flex items-center mr-4 cursor-pointer">
          <Icon
            icon="fluent:comment-multiple-24-filled"
            width="1.3em"
            height="1.3em"
            class="mr-1"
          />
          Bình luận
        </span>

        <span
          v-if="comment.canDelete"
          class="flex items-center mr-4 cursor-pointer"
          @click="remove"
        >
          <Icon
            icon="fluent:delete-24-filled"
            width="1.3em"
            height="1.3em"
            class="mr-1"
          />
          Xóa
        </span>

        <span class="text-gray-400">{{ dayjs(comment.time).fromNow() }}</span>
      </div>

      <template v-if="comment.replies">
        <small
          v-if="!replies"
          class="px-5 display-block pt-1.5 text-gray-300 text-14px cursor-pointer"
          @click="loadReplies(comment.id)"
          >{{ comment.replies }} bình luận</small
        >
        <small
          v-else-if="loadingReplies"
          class="px-5 flex items-center pt-1.5 text-gray-300 text-14px"
        >
          <q-spinner class="mr-1" />
        </small>
        <Comments
          v-else-if="replies"
          :comments="replies"
          :book-id="bookId"
          :team-id="teamId"
          @deleted="replies.splice($event, 1)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import CommentLike from "src/apis/truyenqq/runs/frontend/comment/like"
import CommentList from "src/apis/truyenqq/runs/frontend/comment/list"
import CommentRmov from "src/apis/truyenqq/runs/frontend/comment/remove"
import dayjs from "src/logic/dayjs"

export interface Comment {
  id: number
  author: {
    avatar: string
    name: string
    level: {
      type: string
      name: string
    }
  }
  /** @type - html */
  content: string
  likes: number
  time: number
  replies: number
  canDelete: boolean
}

const props = defineProps<{
  comment: Comment
  bookId: number
  teamId: number
}>()
const emit = defineEmits<{
  (name: "deleted"): void
}>()

const NO_AVATAR =
  "https://st.truyenqqq.vn/template/frontend/images/noavatar.png"

const replies = shallowRef<Comment[]>()
const loadingReplies = ref(false)
async function loadReplies(parentId: number) {
  loadingReplies.value = true
  const comments = await CommentList(props.bookId, parentId, props.teamId)
  replies.value = comments
  loadingReplies.value = false
}

// === action ===
const liked = ref(false)
async function like() {
  if (liked.value) return
  liked.value = await CommentLike(props.comment.id)
}

async function remove() {
  await CommentRmov(props.comment.id, props.bookId)
  emit("deleted")
}
</script>

<style></style>
