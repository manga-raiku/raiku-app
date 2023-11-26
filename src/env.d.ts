declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: "hash" | "history" | "abstract" | undefined
    VUE_ROUTER_BASE: string | undefined
    SUPABASE_PROJECT_URL: string
    SUPABASE_PROJECT_KEY: string
    FIREBASE_CONFIG: string
  }
}
