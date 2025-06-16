export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          type: 'heavy_equipment' | 'party_rental' | 'car_rental' | 'tool_rental' | 'custom'
          email: string
          phone: string | null
          website: string | null
          address: Json | null
          timezone: string
          currency: string
          tax_rate: number
          config: Json
          features: Json
          branding: Json
          ai_analysis: Json | null
          reputation_data: Json | null
          competitor_analysis: Json | null
          created_at: string
          updated_at: string
          trial_ends_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          type: 'heavy_equipment' | 'party_rental' | 'car_rental' | 'tool_rental' | 'custom'
          email: string
          phone?: string | null
          website?: string | null
          address?: Json | null
          timezone?: string
          currency?: string
          tax_rate?: number
          config?: Json
          features?: Json
          branding?: Json
          ai_analysis?: Json | null
          reputation_data?: Json | null
          competitor_analysis?: Json | null
          created_at?: string
          updated_at?: string
          trial_ends_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          type?: 'heavy_equipment' | 'party_rental' | 'car_rental' | 'tool_rental' | 'custom'
          email?: string
          phone?: string | null
          website?: string | null
          address?: Json | null
          timezone?: string
          currency?: string
          tax_rate?: number
          config?: Json
          features?: Json
          branding?: Json
          ai_analysis?: Json | null
          reputation_data?: Json | null
          competitor_analysis?: Json | null
          created_at?: string
          updated_at?: string
          trial_ends_at?: string
          is_active?: boolean
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_type: 'heavy_equipment' | 'party_rental' | 'car_rental' | 'tool_rental' | 'custom'
      user_role: 'owner' | 'admin' | 'manager' | 'staff' | 'driver'
      rental_status: 'quote' | 'reserved' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    }
  }
}