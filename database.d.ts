export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      follow: {
        Row: {
          created_at: string
          id: number
          image: string
          manga_id: string
          manga_name: string
          path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image: string
          manga_id: string
          manga_name: string
          path: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string
          manga_id?: string
          manga_name?: string
          path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      history_chapter: {
        Row: {
          created_at: string
          ep_id: string
          h_manga_id: number
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          ep_id: string
          h_manga_id: number
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          ep_id?: string
          h_manga_id?: number
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_chapter_h_manga_id_fkey"
            columns: ["h_manga_id"]
            referencedRelation: "history_manga"
            referencedColumns: ["id"]
          },
        ]
      }
      history_manga: {
        Row: {
          created_at: string
          id: number
          image: string
          last_ch_id: string
          last_ch_name: string
          last_ch_path: string
          manga_id: string
          manga_name: string
          manga_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image: string
          last_ch_id: string
          last_ch_name: string
          last_ch_path: string
          manga_id: string
          manga_name: string
          manga_path: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string
          last_ch_id?: string
          last_ch_name?: string
          last_ch_path?: string
          manga_id?: string
          manga_name?: string
          manga_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_manga_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birthday: string | null
          full_name: string
          genre: boolean | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          full_name: string
          genre?: boolean | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          full_name?: string
          genre?: boolean | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ls_ep_read: {
        Args: {
          manga_id: string
        }
        Returns: {
          ep_id: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      handle_after_upsert_s_avatars: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
