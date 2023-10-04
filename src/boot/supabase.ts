import { createClient } from "@supabase/supabase-js"
import type { Database } from "app/database"

export const supabase = createClient<Database>(
  SUPABASE_PROJECT_URL,
  SUPABASE_PROJECT_KEY
)
