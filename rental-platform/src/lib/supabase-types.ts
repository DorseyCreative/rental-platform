export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      businesses: {
        Row: {
          address: string | null
          branding: Json | null
          business_details: Json | null
          confidence: number | null
          created_at: string | null
          description: string | null
          email: string
          features: Json | null
          id: string
          industry: string
          name: string
          phone: string | null
          reputation_score: number | null
          status: string | null
          subscription_plan: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          type: string
          updated_at: string | null
          web_intelligence: Json | null
          website: string | null
        }
        Insert: {
          address?: string | null
          branding?: Json | null
          business_details?: Json | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          email: string
          features?: Json | null
          id: string
          industry: string
          name: string
          phone?: string | null
          reputation_score?: number | null
          status?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          type: string
          updated_at?: string | null
          web_intelligence?: Json | null
          website?: string | null
        }
        Update: {
          address?: string | null
          branding?: Json | null
          business_details?: Json | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          email?: string
          features?: Json | null
          id?: string
          industry?: string
          name?: string
          phone?: string | null
          reputation_score?: number | null
          status?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          type?: string
          updated_at?: string | null
          web_intelligence?: Json | null
          website?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          billing_address: string | null
          business_id: string
          company: string | null
          created_at: string | null
          credit_limit: number | null
          custom_fields: Json | null
          driver_license: string | null
          email: string
          emergency_contact: Json | null
          id: string
          name: string
          notes: string | null
          payment_methods: Json | null
          phone: string | null
          status: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          billing_address?: string | null
          business_id: string
          company?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          driver_license?: string | null
          email: string
          emergency_contact?: Json | null
          id: string
          name: string
          notes?: string | null
          payment_methods?: Json | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          billing_address?: string | null
          business_id?: string
          company?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          driver_license?: string | null
          email?: string
          emergency_contact?: Json | null
          id?: string
          name?: string
          notes?: string | null
          payment_methods?: Json | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_schedules: {
        Row: {
          actual_date: string | null
          address: string
          business_id: string
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          notes: string | null
          rental_id: string
          scheduled_date: string
          signature_data: Json | null
          status: string | null
          type: string
          updated_at: string | null
          vehicle_info: Json | null
        }
        Insert: {
          actual_date?: string | null
          address: string
          business_id: string
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          rental_id: string
          scheduled_date: string
          signature_data?: Json | null
          status?: string | null
          type: string
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Update: {
          actual_date?: string | null
          address?: string
          business_id?: string
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          rental_id?: string
          scheduled_date?: string
          signature_data?: Json | null
          status?: string | null
          type?: string
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_schedules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_schedules_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          business_id: string
          category: string
          condition: string | null
          created_at: string | null
          custom_fields: Json | null
          daily_rate: number
          deposit_amount: number | null
          description: string | null
          id: string
          images: Json | null
          insurance_info: Json | null
          location: string | null
          maintenance_schedule: Json | null
          make: string | null
          model: string | null
          monthly_rate: number | null
          name: string
          specifications: Json | null
          status: string | null
          updated_at: string | null
          weekly_rate: number | null
          year: number | null
        }
        Insert: {
          business_id: string
          category: string
          condition?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          daily_rate?: number
          deposit_amount?: number | null
          description?: string | null
          id: string
          images?: Json | null
          insurance_info?: Json | null
          location?: string | null
          maintenance_schedule?: Json | null
          make?: string | null
          model?: string | null
          monthly_rate?: number | null
          name: string
          specifications?: Json | null
          status?: string | null
          updated_at?: string | null
          weekly_rate?: number | null
          year?: number | null
        }
        Update: {
          business_id?: string
          category?: string
          condition?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          daily_rate?: number
          deposit_amount?: number | null
          description?: string | null
          id?: string
          images?: Json | null
          insurance_info?: Json | null
          location?: string | null
          maintenance_schedule?: Json | null
          make?: string | null
          model?: string | null
          monthly_rate?: number | null
          name?: string
          specifications?: Json | null
          status?: string | null
          updated_at?: string | null
          weekly_rate?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          business_id: string
          created_at: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          line_items: Json | null
          notes: string | null
          payment_terms: string | null
          rental_id: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          business_id: string
          created_at?: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_date?: string
          invoice_number: string
          line_items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          rental_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          business_id?: string
          created_at?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          line_items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          rental_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          attachments: Json | null
          business_id: string
          cost: number | null
          created_at: string | null
          description: string
          equipment_id: string
          id: string
          labor_hours: number | null
          maintenance_date: string
          maintenance_type: string
          next_maintenance_date: string | null
          notes: string | null
          parts_used: Json | null
          performed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          business_id: string
          cost?: number | null
          created_at?: string | null
          description: string
          equipment_id: string
          id?: string
          labor_hours?: number | null
          maintenance_date?: string
          maintenance_type: string
          next_maintenance_date?: string | null
          notes?: string | null
          parts_used?: Json | null
          performed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          business_id?: string
          cost?: number | null
          created_at?: string | null
          description?: string
          equipment_id?: string
          id?: string
          labor_hours?: number | null
          maintenance_date?: string
          maintenance_type?: string
          next_maintenance_date?: string | null
          notes?: string | null
          parts_used?: Json | null
          performed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string | null
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          processor_response: Json | null
          reference_number: string | null
          rental_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          processor_response?: Json | null
          reference_number?: string | null
          rental_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          processor_response?: Json | null
          reference_number?: string | null
          rental_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          actual_return_date: string | null
          business_id: string
          created_at: string | null
          customer_id: string
          daily_rate: number
          delivery_address: string | null
          delivery_fee: number | null
          delivery_required: boolean | null
          deposit: number
          deposit_returned: number | null
          end_date: string
          equipment_id: string
          id: string
          notes: string | null
          pickup_fee: number | null
          pickup_required: boolean | null
          rental_number: string | null
          signature_data: Json | null
          start_date: string
          status: string | null
          subtotal: number
          tax_amount: number | null
          terms_accepted: boolean | null
          total_amount: number
          total_days: number
          updated_at: string | null
        }
        Insert: {
          actual_return_date?: string | null
          business_id: string
          created_at?: string | null
          customer_id: string
          daily_rate: number
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_required?: boolean | null
          deposit?: number
          deposit_returned?: number | null
          end_date: string
          equipment_id: string
          id: string
          notes?: string | null
          pickup_fee?: number | null
          pickup_required?: boolean | null
          rental_number?: string | null
          signature_data?: Json | null
          start_date: string
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          terms_accepted?: boolean | null
          total_amount: number
          total_days: number
          updated_at?: string | null
        }
        Update: {
          actual_return_date?: string | null
          business_id?: string
          created_at?: string | null
          customer_id?: string
          daily_rate?: number
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_required?: boolean | null
          deposit?: number
          deposit_returned?: number | null
          end_date?: string
          equipment_id?: string
          id?: string
          notes?: string | null
          pickup_fee?: number | null
          pickup_required?: boolean | null
          rental_number?: string | null
          signature_data?: Json | null
          start_date?: string
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          terms_accepted?: boolean | null
          total_amount?: number
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          business_id: string
          created_at: string | null
          email: string
          emergency_contact: Json | null
          hire_date: string | null
          id: string
          name: string
          notes: string | null
          permissions: Json | null
          phone: string | null
          role: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          email: string
          emergency_contact?: Json | null
          hire_date?: string | null
          id?: string
          name: string
          notes?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          email?: string
          emergency_contact?: Json | null
          hire_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
