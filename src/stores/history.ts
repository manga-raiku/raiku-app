import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useHistoryStore = defineStore("history", () => {
  async function getRows(
    last?: Database["public"]["Tables"]["history"]["Row"],
  ) {
    const res = supabase.from("history").select("*").order("created_at", {
      ascending: false,
    })

    const { data, error } = last ? await res.lt("id", last.id) : await res

    if (error) throw error

    return data
  }

  async function insert(row: Database["public"]["Tables"]["history"]["Row"]) {
    const { data, error } = await supabase.from("history").insert(row)

    if (error) throw error
    return data
  }

  return {
    getRows,
    insert,
  }
})
