export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_deletions: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          changed_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string | null
          email: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token_hash: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token_hash: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          payment_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_id?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          subscription_ends_at: string | null
          subscription_status: string | null
          subscription_tier: string
          two_factor_enabled: boolean
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          two_factor_enabled?: boolean
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          two_factor_enabled?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area: number
          bathrooms: number | null
          bedrooms: number | null
          city: string
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          district: string
          features: string[] | null
          id: string
          images: string[] | null
          lat: number | null
          lng: number | null
          price: number
          price_unit: string
          source_logo: string | null
          source_name: string
          source_url: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          area: number
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          price: number
          price_unit: string
          source_logo?: string | null
          source_name: string
          source_url: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          area?: number
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district?: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          price?: number
          price_unit?: string
          source_logo?: string | null
          source_name?: string
          source_url?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_sources: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          last_scraped_at: string | null
          logo: string | null
          name: string
          scrape_frequency_hours: number | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_scraped_at?: string | null
          logo?: string | null
          name: string
          scrape_frequency_hours?: number | null
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          last_scraped_at?: string | null
          logo?: string | null
          name?: string
          scrape_frequency_hours?: number | null
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          requests_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          requests_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          requests_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      scraping_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          properties_added: number | null
          properties_found: number | null
          properties_updated: number | null
          source_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          properties_added?: number | null
          properties_found?: number | null
          properties_updated?: number | null
          source_id?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          properties_added?: number | null
          properties_found?: number | null
          properties_updated?: number | null
          source_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_logs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "property_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          priority: number | null
          scheduled_for: string | null
          source_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          priority?: number | null
          scheduled_for?: string | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          priority?: number | null
          scheduled_for?: string | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraping_queue_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "property_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          risk_level: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          payment_id: string | null
          payment_provider: string
          plan_id: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          payment_id?: string | null
          payment_provider: string
          plan_id: string
          start_date: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          created_at: string
          filters: Json
          id: string
          is_active: boolean
          last_notification_at: string | null
          last_notification_count: number | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          is_active?: boolean
          last_notification_at?: string | null
          last_notification_count?: number | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          is_active?: boolean
          last_notification_at?: string | null
          last_notification_count?: number | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          collect_analytics: boolean
          created_at: string
          id: string
          marketing_consent: boolean
          third_party_consent: boolean
          tracking_consent: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          collect_analytics?: boolean
          created_at?: string
          id?: string
          marketing_consent?: boolean
          third_party_consent?: boolean
          tracking_consent?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          collect_analytics?: boolean
          created_at?: string
          id?: string
          marketing_consent?: boolean
          third_party_consent?: boolean
          tracking_consent?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_brute_force: {
        Args: { email_input: string; ip_input: unknown }
        Returns: boolean
      }
      check_is_admin: {
        Args: { user_id_input: string }
        Returns: boolean
      }
      cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_test_user_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_public_properties: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          city: string
          created_at: string
          description: string
          district: string
          features: string[]
          id: string
          images: string[]
          lat: number
          lng: number
          price: number
          price_unit: string
          source_logo: string
          source_name: string
          source_url: string
          status: string
          title: string
          type: string
          updated_at: string
        }[]
      }
      update_test_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
