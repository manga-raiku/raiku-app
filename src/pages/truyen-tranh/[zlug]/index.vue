<route lang="yaml">
meta:
  padding: true
  noMarginTop: true
</route>

<template>
  <template v-if="data && !loading">
    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 mb-4 flex">
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
      <div class="pl-7 flex-1 <sm:pl-3 py-1rem">
        <h1
          class="text-28px <sm:text-22px text-[#fff] text-opacity-95 text-weight-regular leading-normal font-family-poppins ellipsis-3-lines"
        >
          {{ data.name }}
        </h1>
        <h2
          class="text-18px <sm:text-14px text-[#fff] text-opacity-87 text-weight-regular leading-normal font-family-poppins mt-3 ellipsis-2-lines"
        >
          {{ data.othername }}
        </h2>

        <div
          class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
        >
          <div class="flex <md:w-full items-center">
            <Icon
              icon="fluent:dual-screen-status-bar-24-regular"
              class="text-pink w-1.2em h-1.2em mr-1"
            />

            {{ data.status }}
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto <md:display-none" />

          <div class="flex <md:w-full items-center">
            <Icon
              icon="fluent:flash-24-filled"
              class="text-blue w-1.2em h-1.2em mr-1"
            />
            {{ dayjs(data.updated_at).fromNow() }}
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto <md:display-none" />

          <div class="flex <md:w-full items-center">
            <Icon
              icon="fluent:eye-24-filled"
              class="text-orange w-1.2em h-1.2em mr-1"
            />
            {{ formatView(data.views) }} lượt xem
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto <md:display-none" />

          <div class="flex <md:w-full items-center">
            <Icon
              icon="material-symbols:thumb-up-rounded"
              class="text-yellow w-1.2em h-1.2em mr-1"
            />
            {{ data.rate }} sao / {{ data.count_rate }}
          </div>

          <q-separator vertical class="mx-3 h-12px my-auto <md:display-none" />

          <div v-if="data.follows" class="flex <md:w-full items-center">
            <Icon
              icon="fluent:heart-24-filled"
              class="text-[#F5574B] w-1.2em h-1.2em mr-1"
            />
            {{ formatView(data.follows) }}
            theo dõi
          </div>
        </div>

        <Tags
          class="mt-3"
          v-if="$q.screen.md || $q.screen.gt.md"
          :items="data.genres"
        />
      </div>
      <div class="w-full">
        <Tags class="mt-3" v-if="$q.screen.lt.md" :items="data.genres" />
        <p
          class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80"
        >
          {{ data.description }}
        </p>
      </div>
    </section>

    <section
      v-if="!$q.screen.xs"
      class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 children:my-2"
    >
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

        Bắt đầu xem Ch. {{ data.chapters.at(-1)!.name }}</q-btn
      >

      <q-btn
        rounded
        no-caps
        outline
        class="mr-3 text-weight-normal h-50px text-15px text-#f15a79"
        @click="onClickFollow"
      >
        <Icon
          :icon="
            infoUserInManga?.isFollowed ? 'ri:heart-fill' : 'ri:heart-add-line'
          "
          width="1.3em"
          height="1.3em"
          class="mr-2"
        />
        {{ infoUserInManga?.isFollowed ? "Bỏ theo dõi" : "Theo dõi" }}
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
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <header class="text-28px font-weight-regular">
        Chapter List of {{ data.name }}
      </header>
      <ListChapters
        :chapters="data.chapters"
        :reads-chapter="infoUserInManga?.readsChapter"
      />
    </section>

    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 mt-8">
      <header class="text-28px font-weight-regular">
        Comments of {{ data.name }}
      </header>
      <!-- <Comments
        :comments="data.comments"
        :book-id="data.id"
        :team-id="data.team_id"
        @deleted="data.comments.splice($event, 1)"
      /> -->
    </section>
  </template>
  <template v-else-if="loading">
    <section class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 flex">
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
      <div class="pl-7 flex-1 <sm:pl-3 py-1rem min-w-0">
        <q-skeleton
          type="text"
          class="text-28px <sm:text-22px leading-normal max-w-100%"
          width="340px"
        />
        <q-skeleton
          type="text"
          class="text-18px <sm:text-14px leading-normal max-w-100%"
          width="170px"
        />

        <div
          class="mt-3 flex children:my-1 text-gray-300 text-15px font-family-poppins"
        >
          <div v-for="i in 5" :key="i" class="flex <md:w-full items-center">
            <q-skeleton type="circle" size="1.2em" class="mr-1" />
            <q-skeleton type="text" width="45px" />
          </div>
        </div>

        <TagsSKT class="mt-3" v-if="$q.screen.md || $q.screen.gt.md" />
      </div>
      <div class="w-full">
        <TagsSKT class="mt-3" v-if="$q.screen.lt.md" />
        <p
          class="mt-4 whitespace-pre-wrap text-16px text-[#fff] text-opacity-80"
        >
          <q-skeleton type="text" />
          <q-skeleton type="text" width="50%" />
        </p>
      </div>
    </section>

    <section
      v-if="!$q.screen.xs"
      class="mx-10 md:mx-7 sm:mx-5 <sm:mx-4 my-4 children:my-2"
    >
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
        @click="onClickShare"
      >
        <Icon
          icon="fluent:share-android-24-regular"
          width="1.3em"
          height="1.3em"
        />
      </q-btn>

      <q-btn rounded outline no-caps class="text-#f15a79 min-h-0 h-35px w-15%">
        <Icon
          :icon="true ? 'ri:heart-fill' : 'ri:heart-add-line'"
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

        Xem Ch. {{ data.chapters.at(-1)!.name }}</q-btn
      >
    </q-toolbar>
  </q-footer>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/truyen-tranh/kanojo-mo-kanojo-9164.json"
