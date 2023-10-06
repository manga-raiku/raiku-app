<route lang="yaml">
name: "index"
alias: ["/~:sourceId?"]
meta:
  transparentHeader: true
  hiddenDrawer: true
  noSpaceHeader: true
  needSelectPlugin: true
</route>

<template>
  <q-page
    :style-fn="
      (offset, height) => {
        return {
          height: height + 'px'
        }
      }
    "
  >
    <template v-if="data && !loading">
      <swiper
        :space-between="10"
        :centered-slides="true"
        :modules="[Autoplay, Carousel]"
        loop
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false
        }"
        @real-index-change="sliderIndex = $event.realIndex"
        class="swiper-hot"
      >
        <swiper-slide
          v-for="(item, index) in data.sliders"
          :key="index"
          v-ripple
          class="!flex flex-col items-center slide"
          @click="router.push(item.route)"
        >
          <div
            class="flex-1 flex items-center justify-center w-full h-full backdrop-bg <sm:pt-50px"
            :style="{
              '--data-src': `url(${item.image})`
            }"
          >
            <img
              v-if="$q.screen.gt.xs"
              :src="item.image"
              class="absolute poster z-1 h-full block object-fit-cover"
            />
            <div
              v-else
              class="info z-400 !relative h-full flex flex-nowrap !px-3"
            >
              <div class="w-200px max-w-40% pt-4 text-center">
                <div
                  :ref="($el) => (leftSecRefs[index] = $el as HTMLDivElement)"
                >
                  <q-img
                    no-spinner
                    :src="item.image"
                    :ratio="250 / 357"
                    class="w-full rounded-20px block"
                  />

                  <q-btn
                    rounded
                    class="bg-main mt-2 xs:mt-4 pointer-events-all mx-auto"
                    no-caps
                    :to="item.last_chapters[0].route"
                  >
                    <i-fluent-play-24-filled
                      width="1.3em"
                      height="1.3em"
                      class="mr-2"
                    />
                    {{ $t("doc-ngay") }}
                  </q-btn>
                </div>
              </div>
              <div class="pl-3 min-w-0 pt-4 w-auto flex-1">
                <div
                  :ref="
                    ($el) => (rightTopSecRefs[index] = $el as HTMLDivElement)
                  "
                >
                  <div class=" ">
                    <div class="text-18px text-weight-medium line-clamp-2">
                      {{ item.name }}
                    </div>
                    <small
                      class="display-block ellipsis text-12px text-gray-200"
                      >{{ item.othername }}</small
                    >
                  </div>
                  <div class="focus-item-info !display-block">
                    <div class="ellipsis flex items-center">
                      <Quality v-if="item.label">{{ item.label }}</Quality>

                      <q-separator vertical class="mx-2" />

                      <span class="focus-item-update">
                        {{ $t("chuong-name", [item.last_chapters[0].name]) }}
                      </span>
                    </div>

                    <div
                      class="ellipsis flex items-center text-0.95em text-gray-300 py-2"
                    >
                      {{ item.status }}

                      <q-separator vertical class="mx-2" />

                      <!-- <i-fluent-eye-24-filled class="size-1.5em" /> -->
                      {{ formatView(item.views!) }}
                    </div>
                  </div>
                  <div class="mt-1 text-12px ellipsis">
                    {{ item.tags.join(", ") }}
                  </div>
                </div>
                <!-- action -->
                <!--
              <q-btn
                rounded
                class="bg-main mt-2 sm:mt-4 pointer-events-all"
                no-caps
              >
                <i-fluent-play-24-filled
                  width="1.3em"
                  height="1.3em"
                  class="mr-2"
                  :to="item.last_chapters[0].path"
                />
                Đọc ngay
              </q-btn> -->
                <div
                  class="focus-item-desc !h-0px w-full max-w-full !min-w-0 line-clamp-1 text-13px !leading-normal"
                  :style="{
                    '-webkit-line-clamp': Math.round(
                      (leftSecRefs[index]?.offsetHeight -
                        rightTopSecRefs[index]?.offsetHeight) /
                        25
                    ),
                    'line-clamp': Math.round(
                      (leftSecRefs[index]?.offsetHeight -
                        rightTopSecRefs[index]?.offsetHeight) /
                        25
                    ),
                    height:
                      leftSecRefs[index] && rightTopSecRefs[index]
                        ? 'auto !important'
                        : undefined
                  }"
                >
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <div v-if="$q.screen.gt.xs" class="drop-left z-2"></div>
        <div v-if="$q.screen.gt.xs" class="drop-center z-2"></div>
        <div v-if="$q.screen.gt.xs" class="drop-right z-2"></div>

        <transition v-if="$q.screen.gt.xs" name="q-transition--fade">
          <div :key="sliderIndex" class="info pointer-events-none">
            <div class=" ">
              <div class="text-20px text-weight-medium line-clamp-2">
                {{ data.sliders[sliderIndex].name }}
              </div>
              <small class="display-block ellipsis text-12px text-gray-200">{{
                data.sliders[sliderIndex].othername
              }}</small>
            </div>
            <div class="focus-item-info">
              <Quality v-if="data.sliders[sliderIndex].label">{{
                data.sliders[sliderIndex].label
              }}</Quality>

              <q-separator vertical class="mx-2" />

              <span class="focus-item-update">
                {{
                  $t("chuong-name", [
                    data.sliders[sliderIndex].last_chapters[0].name
                  ])
                }}
              </span>

              <q-separator vertical class="mx-2" />

              {{ data.sliders[sliderIndex].status }}

              <q-separator vertical class="mx-2" />

              <!-- <i-fluent-eye-24-filled class="size-1.5em" /> -->
              {{ formatView(data.sliders[sliderIndex].views!) }}
            </div>
            <div class="mt-1 text-12px ellipsis">
              {{ data.sliders[sliderIndex].tags.join(", ") }}
            </div>
            <div
              class="focus-item-desc text-gray-200 line-clamp-3 sm:line-clamp-2 md:line-clamp-5 !leading-normal"
            >
              {{ data.sliders[sliderIndex].description }}
            </div>

            <!-- action -->

            <q-btn
              rounded
              class="bg-main mt-2 sm:mt-4 pointer-events-all"
              no-caps
              :to="data.sliders[sliderIndex].last_chapters[0].route"
            >
              <i-fluent-play-24-filled
                width="1.3em"
                height="1.3em"
                class="mr-2"
              />
              {{ $t("doc-ngay") }}
            </q-btn>
          </div>
        </transition>
        <div
          v-if="$q.screen.gt.xs"
          class="mark-b w-full h-[30%] z-300 absolute bottom-0 pointer-events-none"
          :style="{
            'background-image': `linear-gradient(
                rgba(17, 19, 25, 0) 2%,
                rgb(17, 19, 25) 94%
              )`
          }"
        />
      </swiper>

      <div class="px-2 sm:px-4 md:px-8">
        <!-- test void swap -->
        <h3 class="text-17px text-light-900">{{ $t("hot-trong-ngay") }}</h3>
        <swiper
          :slides-per-view="1.1"
          :centered-slides="$q.screen.xs"
          :space-between="8"
          :modules="[]"
          :breakpoints="{
            [$q.screen.sizes.sm]: {
              slidesPerView: 2.1,
              centeredSlides: false
            },
            [$q.screen.sizes.md]: {
              slidesPerView: 3.2,
              centeredSlides: false
            }
          }"
          class="<sm:!ml--4"
        >
          <swiper-slide
            v-for="(items, i) in unflat(data.hot, 3)"
            :key="i"
            class="px-1"
            :class="{
              'pl-0': i === 0
            }"
          >
            <CardVertical
              v-for="item in items"
              :key="item.name"
              :data="item"
              img-width="100px"
              class="my-2 text-13px"
            />
          </swiper-slide>
        </swiper>

        <!-- /test void swap -->

        <!--
    <div class="mx-4 sm:mx-6 md:mx-11 relative">
      <swiper
        :slides-per-view="3"
        :navigation="{
          nextEl: '.swiper-button-next-1',
          prevEl: '.swiper-button-prev-1',
        }"
        :modules="[Navigation]"
        :breakpoints="{
          [$q.screen.sizes.sm]: {
            slidesPerView: 4,
          },
          [$q.screen.sizes.md]: {
            slidesPerView: 6,
          },
        }"
      >
        <swiper-slide
          v-for="item in data.hot"
          :key="item.name"
          class="card-wrap"
        >
          <Card :data="item" />
        </swiper-slide>
      </swiper>

      <div class="nav-btn swiper-button-prev swiper-button-prev-1" />
      <div class="nav-btn swiper-button-next swiper-button-next-1" />
    </div> -->

        <!-- show genres -->
        <!-- <section v-if="!$q.screen.lt.md"
      class="mx-4 sm:mx-6 md:mx-8 mb-5 mt-7 flex flex-nowrap items-center justify-between"
    >
      <div>
        <q-btn
          v-for="item in genres"
          :key="item.name"
          :to="item.path"
          no-caps
          rounded
          unelevated
          class="text-15px font-family-poppins hover:!text-main-3 transition-color duration-200"
          >{{ item.name }}</q-btn
        >
      </div>
      <q-btn
        no-caps
        rounded
        unelevated
        class="text-15px font-family-poppins text-main-4"
      >
        Tất cả thể loại
        <i-fluent-chevron-right-24-regular
          width="1.3rem"
          height="1.3rem"
        />
      </q-btn>
    </section> -->
        <!-- /show genres -->

        <BannerTitle>{{ $t("moi-cap-nhat") }}</BannerTitle>
        <GridCard :items="data.last_update" />
      </div>
    </template>
    <ErrorDisplay
      v-else-if="error"
      :error="error"
      :retry-async="refreshAsync"
    />
    <div v-else class="absolute w-full h-full overflow-hidden loader">
      <div class="swiper-hot">
        <q-responsive :ratio="583 / 306" class="poster">
          <q-skeleton type="rect" width="100%" height="100%" />
        </q-responsive>
        <div
          class="mark-b w-full h-[30%] z-101 absolute bottom-0 pointer-events-none"
          :style="{
            'background-image': `linear-gradient(
            rgba(17, 19, 25, 0) 2%,
            rgb(17, 19, 25) 94%
          )`
          }"
        />
      </div>

      <div
        class="mx-4 sm:mx-6 md:mx-13 relative whitespace-nowrap overflow-hidden"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="display-inline-block px-3 w-90% sm:w-49% md:w-31%"
        >
          <CardVerticalSKT v-for="j in 3" :key="j" class="my-2" />
        </div>
      </div>

      <div class="mx-4 sm:mx-6 md:mx-8 relative">
        <q-skeleton type="text" width="7rem" class="text-h6" />

        <SkeletonGridCard :count="6" />
      </div>

      <div class="mx-4 sm:mx-6 md:mx-8 relative">
        <q-skeleton type="text" width="7rem" class="text-h6" />

        <div class="wpa-grid">
          <div class="ctnr">
            <SkeletonCard
              v-for="item in 12"
              :key="item"
              class="card-wrap inline-block"
            />
          </div>
        </div>
      </div>

      <div class="mx-4 sm:mx-6 md:mx-8 relative">
        <q-skeleton type="text" width="7rem" class="text-h6" />

        <div class="wpa-grid">
          <q-skeleton type="text" width="100%" />
          <div class="ctnr">
            <SkeletonCard
              v-for="item in 12"
              :key="item"
              class="card-wrap inline-block"
            />
          </div>
        </div>
      </div>

      <div class="mx-4 sm:mx-6 md:mx-8 relative">
        <q-skeleton type="text" width="7rem" class="text-h6" />

        <SkeletonGridCard :count="6" />
      </div>
    </div>
  </q-page>

  <FABPluginSelect v-model="paramSourceId" />
