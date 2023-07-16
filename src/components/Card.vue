<template>
  <router-link :to="data.path" v-ripple>
    <q-card
      flat
      dense
      class="bg-transparent"
      @mousemove="enablePopup ? (eventMouseoverCard = $event) : undefined"
    >
      <q-img
        no-spinner
        :src="data.image"
        referrerpolicy="no-referrer"
        :ratio="190 / 247"
        :initial-ratio="190 / 247"
        class="!rounded-[4px]"
        ref="imgRef"
      >
        <BottomBlur>
          <!-- <div class="text-[30px]">#{{ trending }}</div> -->
          <div class="card-title line-clamp-2 font-family-poppins">
            {{ data.last_chapter.name }}
          </div>
        </BottomBlur>

        <Quality v-if="data.label" class="absolute top-2 right-0">{{
          data.label
        }}</Quality>
        <Quality v-if="data.updated" class="absolute top-2 left-0">{{
          dayjs(data.updated).fromNow()
        }}</Quality>

        <slot name="inside-image" />
      </q-img>
      <span class="a line-clamp-2 min-h-10 mt-1">{{ data.name }}</span>
    </q-card>
  </router-link>

  <q-menu
    v-if="enablePopup"
    ref="menuRef"
    no-parent-event
    anchor="center right"
    self="center left"
    touch-position
    class="bg-[rgba(20,22,27,0.98)] scrollbar-custom overflow-x-visible !max-w-[280px] md:!max-w-[320px]"
    @mouseover.stop
  >
    <q-card class="bg-transparent" ref="cardMenuRef">
      <q-card-section>
        <h3
          class="text-subtitle1 font-weight-medium line-clamp-3 leading-normal"
        >
          {{ data.name }}
        </h3>
        <h4 class="text-grey-5 text-[13px] leading-normal">
          <template v-if="data.views"
            >Lượt xem {{ formatView(data.views) }}</template
          >
          <template v-if="data.updated">
            &bull; Cập nhật
            {{ dayjs(data.updated).fromNow() }}
          </template>
        </h4>

        <div class="flex items-center mt-3">
          <Quality v-if="data.label" class="!mr-0">{{ data.label }}</Quality>
          <span v-if="data.label" class="hr-vertical" />
          {{ data.status }}
          <span class="hr-vertical" />
          <Icon
            icon="fluent:heart-24-filled"
            class="text-[#F5574B] mr-1"
            width="1.3rem"
            height="1.3rem"
          />
          {{ formatView(data.follows) }} theo dõi
          <span class="hr-vertical" />
          {{ data.last_chapter.name }}
        </div>
        <!-- <div class="text-gray-400 mt-2">{{ t("cap-nhat-toi-tap-_duration", [data.process]) }}</div> -->

        <div class="mt-2 text-[#eee] font-weight-medium">Giới thiệu</div>
        <p class="text-gray-400">{{ data.description ?? "Không có mô tả" }}</p>

        <div class="tags mt-2">
          <span v-for="item in data.tags" :key="data" class="text-gray-300">
            #{{ item }}
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script lang="ts" setup>
import dayjs from "src/logic/dayjs"
import type { CardProps } from "./Card.types"
import { useElementHover, MaybeComputedRef, EventTarget } from "@vueuse/core"
import { debounce } from "quasar"
import { formatView } from "src/logic/formatView"
import { Icon } from "@iconify/vue"

import "@fontsource/poppins"

const props = defineProps<{
  data: CardProps["data"]
}>()

const menuRef = ref<QMenu>()

const imgRef = ref<QImg>()
const cardMenuRef = ref<QCard>()

const eventMouseoverCard = ref<Event | null>(null)
const enablePopup = props.data.views !== null

if (enablePopup) {
  const mouseInCard = useElementHover(
    imgRef as unknown as MaybeComputedRef<EventTarget>
  )
  const mouseInCardMenu = useElementHover(
    cardMenuRef as unknown as MaybeComputedRef<EventTarget>
  )

  const showMenu = debounce(() => {
    if (eventMouseoverCard.value) menuRef.value?.show(eventMouseoverCard.value)
  }, 700)
  watch(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [mouseInCard, mouseInCardMenu] as unknown as any,
    debounce(([outsideCard, outsideCardMenu]) => {
      showMenu.cancel()
      if (outsideCard || outsideCardMenu) showMenu()
      else menuRef.value?.hide()
    }, 10)
  )
}
</script>

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
