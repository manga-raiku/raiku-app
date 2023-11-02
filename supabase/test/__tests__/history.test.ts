import { createClient } from "@supabase/supabase-js"
import type { Database } from "app/database"
import { expect } from "vitest"

import {
  createAccountExample,
  getIdExample,
  loginAccountExample
} from "../setup-file"

const supabase = createClient<Database>(
  "http://localhost:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
)

describe("table `history`", () => {
  beforeAll(createAccountExample)
  beforeEach(() => supabase.from("history").delete())

  // check insert, update, delete, select
  // check insert, update with user_id, created_at, id
  test("should insert data to table", async () => {
    await loginAccountExample()
    // console.log(await supabase.from("history").delete().gt("id", 0))
    const res = await supabase.from("history").insert({
      ch_id: 1,
      ch_name: "Chapter 1",
      ch_path: "/truyen-tranh/1/1",
      manga_id: 1,
      name: "Manga 1",
      path: "/truyen-tranh/1",
      poster: "/poster",
      user_id: await getIdExample()
    })

    expect(res.status).toBe(201)
    expect(res.statusText).toBe("Created")

    const rows = await supabase.from("history").select("*")

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(rows.data!.length).toBe(1)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(rows.data![0].manga_id).toBe(1)
  })
})