import { Icon } from "@iconify/vue"
import { useShare } from "@vueuse/core"
// import Like from "src/apis/runs/frontend/regiter-like"
// import Subscribe from "src/apis/runs/frontend/subscribe"
import InfoUserInManga from "src/apis/nettruyen/runs/truyen-tranh/[auth]"
import Manga from "src/apis/nettruyen/runs/truyen-tranh/[slug]"
import Follow from "src/apis/nettruyen/runs/truyen-tranh/follow"
import dayjs from "src/logic/dayjs"
import { formatView } from "src/logic/formatView"

const props = defineProps<{
  zlug: string
}>()

const $q = useQuasar()
const { share } = useShare()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
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
const infoUserInManga = ref<Awaited<ReturnType<typeof InfoUserInManga>>>()
watch(
  [
    () => data.value?.uid,
    () => authStore.user_data?.uid,
    () => authStore.user_data?.token,
  ],
  // eslint-disable-next-line camelcase
  async ([uid, user_uid, token]) => {
    infoUserInManga.value = undefined

    // eslint-disable-next-line camelcase
    if (!uid || !user_uid || !token) return
    infoUserInManga.value = await InfoUserInManga(uid, user_uid, token)
    // https://f.nettruyenmax.com/Comic/Services/ComicService.asmx/GetFollowedButtonComic?comicId=20727&userGuid=c96ea70b-be0c-445b-967d-20a6a73dfb3f&token=AkbYuyg%2BVSQIS19FZqybiNH2x%2BjWGdztxZtYWKqSCNdiYQqH3%2FjHrpyaOzChKISX8V6pAmykk3KdCy2%2BCB79na%2B9sgHLoKN1nn%2BRHhEddAk%3D
  }
)

async function onClickFollow() {
  if (!data.value?.uid || !authStore.user_data?.token || !infoUserInManga.value)
    return

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data2 = await Follow(data.value.uid, data.value.key!)
  infoUserInManga.value.isFollowed = data2.isFollowed
}
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
