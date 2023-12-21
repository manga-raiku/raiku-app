/* eslint-disable camelcase */
import type { Database } from "app/database"
import { defineStore } from "pinia"
import type { ID } from "raiku-pgs/plugin"

export const useHistoryStore = defineStore("history", () => {
  const authStore = useAuthStore()
  const pluginStore = usePluginStore()

  async function get(lastIndex?: number) {
    const session = await authStore.assert()

    const res = supabase
      .from("history_manga")
      .select("*")
      .eq("user_id", session.user.id)
      .order("updated_at", {
        ascending: false
      })
      .limit(30)

    const { data, error } = lastIndex
      ? await res.range(lastIndex, lastIndex + 30)
      : await res

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error

    return Promise.all(
      data.map(async (item) => {
        try {
          const { resolveImage } = (await pluginStore.get(item.source_id)).meta

          if (resolveImage)
            item.image = resolveImageWithReplacer(item.image, resolveImage)
        } catch (err) {
          WARN(err)
        }

        return item
      })
    )
  }

  /** @returns {number} is id row table `history_manga` */
  async function upsert(
    row: Omit<
      Database["public"]["Tables"]["history_manga"]["Row"],
      "id" | "created_at" | "updated_at" | "user_id"
    >
  ) {
    await authStore.assert()

    const { data, error } = await supabase.rpc("upsert_history_manga", row)

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }

  // TODO: pagination  this rpc
  async function getListEpRead(manga_id: ID, source_id: string) {
    await authStore.assert()

    const { data, error } = await supabase.rpc("get_ls_ep_read", {
      manga_id,
      source_id
    })

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }
  async function getMapEpRead(manga_id: ID, source_id: string) {
    return new Map(
      (await getListEpRead(manga_id, source_id)).map((item) => [
        item.ep_id,
        item
      ])
    )
  }

  async function getLastEpRead(manga_id: ID, source_id: string) {
    await authStore.assert()

    const { data, error } = await supabase
      .rpc("get_last_ep_read", {
        manga_id,
        source_id
      })
      .single()

    // eslint-disable-next-line functional/no-throw-statement
    if (error) throw error
    return data
  }

  function getProgressReadEP(
    h_manga_id: number,
    ep_id: string
  ): Promise<
    Pick<
      Database["public"]["Tables"]["history_chapter"]["Row"],
      "id" | "current_page" | "max_page" | "updated_at"
    >
  >
  // eslint-disable-next-line no-redeclare
  function getProgressReadEP(
    manga_id: ID,
    ep_id: ID,
    source_id: string
  ): Promise<
    Pick<
      Database["public"]["Tables"]["history_chapter"]["Row"],
      "id" | "current_page" | "max_page" | "updated_at"
    >
  >
  // eslint-disable-next-line no-redeclare
  async function getProgressReadEP(
    manga_id: ID | number,
    ep_id: ID,
    source_id?: string
  ): Promise<
    Pick<
      Database["public"]["Tables"]["history_chapter"]["Row"],
      "id" | "current_page" | "max_page" | "updated_at"
    >
  > {
    await authStore.assert()

    if (source_id === undefined) {
      const { data, error } = await supabase
        .from("history_chapter")
        .select("id, current_page, max_page, updated_at")
        .eq("h_manga_id", manga_id)
        .eq("ep_id", ep_id)
        .limit(1)
        .single()

      // eslint-disable-next-line functional/no-throw-statement
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .rpc("get_progress_read_ep", {
          manga_id: manga_id as ID,
          ep_id,
          source_id
        })
        .single()

      // eslint-disable-next-line functional/no-throw-statement
      if (error) throw error
      return data
    }
  }

  function setProgressReadEP(
    id: number,
    ep_id: string,
    useID: true,
    current_page: number,
    max_page: number
  ): Promise<void>
  // eslint-disable-next-line no-redeclare
  function setProgressReadEP(
    h_manga_id: number,
    ep_id: string,
    useID: false,
    current_page: number,
    max_page: number
  ): Promise<void>
  // eslint-disable-next-line no-redeclare
  function setProgressReadEP(
    manga_id: ID,
    ep_id: ID,
    source_id: string,
    current_page: number,
    max_page: number
  ): Promise<void>
  // eslint-disable-next-line no-redeclare
  async function setProgressReadEP(
    manga_id: ID | number,
    ep_id: ID,
    source_id: string | boolean,
    current_page: number,
    max_page: number
  ): Promise<void> {
    await authStore.assert()

    if (typeof source_id === "boolean") {
      if (source_id)
        await supabase
          .from("history_chapter")
          .update({
            current_page,
            max_page
          })
          .eq("ep_id", ep_id)
          .eq("id", manga_id as number)
          .throwOnError()
      else
        await supabase
          .from("history_chapter")
          .upsert(
            {
              h_manga_id: manga_id as number,
              ep_id,
              current_page,
              max_page
            },
            {
              ignoreDuplicates: false,
              onConflict: "h_manga_id, ep_id" // this is unique key
            }
          )
          .eq("ep_id", ep_id)
          .eq("h_manga_id", manga_id as number)
          .throwOnError()
    } else {
      await supabase
        .rpc("set_progress_read_ep", {
          manga_id: manga_id as ID,
          ep_id,
          source_id,
          current_page,
          max_page
        })
        .throwOnError()
    }
  }

  return {
    get,
    upsert,

    getListEpRead,
    getMapEpRead,
    getLastEpRead,

    getProgressReadEP,
    setProgressReadEP
  }
})
