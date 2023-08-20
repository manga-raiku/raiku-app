import InfoUserInManga from "src/apis/nettruyen/runs/truyen-tranh/[auth]"
import Follow from "src/apis/nettruyen/runs/truyen-tranh/follow"
import type { ShallowRef } from "vue"

export function useInfoReadManga(
  data:
    | Ref<
        | {
            uid: number
            key: string
          }
        | undefined
      >
    | ShallowRef<
        | {
            uid: number
            key: string
          }
        | undefined
      >,
) {
  const authStore = useAuthStore()

  const infoUserInManga = ref<Awaited<ReturnType<typeof InfoUserInManga>>>()
  watch(
    [
      () => data.value?.uid,
      () => authStore.user_data?.userGuid,
      () => authStore.user_data?.token,
    ],
    // eslint-disable-next-line camelcase
    async ([uid, user_uid, token]) => {
      infoUserInManga.value = undefined

      // eslint-disable-next-line camelcase
      if (!uid || !user_uid || !token) return
      infoUserInManga.value = await InfoUserInManga(uid, user_uid, token)
      // https://f.nettruyenmax.com/Comic/Services/ComicService.asmx/GetFollowedButtonComic?comicId=20727&userGuid=c96ea70b-be0c-445b-967d-20a6a73dfb3f&token=AkbYuyg%2BVSQIS19FZqybiNH2x%2BjWGdztxZtYWKqSCNdiYQqH3%2FjHrpyaOzChKISX8V6pAmykk3KdCy2%2BCB79na%2B9sgHLoKN1nn%2BRHhEddAk%3D
    },
  )

  async function toggleFollow() {
    if (
      !data.value?.uid ||
      !data.value?.key ||
      !authStore.user_data?.token ||
      !infoUserInManga.value
    )
      return

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data2 = await Follow(data.value?.uid, data.value.key!)
    infoUserInManga.value.isFollowed = data2.isFollowed
  }

  return {
    data: infoUserInManga,
    toggleFollow,
  }
}
