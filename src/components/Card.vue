<template>
  <router-link :to="data.route" v-ripple class="relative card-wrap">
    <q-card flat dense class="bg-transparent card-main" ref="qCardRef">
      <q-img
        no-spinner
        :src="data.image"
        referrerpolicy="no-referrer"
        :ratio="190 / 247"
        :initial-ratio="190 / 247"
        class="!rounded-[4px]"
        ref="imgRef"
      >
        <BottomBlur v-if="data.last_chapters.length > 0">
          <!-- <div class="text-[30px]">#{{ trending }}</div> -->
          <div class="card-title line-clamp-2 font-family-poppins">
            {{ $t("chuong-name", [data.last_chapters[0].name]) }}
            <small class="display-block">
              {{ dayjs(data.last_chapters[0].updated_at).fromNow() }}
            </small>
          </div>
        </BottomBlur>

        <Quality
          v-if="data.label"
          class="absolute top-2 right-0 backdrop-blur-13px !bg-rgba(0,0,0,0.85) !bg-none"
          >{{ data.label }}</Quality
        >

        <slot name="inside-image" />
      </q-img>
      <span class="a line-clamp-2 min-h-10 mt-1 text-1.2em">{{
        data.name
      }}</span>
    </q-card>

    <q-card v-if="!noHover" class="card-more">
      <q-card-section>
        <h3
          class="text-15px text-weight-medium line-clamp-1 leading-loose text-white"
        >
          {{ data.name }}
        </h3>
        <h4 class="text-12px line-clamp-1 py-1 leading-loose">
          {{ data.othername }}
        </h4>
        <!-- <p class="text-grey-5 text-12px leading-normal">
          <template v-if="data.views">{{
            $t("luot-xem-val", [formatView(data.views)])
          }}</template>
          <template v-if="data.last_chapters[0].updated_at">
            &bull;
            {{
              $t("cap-nhat-ago", [
                dayjs(data.last_chapters[0].updated_at).fromNow(),
              ])
            }}
          </template>
        </p>

        <div class="flex items-center mt-3">
          {{ data.status }}
          <span class="hr-vertical" />
          {{ $t("chuong-name", [data.last_chapters[0].name]) }}
        </div> -->

        <div class="mb-2 text-0.95em">
          <div v-if="data.views">
            {{ $t("val-luot-xem", [formatView(data.views)]) }}
          </div>
          <div class="flex items-center">
            <div v-if="data.likes" class="flex items-center">
              <i-iconamoon-heart-thin class="size-1.2em mr-1" />
              {{ formatView(data.likes) }}
              <q-separator
                v-if="data.comments"
                vertical
                class="mx-2 h-10px my-auto"
              />
            </div>
            <div v-if="data.comments" class="flex items-center">
              <i-iconamoon-comment-dots-light class="size-1.2em mr-1" />
              {{ formatView(data.comments) }}
            </div>
          </div>
        </div>
        <!--
        <div v-if="data.author" class="">
          {{ $t("tac-gia-name", [data.author]) }}
        </div> -->

        <!-- <div class="text-gray-400 mt-2">{{ t("cap-nhat-toi-tap-_duration", [data.process]) }}</div> -->

        <!-- <div class="mt-2 text-[#eee] font-weight-medium">
          {{ $t("gioi-thieu") }}
        </div> -->
        <p class="text-gray-400 text-0.95em line-clamp-3">
          {{ data.description ?? $t("khong-co-mo-ta") }}
        </p>

        <div class="tags mt-2 text-12px line-clamp-2 children:mr-1">
          <span
            v-if="typeof data.tags[0] === 'string'"
            v-for="item in data.tags"
            :key="data.name"
            class="text-gray-300"
          >
            {{ $t("tag-_val", [item]) }}
          </span>
          <template v-else>
            <Tags :items="data.tags as Genre[]" flat />
          </template>
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script lang="ts" setup>
import { QCard, QImg } from "quasar"
import type { Genre, MetaManga } from "raiku-pgs/plugin"
import dayjs from "src/logic/dayjs"
import { formatView } from "src/logic/formatView"

import "@fontsource/poppins"

const props = defineProps<{
  data: MetaManga
  noHover?: boolean
}>()

if (import.meta.env.DEV && props.data.last_chapters.length < 1) {
  WARN("[Card.vue]: last_chapters not found", props.data)
}
</script>

<style lang="scss" scoped>
.card-more {
  &.transition-scale-enter-active,
  &.transition-scale-leave-active {
    transition: transform 0.224s ease;
  }

  &.transition-scale-enter-from,
  &.transition-leave-to {
    transform: scale(0) translate(-50%, -50%);
  }
}

.card-more {
  // font-size: 0.875rem;
  // line-height: 1.5625rem;
  position: absolute;
  left: -1rem;
  top: -1rem;
  right: -1rem;
  transition: 0.2s;
  border-radius: 6px;
  min-height: calc(100% + 1rem);
  z-index: 2;
  background-color: #1a191c;
  color: #818083;
  box-shadow:
    inset 0 0 70px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(0, 0, 0, 0.5);
  opacity: 0; //1;
  visibility: hidden; //visible;
  transform: scale(0); //scale(1);

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}
.card-wrap:hover .card-more {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}
</style>

<style lang="scss" scoped>
.a {
  text-decoration: none;
  user-select: none;
  color: rgb(255, 255, 255);

  min-height: 42px;
  position: relative;
  padding: 0.1rem 0px 0px;
  padding: {
    left: 4px;
    right: 4px;
  }
  font-size: 14px;
  transition: color 0.3s ease 0s;
  line-height: 1.5;

  font-weight: 500;

  @media (max-width: 720px) {
    font-weight: 400;
  }
}

.update-info-layer {
  span {
    color: rgb(255, 255, 255);
    letter-spacing: 0px;
  }
  .star {
    position: absolute;
    right: 8px;
    // right: 10px;
    bottom: 10px;
  }
}
.card-title {
  color: rgb(255, 255, 255);
  font-weight: 500;
  font-size: 14px;
}

.hr-vertical {
  margin: 0px 10px;
  height: 10px;
  width: 2px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
}

.tags {
  > * {
    @apply mr-3 inline-block;
  }

  @media (max-width: 767px) {
    font-size: 13px;

    > * {
      @apply mr-1 mt-1;
    }
  }
}
</style>
