-- Initial database schema for AI-powered rental management system
-- This creates all tables needed for multi-tenant rental businesses

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Businesses table (main tenant table)
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('heavy_equipment', 'party_rental', 'car_rental', 'tool_rental', 'custom')),
  industry VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  branding JSONB DEFAULT '{}',
  confidence INTEGER DEFAULT 50,
  business_details JSONB DEFAULT '{}',
  reputation_score INTEGER DEFAULT 0,
  web_intelligence JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'setup' CHECK (status IN ('setup', 'active', 'inactive', 'suspended')),
  subscription_plan VARCHAR(50) DEFAULT 'starter',
  subscription_status VARCHAR(20) DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  make VARCHAR(100),
  year INTEGER,
  description TEXT,
  condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'retired')),
  location VARCHAR(255),
  daily_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  maintenance_schedule JSONB DEFAULT '{}',
  insurance_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  company VARCHAR(255),
  tax_id VARCHAR(50),
  driver_license VARCHAR(50),
  emergency_contact JSONB DEFAULT '{}',
  billing_address TEXT,
  payment_methods JSONB DEFAULT '[]',
  credit_limit DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rentals table
CREATE TABLE rentals (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  rental_number VARCHAR(50) UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  daily_rate DECIMAL(10,2) NOT NULL,
  total_days INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL DEFAULT 0,
  deposit_returned DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'reserved' CHECK (status IN ('reserved', 'active', 'completed', 'cancelled', 'overdue')),
  delivery_required BOOLEAN DEFAULT FALSE,
  delivery_address TEXT,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  pickup_required BOOLEAN DEFAULT FALSE,
  pickup_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  terms_accepted BOOLEAN DEFAULT FALSE,
  signature_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  rental_id TEXT REFERENCES rentals(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_terms VARCHAR(50) DEFAULT 'net_30',
  notes TEXT,
  line_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT 'pay_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 8),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
  rental_id TEXT REFERENCES rentals(id) ON DELETE SET NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  processor_response JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance records table
CREATE TABLE maintenance_records (
  id TEXT PRIMARY KEY DEFAULT 'maint_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 8),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'cleaning')),
  description TEXT NOT NULL,
  performed_by VARCHAR(255),
  maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_maintenance_date DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  parts_used JSONB DEFAULT '[]',
  labor_hours DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery/Pickup schedules table
CREATE TABLE delivery_schedules (
  id TEXT PRIMARY KEY DEFAULT 'del_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 8),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  rental_id TEXT NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('delivery', 'pickup')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_date TIMESTAMP WITH TIME ZONE,
  address TEXT NOT NULL,
  contact_person VARCHAR(255),
  contact_phone VARCHAR(50),
  driver_id TEXT,
  vehicle_info JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'completed', 'failed', 'cancelled')),
  notes TEXT,
  signature_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff/Users table
CREATE TABLE staff (
  id TEXT PRIMARY KEY DEFAULT 'staff_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 8),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'driver')),
  permissions JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  hire_date DATE DEFAULT CURRENT_DATE,
  emergency_contact JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, email)
);

-- Create indexes for better performance
CREATE INDEX idx_equipment_business_id ON equipment(business_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_rentals_business_id ON rentals(business_id);
CREATE INDEX idx_rentals_customer_id ON rentals(customer_id);
CREATE INDEX idx_rentals_equipment_id ON rentals(equipment_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_business_id ON payments(business_id);
CREATE INDEX idx_maintenance_business_id ON maintenance_records(business_id);
CREATE INDEX idx_maintenance_equipment_id ON maintenance_records(equipment_id);
CREATE INDEX idx_delivery_business_id ON delivery_schedules(business_id);
CREATE INDEX idx_staff_business_id ON staff(business_id);

-- Create text search indexes
CREATE INDEX idx_equipment_search ON equipment USING gin (to_tsvector('english', name || ' ' || category || ' ' || COALESCE(model, '') || ' ' || COALESCE(description, '')));
CREATE INDEX idx_customers_search ON customers USING gin (to_tsvector('english', name || ' ' || email || ' ' || COALESCE(company, '')));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_businesses BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_equipment BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_rentals BEFORE UPDATE ON rentals FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_invoices BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_payments BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_maintenance BEFORE UPDATE ON maintenance_records FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_delivery BEFORE UPDATE ON delivery_schedules FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_staff BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Row Level Security (RLS) policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these will be refined based on auth implementation)
CREATE POLICY "Businesses are viewable by everyone" ON businesses FOR SELECT USING (true);
CREATE POLICY "Equipment access by business" ON equipment FOR ALL USING (true);
CREATE POLICY "Customers access by business" ON customers FOR ALL USING (true);
CREATE POLICY "Rentals access by business" ON rentals FOR ALL USING (true);
CREATE POLICY "Invoices access by business" ON invoices FOR ALL USING (true);
CREATE POLICY "Payments access by business" ON payments FOR ALL USING (true);
CREATE POLICY "Maintenance access by business" ON maintenance_records FOR ALL USING (true);
CREATE POLICY "Delivery access by business" ON delivery_schedules FOR ALL USING (true);
CREATE POLICY "Staff access by business" ON staff FOR ALL USING (true);