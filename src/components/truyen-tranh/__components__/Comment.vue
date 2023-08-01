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
          Cấp {{ comment.author.level.current }}
        </h6>

        <p v-html="comment.content" class="leading-normal pt-2 font-16px" />
      </div>

      <div
        class="text-gray-300 text-weight-medium px-5 mt-1 text-13px flex items-center"
      >
        <span class="flex items-center mr-4 cursor-pointer">
          <Icon
            icon="fluent:thumb-like-28-filled"
            width="1.3em"
            height="1.3em"
            class="mr-1"
          />
          Thích
          <template v-if="comment.like"
            >({{ comment.like }})</template
          >
        </span>

        <span class="flex items-center mr-4 cursor-pointer">
          <Icon
            icon="fluent:thumb-dislike-24-filled"
            width="1.3em"
            height="1.3em"
            class="mr-1"
          />
          Không thích
          <template v-if="comment.dislike"
            >({{ comment.dislike }})</template
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

        <span class="text-gray-400">{{ dayjs(comment.created_at).fromNow() }}</span>
      </div>

      <template v-if="comment.replies">
        <Comments
          :comments="comment.replies"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import type { RComment } from "src/apis/nettruyen/parsers/__helpers__/parseComment"
import dayjs from "src/logic/dayjs"

const props = defineProps<{
  comment: RComment
}>()

const NO_AVATAR =
  "https://st.truyenqqq.vn/template/frontend/images/noavatar.png"

</script>
