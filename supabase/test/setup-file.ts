import { createClient } from "@supabase/supabase-js"
import type { Database } from "app/database"

export const supabase = createClient<Database>(
  "http://localhost:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
)

Object.assign(self, { supabase })

export async function createAccountExample() {
  await supabase.auth.signUp({
    email: "example@example.com",
    password: "Example1234"
  })
}
export async function loginAccountExample() {
  await supabase.auth.signInWithPassword({
    email: "example@example.com",
    password: "Example1234"
  })
}
export async function getIdExample() {
  const { user } = (await supabase.auth.getUser()).data

  // eslint-disable-next-line functional/no-throw-statement
  if (!user) throw new Error("unknown_user")

  return user.id
}
