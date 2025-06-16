import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Schema Types
export interface Business {
  id: string
  name: string
  type: string
  industry: string
  website: string
  email: string
  phone: string
  address: string
  description: string
  features: string[]
  branding: {
    primaryColor: string
    secondaryColor: string
    logoUrl?: string
  }
  confidence: number
  business_details: any
  reputation_score: number
  web_intelligence: any
  status: 'active' | 'setup' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: string
  business_id: string
  name: string
  category: string
  model: string
  serial_number?: string
  daily_rate: number
  weekly_rate?: number
  monthly_rate?: number
  status: 'available' | 'rented' | 'maintenance' | 'retired'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  location?: string
  description?: string
  images?: string[]
  custom_fields?: any
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  business_id: string
  name: string
  email: string
  phone: string
  address: string
  company?: string
  license_number?: string
  credit_limit?: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Rental {
  id: string
  business_id: string
  customer_id: string
  equipment_id: string
  start_date: string
  end_date: string
  return_date?: string
  daily_rate: number
  total_amount: number
  deposit: number
  status: 'reserved' | 'active' | 'completed' | 'cancelled' | 'overdue'
  delivery_address?: string
  pickup_address?: string
  notes?: string
  created_at: string
  updated_at: string
}