</template>

<script setup lang="ts">
// import data from "src/apis/parsers/__test__/assets/index.json"
import { formatView } from "src/logic/formatView"
import { unflat } from "src/logic/unflat"
import { Autoplay } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"

import "@fontsource/poppins"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"
import "swiper/css/grid"
// Import Swiper Vue.js components

const props = defineProps<{
  sourceId?: string
}>()

const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const pluginStore = usePluginStore()

const paramSourceId = ref(props.sourceId ?? null)
watch(paramSourceId, (sourceId) => {
  if (sourceId) router.push(`/~${sourceId}`)
})

const sourceId = computed(() => {
  return paramSourceId.value ?? pluginStore.pluginMain
})
watchImmediate(paramSourceId, async (sourceId) => {
  if (!sourceId) {
    const id =
      pluginStore.pluginMain ??
      (await pluginStore.pluginMainPromise) ??
      undefined
    if (id && route.name === "index") router.replace("/~" + id)
  }
})

const title = "Raiku"
const description = computed(() => i18n.t("app-des"))
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const leftSecRefs = shallowReactive<HTMLDivElement[]>([])
const rightTopSecRefs = shallowReactive<HTMLDivElement[]>([])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Carousel({ swiper, on }: any) {
  on("beforeInit", () => {
    if (swiper.params.effect !== "carousel") return
    swiper.classNames.push(`${swiper.params.containerModifierClass}carousel`)
    const newParams = {
      watchSlidesProgress: true,
      centeredSlides: true
    }
    Object.assign(swiper.params, newParams)
    Object.assign(swiper.originalParams, newParams)
  })
  on("progress", () => {
    if (swiper.params.effect !== "carousel") return
    const numSlides = swiper.slides.length
    for (let i = 0; i < numSlides; i++) {
      const slide = swiper.slides[i]
      const progress = slide.progress
      const absProgress = Math.abs(progress)
      let scale = 1
      if (absProgress > 1) scale = 0.3 * (absProgress - 1) + 1
      const opacityEls = slide.querySelectorAll(
        ".swiper-carousel-animate-opacity"
      )
      const translateX =
        progress * scale * 50 * (swiper.rtlTranslate ? -1 : 1) + "%"
      const scaleVal = 1 - 0.2 * absProgress
      const zIndex = numSlides - Math.abs(Math.round(progress))
      slide.style.transform = `translateX(${translateX}) scale(${scaleVal})`
      slide.style.zIndex = zIndex
      slide.style.opacity = absProgress > 3 ? 0 : 1
      opacityEls.forEach((el: HTMLDivElement) => {
        el.style.opacity = 1 - absProgress / 3 + ""
      })
    }
  })
  on("setTransition", (duration: number, speed: number) => {
    if (swiper.params.effect === "carousel") {
      for (let i = 0; i < swiper.slides.length; i++) {
        const slide = swiper.slides[i]
        const opacityEls = slide.querySelectorAll(
          ".swiper-carousel-animate-opacity"
        )
        slide.style.transitionDuration = `${speed}ms`
        opacityEls.forEach((el: HTMLDivElement) => {
          el.style.transitionDuration = `${speed}ms`
        })
      }
    }
  })
}

