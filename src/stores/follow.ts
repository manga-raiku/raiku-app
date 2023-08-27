import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useFollowStore = defineStore("follow", () => {
  const authStore = useAuthStore()

  async function getRows(last: Database["public"]["Tables"]["follow"]["Row"]) {
    const res = supabase.from("follow").select("*").order("created_at", {
      ascending: false,
    })

    const { data, error } = last ? await res.lt("id", last.id) : await res

    if (error) throw error

    return data
  }

  // eslint-disable-next-line camelcase
  async function isFollowed(manga_id: number) {
    const { data, error } = await supabase
      .from("follow")
      .select("1")
      .eq("manga_id", manga_id)
      .limit(1)

    if (error) throw error

    return data.length > 0
  }

  async function setFollowed(
    row: Database["public"]["Tables"]["follow"]["Row"],
    follow: boolean,
  ) {
    if (follow) {
      const { data, error } = await supabase
        .from("follow")
        .select("1")
        .eq("manga_id", row.manga_id)
        .eq("user_id", authStore.user?.id)

      if (error) throw error
      return data.length > 0
    }
    const { data, error } = await supabase.from("follow").insert(row)

    if (error) throw error
    return true
  }

  return { getRows, setFollowed, isFollowed }
})
