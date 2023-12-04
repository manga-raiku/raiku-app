import type { Database } from "app/database"
import { defineStore } from "pinia"
import type { ID } from "raiku-pgs/plugin"

Object.assign(window, { supabase })

export const useFollowStore = defineStore("follow", () => {
  const authStore = useAuthStore()
  const pluginStore = usePluginStore()

  async function get(lastIndex?: number) {
    await authStore.assert()

    const res = supabase
      .from("follow")
      .select("*")
      .order("created_at", {
        ascending: false
      })
      .limit(30)

    const { data, error } = lastIndex
      ? await res.range(lastIndex, lastIndex + 30)
      : await res

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error

    const { data: data2, error: error2 } = await supabase
      .from("history_manga")
      .select("name:last_ch_name, param:last_ch_param, manga_id, updated_at")
      .in(
        "manga_id",
        data.map((item) => item.manga_id)
      )

    // eslint-disable-next-line functional/no-throw-statement
    if (error2) throw error2

    const storeRead = new Map(data2.map((item) => [item.manga_id, item]))

    return Promise.all(
      data.map(async (item) => {
        try {
          const { resolveImage } = (await pluginStore.get(item.source_id)).meta

          if (resolveImage)
            item.image = resolveImageWithReplacer(item.image, resolveImage)
        } catch (err) {
          WARN(err)
        }

        return {
          ...item,
          history: storeRead.get(item.manga_id)
        }
      })
    )
  }

  // eslint-disable-next-line camelcase
  async function check(manga_id: ID) {
    const session = await authStore.assert()

    const { data, error } = await supabase
      .from("follow")
      .select("id")
      .eq("manga_id", manga_id)
      .eq("user_id", session.user.id)
      .limit(1)

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error

    return data.length > 0
  }

  async function set(
    row: Omit<
      Database["public"]["Tables"]["follow"]["Row"],
      "created_at" | "user_id" | "id"
    >,
    follow: boolean
  ) {
    const session = await authStore.assert()

    if (follow) {
      const { error } = await supabase.from("follow").upsert(row, {
        ignoreDuplicates: true,
        onConflict: "manga_id, user_id"
      })

      // eslint-disable-next-line functional/no-throw-statement
      if (error) throw error
      return true
    }
    const { error } = await supabase
      .from("follow")
      .delete()
      .eq("manga_id", row.manga_id)
      .eq("user_id", session.user.id)
    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return true
  }

  const follow = (row: Database["public"]["Tables"]["follow"]["Row"]) =>
    set(row, true)
  const unfollow = (row: Database["public"]["Tables"]["follow"]["Row"]) =>
    set(row, false)

  return { get, set, check, follow, unfollow }
})
