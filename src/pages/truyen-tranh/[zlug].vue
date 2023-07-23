<route lang="yaml">
meta:
  transparentHeader: true
  padding: true
</route>

<template>
  <template v-if="data && !loading">
    <section
      class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 flex flex-nowrap <sm:block"
    >
      <div>
        <div
          class="bg-image-blur"
          :style="{
            '--data-src': `url('${data.image}')`,
          }"
        >
          <q-img
            :src="data.image"
            :ratio="190 / 247"
            class="w-240px <sm:w-190px rounded"
            no-spinner
          />
        </div>
      </div>
      <div class="ml-7 <sm:ml-0">
        <h1
          class="text-28px <sm:text-22px text-[#fff] text-opacity-95 text-weight-regular leading-normal font-family-poppins"
        >
          {{ data.name }}
        </h1>
        <h2
          class="text-18px <sm:text-14px text-[#fff] text-opacity-87 text-weight-regular leading-normal font-family-poppins mt-3"
        >
          {{ data.othername }}
        </h2>

        <div
          class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
        >
          <div class="flex items-center">
            <Icon
              icon="fluent:dual-screen-status-bar-24-regular"
              class="text-pink w-1.2em h-1.2em mr-1"
            />

            {{ data.status }}
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <Icon
              icon="fluent:flash-24-filled"
              class="text-blue w-1.2em h-1.2em mr-1"
            />
            {{ dayjs(data.chapters[0].update).fromNow() }}
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <Icon
              icon="fluent:eye-24-filled"
              class="text-orange w-1.2em h-1.2em mr-1"
            />
            {{ formatView(data.views) }} lượt xem
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <Icon
              icon="material-symbols:thumb-up-rounded"
              class="text-yellow w-1.2em h-1.2em mr-1"
            />
            {{ formatView(data.likes) }} thích
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <Icon
              icon="fluent:heart-24-filled"
              class="text-[#F5574B] w-1.2em h-1.2em mr-1"
            />
            {{
              formatView(
                data.follows +
                  (data.followed === followed ? 0 : data.followed ? -1 : 1)
              )
            }}
            theo dõi
          </div>
        </div>

        <div class="flex items-center mt-3 font-family-poppins">
          <Icon
            icon="fluent:tag-24-regular"
            :rotate="3"
            width="20"
            height="20"
            class="mr-1"
          />

          <q-btn
            v-for="item in data.genres"
            :key="item.path"
            no-caps
            rounded
            unelevated
            class="text-main-2 text-opacity-50 min-h-0 px-2 <sm:bg-light-100 <sm:bg-opacity-10 <sm:text-13px <sm:my-1 <sm:mx-1"
            >#{{ item.name.replace(/ /g, "_") }}</q-btn
          >
        </div>

        <p
          class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80"
        >
          {{ data.description }}
        </p>
      </div>
    </section>

    <section v-if="!$q.screen.xs" class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4">
      <q-btn
        :to="data.chapters.at(-1)!.path"
        rounded
        no-caps
        class="mr-3 btn-action text-weight-normal h-50px text-15px"
      >
        <Icon
          icon="ion:book-outline"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />

        Bắt đầu xem {{ data.chapters.at(-1)!.name }}</q-btn
      >

      <q-btn
        rounded
        no-caps
        outline
        class="mr-3 text-weight-normal h-50px text-15px text-#f15a79"
        @click="followed = !followed"
      >
        <Icon
          :icon="followed ? 'ri:heart-fill' : 'ri:heart-add-line'"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />
        {{ followed ? "Bỏ theo dõi" : "Theo dõi" }}
      </q-btn>

      <q-btn
        rounded
        no-caps
        outline
        class="mr-3 text-weight-normal h-50px text-15px text-#f15a79"
        @click="onClickLike"
      >
        <Icon
          icon="fluent:thumb-like-24-regular"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />
        Thích
      </q-btn>

      <q-btn
        rounded
        no-caps
        outline
        class="mr-3 text-weight-normal h-50px text-15px text-#f15a79"
        @click="onClickShare"
      >
        <Icon
          icon="fluent:share-android-24-regular"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />
        Chia sẻ
      </q-btn>

      <q-btn
        v-if="data.readContinue"
        :to="data.readContinue"
        rounded
        no-caps
        outline
        class="mr-3 text-weight-normal h-50px text-15px text-#f15a79"
        stack
      >
        <Icon
          icon="simple-icons:startrek"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />
        Đọc tiếp
        {{
          data.chapters.find((item) =>
            pathEqual(item.path!, data!.readContinue!)
          )?.name
        }}
      </q-btn>
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <header class="text-28px font-weight-regular">
        Chapter List of {{ data.name }}
      </header>
      <ListChapters :chapters="data.chapters" />
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <header class="text-28px font-weight-regular">
        Comments of {{ data.name }}
      </header>
      <Comments
        :comments="data.comments"
        :book-id="data.id"
        :team-id="data.team_id"
        @deleted="data.comments.splice($event, 1)"
      />
    </section>
  </template>
  <template v-else-if="loading">
    <section
      class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 flex flex-nowrap <sm:block"
    >
      <div>
        <div
          class="bg-image-blur"
          :style="{
            '--data-src': `url()`,
          }"
        >
          <q-responsive :ratio="190 / 247" class="w-240px <sm:w-190px rounded">
            <q-skeleton type="rect" width="100%" height="100%" />
          </q-responsive>
        </div>
      </div>
      <div class="ml-7 <sm:ml-0">
        <q-skeleton
          type="text"
          class="text-28px <sm:text-22px leading-normal"
          width="340px"
        />
        <q-skeleton
          type="text"
          class="text-18px <sm:text-14px leading-normal"
          width="170px"
        />

        <div
          class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
        >
          <div class="flex items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto" />

          <div class="flex items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>
        </div>

        <div class="flex items-center mt-3 font-family-poppins">
          <q-skeleton type="circle" size="1.2em" class="mr-1" />

          <q-skeleton
            v-for="_ in 5"
            :key="_"
            type="QBtn"
            class="min-h-0 px-2 mx-2 my-1 h-20px <sm:bg-light-100 <sm:bg-opacity-10 <sm:text-13px <sm:my-1 <sm:mx-1 rounded-[30px]"
          />
        </div>

        <p
          class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80"
        >
          <q-skeleton type="text" />
          <q-skeleton type="text" width="50%" />
        </p>
      </div>
    </section>

    <section v-if="!$q.screen.xs" class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4">
      <q-skeleton
        type="QBtn"
        rounded
        width="120px"
        class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
      />
      <q-skeleton
        type="QBtn"
        rounded
        width="118px"
        class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
      />
      <q-skeleton
        type="QBtn"
        rounded
        width="97px"
        class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
      />
      <q-skeleton
        type="QBtn"
        rounded
        width="109px"
        class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
      />
      <q-skeleton
        type="QBtn"
        rounded
        width="175px"
        class="mr-3 text-weight-normal h-50px text-15px rounded-[30px] display-inline-block"
      />
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <q-skeleton type="text" class="text-28px" width="356px" />
      <ListChaptersSKT />
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <q-skeleton type="text" class="text-28px" width="370px" />
      <CommentsSKT />
    </section>
  </template>

  <p class="whitespace-pre-wrap">{{ data }}</p>

  <q-footer
    v-if="$q.screen.xs && data"
    class="bg-dark-page"
    style="box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1)"
  >
    <q-toolbar class="h-60px w-90% mx-auto justify-between">
      <q-btn
        rounded
        outline
        no-caps
        class="text-#f15a79 min-h-0 h-35px w-15%"
        @click="followed = !followed"
      >
        <Icon
          icon="fluent:share-android-24-regular"
          width="1.3em"
          height="1.3em"
        />
      </q-btn>

      <q-btn
        rounded
        outline
        no-caps
        class="text-#f15a79 min-h-0 h-35px w-15%"
        @click="followed = !followed"
      >
        <Icon
          :icon="followed ? 'ri:heart-fill' : 'ri:heart-add-line'"
          width="1.3em"
          height="1.3em"
        />
      </q-btn>

      <q-btn
        :to="data.chapters.at(-1)!.path"
        rounded
        no-caps
        class="btn-action text-weight-normal min-h-0 h-35px font-normal max-w-60% w-full"
      >
        <Icon
          icon="ion:book-outline"
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />

        Xem {{ data.chapters.at(-1)!.name }}</q-btn
      >
    </q-toolbar>
  </q-footer>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.json"
