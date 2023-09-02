import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useHistoryStore = defineStore("history", () => {
  async function getRows(
    last?: Database["public"]["Tables"]["history_manga"]["Row"],
  ) {
    const res = supabase.from("history_manga").select("*").order("updated_at", {
      ascending: false,
    })

    const { data, error } = last ? await res.lt("id", last.id) : await res

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

  return {
    getRows,
    upsert,
  }
})
