/* eslint-disable functional/no-throw-statement */
import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useFollowStore = defineStore("follow", () => {
  const authStore = useAuthStore()

  async function get(last?: Database["public"]["Tables"]["follow"]["Row"]) {
    await authStore.assert()

    const res = supabase.from("follow").select("*").order("created_at", {
      ascending: false,
    })

    const { data, error } = last ? await res.lt("id", last.id) : await res

    if (error) throw error

    return data
  }

  // eslint-disable-next-line camelcase
  async function check(manga_id: number) {
    const session = await authStore.assert()

    const { data, error } = await supabase
      .from("follow")
      .select("id", { count: "exact"})
      .eq("manga_id", manga_id)
      .eq("user_id", session.user.id)
      .limit(1)

    if (error) throw error

    return data.length > 0
  }

  async function set(
    row: Omit<
      Database["public"]["Tables"]["follow"]["Row"],
      "created_at" | "user_id" | "id"
    >,
    follow: boolean,
  ) {
    const session = await authStore.assert()

    if (follow) {
      const { error } = await supabase.from("follow").upsert(row, {
        ignoreDuplicates: true,
        onConflict: "manga_id, user_id",
      })

      if (error) throw error
      return true
    }
    const { error } = await supabase
      .from("follow")
      .delete()
      .eq("manga_id", row.manga_id)
      .eq("user_id", session.user.id)
    if (error) throw error
    return true
  }

  const follow = (row: Database["public"]["Tables"]["follow"]["Row"]) =>
    set(row, true)
  const unfollow = (row: Database["public"]["Tables"]["follow"]["Row"]) =>
    set(row, false)

  return { get, set, check, follow, unfollow }
})
