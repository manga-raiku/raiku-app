import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useHistoryStore = defineStore("history", () => {
  const authStore = useAuthStore()

  async function get(lastId?: number) {
    const res = supabase.from("history_manga").select("*").order("updated_at", {
      ascending: false,
    })

    const { data, error } = lastId ? await res.lt("id", lastId) : await res
console.log({data,lastId})
    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error

    return data
  }

  async function upsert(
    row: Omit<
      Database["public"]["Tables"]["history_manga"]["Row"],
      "id" | "created_at" | "updated_at" | "user_id"
    >,
  ) {
    const { data, error } = await supabase.from("history_manga").upsert(row, {
      ignoreDuplicates: false,
      onConflict: "manga_id, user_id",
    })

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }

  // eslint-disable-next-line camelcase
  async function getListEpRead(manga_id: number) {
    await authStore.assert()

    // eslint-disable-next-line camelcase
    const { data, error } = await supabase.rpc("get_ls_ep_read", { manga_id })

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }

  // eslint-disable-next-line camelcase
  async function getLastEpRead(manga_id: number) {
    const session = await authStore.assert()

    const { data, error } = await supabase
      .from("history_manga")
      .select("id:last_ch_id, name:last_ch_name, path:last_ch_path, updated_at")
      .eq("manga_id", manga_id)
      .eq("user_id", session.user.id)
      .limit(1)
      .single()

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }

  return {
    get,
    upsert,

    getListEpRead,
    getLastEpRead,
  }
})