const api = pluginStore.useApi(sourceId, true)
const { data, error, loading, refreshAsync } = useRequest(
  () => api.value.then((res) => res.index()),
  {
    refreshDeps: [api]
  }
)

const sliderIndex = ref(0)
</script>

<style lang="scss" scoped>
.nav-btn {
  width: 2em;
  height: 2em;
  --swiper-navigation-size: 25px;
  font-weight: bold;
  color: white;

  &.swiper-button {
    &-next {
      right: 30px;
    }

    &-prev {
      left: 30px;
    }
  }
}

.swiper-hot {
  position: relative;
  overflow: hidden;
  margin-bottom: -15.5%;
  cursor: pointer;
  z-index: 0;
  width: 100%;
  height: 48vw; //56vw
  &,
  & .slide {
    min-height: 48vw;
  }
  max-height: 1012px;

  $height: auto; //60vh;
  height: $height; //auto;
  @media screen and (max-width: $breakpoint-xs-max) {
    margin-bottom: 0; //16px;
    @media (min-aspect-ratio: 1/1) {
      // min-height: 480px;
    }

    .poster {
      min-height: 48vw;
      height: max(/*calc(100vw / v-bind("aspectRatio")),*/ #{$height}, 56vw);
    }
  }

  @media (min-width: $breakpoint-sm-min) {
    margin-bottom: -10%;
  }

  @media (min-width: $breakpoint-md-min) {
    margin-bottom: -16%;
  }

  .drop {
    &-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 30%;
      height: 100%;
      background: linear-gradient(
        269deg,
        rgba(20, 30, 51, 0) 1%,
        rgba(20, 30, 51, 0.02) 10%,
        rgba(20, 30, 51, 0.05) 18%,
        rgba(20, 30, 51, 0.12) 25%,
        rgba(20, 30, 51, 0.2) 32%,
        rgba(20, 30, 51, 0.29) 38%,
        rgba(20, 30, 51, 0.39) 44%,
        rgba(20, 30, 51, 0.5) 50%,
        rgba(20, 30, 51, 0.61) 57%,
        rgba(20, 30, 51, 0.71) 63%,
        rgba(20, 30, 51, 0.8) 69%,
        rgba(20, 30, 51, 0.88) 76%,
        rgba(20, 30, 51, 0.95) 83%,
        rgba(20, 30, 51, 0.98) 91%,
        rgb(20, 30, 51) 100%
      );
      z-index: 101;

      @media screen and (max-width: 767px) {
        display: none;
      }
    }

    &-center {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 120px;
      opacity: 0.7;
      background-image: linear-gradient(
        179.5deg,
        rgba(17, 19, 25, 0.88) 0%,
        rgba(17, 19, 25, 0.89) 9%,
        rgba(17, 19, 25, 0.85) 17%,
        rgba(17, 19, 25, 0.79) 24%,
        rgba(17, 19, 25, 0.72) 31%,
        rgba(17, 19, 25, 0.64) 37%,
        rgba(17, 19, 25, 0.55) 44%,
        rgba(17, 19, 25, 0.45) 50%,
        rgba(17, 19, 25, 0.35) 56%,
        rgba(17, 19, 25, 0.26) 63%,
        rgba(17, 19, 25, 0.18) 69%,
        rgba(17, 19, 25, 0.11) 76%,
        rgba(17, 19, 25, 0.05) 83%,
        rgba(17, 19, 25, 0.01) 91%,
        rgba(17, 19, 25, 0) 100%
      );
    }

    &-right {
      position: absolute;
      right: 0;
      top: 0;
      width: 15%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(20, 30, 51, 0) 1%,
        rgba(20, 30, 51, 0.02) 10%,
        rgba(20, 30, 51, 0.05) 18%,
        rgba(20, 30, 51, 0.12) 25%,
        rgba(20, 30, 51, 0.2) 32%,
        rgba(20, 30, 51, 0.29) 38%,
        rgba(20, 30, 51, 0.39) 44%,
        rgba(20, 30, 51, 0.5) 50%,
        rgba(20, 30, 51, 0.61) 57%,
        rgba(20, 30, 51, 0.71) 63%,
        rgba(20, 30, 51, 0.8) 69%,
        rgba(20, 30, 51, 0.88) 76%,
        rgba(20, 30, 51, 0.95) 83%,
        rgba(20, 30, 51, 0.98) 91%,
        rgb(20, 30, 51) 100%
      );
      z-index: 101;

      @media screen and (max-width: 1808px) {
        display: none;
      }
    }
  }

  .info {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    color: rgb(255, 255, 255);
    width: 100%;
    padding: 60px 30px calc(15% + 24px + 3.5vw) (30px + 64);
    @media screen and (max-width: $breakpoint-xs-max) {
      padding-top: 0;
    }
    // padding-top: 0;
    background-image: linear-gradient(
      -180deg,
      rgba(0, 0, 0, 0) 0,
      #000000 100%
    );

    @media (min-width: $breakpoint-sm-min) {
      font-size: 1.3rem;
    }

    @media screen and (max-width: 1024px) {
      padding: {
        bottom: 20px;
        left: 34px; //15px
      }
    }

    @media screen and (max-width: 768px) and (min-width: 599px) {
      padding: {
        bottom: 10%;
        // left: 150px; whitespace -> right
      }
    }

    @media screen and (max-width: 1023px) and (min-width: 768px) {
      padding: {
        left: 56px;
        bottom: 15%;
      }
    }

    .focus-item-info {
      max-width: 80%;
      font-weight: 500;
      margin-top: 12px;
      display: flex;
      font-size: 13px; //12px
      align-items: center;
    }

    .focus-item-desc {
      width: 42.25vw;
      min-width: 320px;
      max-width: 100%;
      overflow: hidden;
      // height: 32px;
      // height: (21px * 3);
      // @media screen and (max-width: 768px) and (min-width: 599px) {
      //   height: (21px * 2);
      // }
      line-height: 16px;
      margin-top: 12px;
      font-size: 14px;
      // display: -webkit-box;
      // text-overflow: ellipsis;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
      font-weight: 400; //500;

      @media screen and (max-width: 1023px) and (min-width: 768px) {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.swiper-mark-left,
.swiper-mark-right {
  background-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8),
    rgba(43, 43, 43, 0)
  );
  @apply absolute top-0 left-0 h-full;
  width: 20%;
  z-index: 10;
}

.swiper-mark-right {
  @apply left-auto right-0;
  transform: scaleX(-1);
}

.backdrop-bg {
  @apply relative;
}

.backdrop-bg:before {
  content: "";
  @apply absolute w-full h-full top-0 left-0;
  background-image: var(--data-src);

  background: {
    repeat: no-repeat;
    size: cover;
    position: center;
  }

  filter: blur(10px);
}

.card-wrap {
  $offset: 0; //0.1;
  display: inline-block;
  white-space: initial;

  width: 280px;
  // class="col-4 col-lg-3 col-xl-2 px-[5px] py-2"
  // max-width: calc((100% - 16px) / #{3 + $offset});
  // padding-right: 8px;

  // @media (min-width: $breakpoint-sm-min) {
  //   max-width: calc((100% - 48px) / #{4 + $offset});
  //   padding-right: 24px;
  // }
  // @media (min-width: $breakpoint-md-min) {
  //   max-width: calc((100%-48px) / #{6 + $offset});
  //   padding-right: 24px;
  // }
  max-width: (100% / 3);
  padding: 0 4px;

  @media (min-width: $breakpoint-sm-min) {
    max-width: (100% / 4);
    padding: 0 14px;
  }

  @media (min-width: $breakpoint-md-min) {
    max-width: (100% / 6);
  }
}
</style>