import { Icon } from "@iconify/vue"
import { useShare } from "@vueuse/core"
import Like from "src/apis/runs/frontend/regiter-like"
import Subscribe from "src/apis/runs/frontend/subscribe"
import Manga from "src/apis/runs/truyen-tranh/[slug]"
import dayjs from "src/logic/dayjs"
import { formatView } from "src/logic/formatView"
import { pathEqual } from "src/logic/path-equal"

const props = defineProps<{
  zlug: string
}>()

const $q = useQuasar()
const { share } = useShare()
const router = useRouter()
const route = useRoute()
const { data, loading, error, run } = useRequest(() => Manga(props.zlug), {
  refreshDeps: [() => props.zlug],
  refreshDepsAction() {
    // data.value = undefined
    run()
  },
})
watch(error, (error) => {
  if (error?.message === "not_found")
    router.replace({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: "not_found" as any,
      params: {
        catchAll: route.path.split("/").slice(1),
      },
      query: route.query,
      hash: route.hash,
    })
})

function onClickShare() {
  if (!data.value) return
  share({
    title: `Đọc ${data.value.name} ${
      data.value.othername ? `(${data.value.othername})` : ""
    }`,
    text: `Đọc ${data.value.name} ${
      data.value.othername ? `(${data.value.othername})` : ""
    }`,
    url: location.href,
  })
}

const $followed = ref(false)
watch(
  () => data.value?.followed,
  (followed = false) => ($followed.value = followed),
  { immediate: true }
)

const followed = computed<boolean>({
  get: () => $followed.value,
  async set(value) {
    $followed.value = value
    if (!data.value) return

    const id = data.value.id
    const subed = await Subscribe(id)
    if (value !== subed) await Subscribe(id)
  },
})

async function onClickLike() {
  if (!data.value) return

  try {
    // eslint-disable-next-line functional/no-throw-statement
    if (!(await Like(data.value.id))) throw new Error("liked")
  } catch (err) {
    if ((err as Error | undefined)?.message === "liked") {
      $q.notify({
        message: "Bạn đã thích manga này rồi",
      })
      return
    }

    console.error(err)
  }
}
</script>

<style lang="scss" scoped>
.btn-action {
  background: #ff204e;
  box-shadow: 0px 5px 10px rgba(255, 32, 78, 0.3);
}

.bg-image-blur {
  @apply relative py-4 flex items-center justify-center;

  &:before {
    content: "";
    @apply absolute top-0 left-0 w-full h-full;
    background: {
      image: var(--data-src);
      size: cover;
    }
    filter: blur(123px); //62px
  }
}
</style>
