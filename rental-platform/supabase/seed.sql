-- Seed data for Heavy Equipment Rental Platform
-- This creates realistic rental business data

-- Insert a sample business (tenant)
INSERT INTO businesses (id, name, slug, type, industry, email, phone, address, description, settings, branding, created_at) VALUES (
  'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789',
  'Grand Rental Station',
  'grand-rental-appleton',
  'heavy_equipment',
  'Construction Equipment Rental',
  'grs@new.rr.com',
  '920-968-1360',
  '2609 N Richmond St, Appleton, WI 54911',
  'Full-service equipment rental company serving the Fox Valley with construction, industrial, and specialty equipment.',
  jsonb_build_object(
    'timezone', 'America/Chicago',
    'currency', 'USD',
    'tax_rate', 0.055,
    'delivery_radius', 50,
    'operating_hours', jsonb_build_object(
      'monday', jsonb_build_object('open', '07:00', 'close', '17:00'),
      'tuesday', jsonb_build_object('open', '07:00', 'close', '17:00'),
      'wednesday', jsonb_build_object('open', '07:00', 'close', '17:00'),
      'thursday', jsonb_build_object('open', '07:00', 'close', '17:00'),
      'friday', jsonb_build_object('open', '07:00', 'close', '17:00'),
      'saturday', jsonb_build_object('open', '08:00', 'close', '14:00'),
      'sunday', jsonb_build_object('open', null, 'close', null)
    )
  ),
  jsonb_build_object(
    'primary_color', '#FF6600',
    'secondary_color', '#003366',
    'logo_url', 'https://example.com/logo.png'
  ),
  NOW() - INTERVAL '30 days'
);

-- Insert equipment categories
INSERT INTO equipment_categories (id, business_id, name, description, created_at) VALUES 
('cat_excavators', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Excavators', 'Track and wheel excavators for digging and demolition', NOW()),
('cat_skid_steers', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Skid Steers', 'Compact track loaders and skid steer loaders', NOW()),
('cat_generators', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Generators', 'Portable and stationary power generators', NOW()),
('cat_compaction', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Compaction', 'Plate compactors, rollers, and jumping jacks', NOW()),
('cat_tools', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Power Tools', 'Electric and pneumatic tools', NOW());

-- Insert equipment items
INSERT INTO equipment (id, business_id, category_id, name, description, specifications, daily_rate, weekly_rate, monthly_rate, status, serial_number, created_at) VALUES
-- Excavators
('eq_cat320', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_excavators', 'CAT 320 Excavator', '20-ton hydraulic excavator perfect for medium to large construction projects', 
  jsonb_build_object('make', 'Caterpillar', 'model', '320', 'year', 2019, 'operating_weight', '20000 lbs', 'engine_power', '153 HP', 'dig_depth', '21.3 ft', 'bucket_capacity', '1.2 cu yd'),
  850.00, 4250.00, 15300.00, 'available', 'CAT320-2019-001', NOW()),

('eq_kubota_kx040', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_excavators', 'Kubota KX040-4', 'Compact excavator ideal for tight spaces and residential work',
  jsonb_build_object('make', 'Kubota', 'model', 'KX040-4', 'year', 2020, 'operating_weight', '8600 lbs', 'engine_power', '40.4 HP', 'dig_depth', '11.8 ft', 'bucket_capacity', '0.14 cu yd'),
  320.00, 1600.00, 5760.00, 'available', 'KUB040-2020-002', NOW()),

-- Skid Steers  
('eq_bobcat_s650', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_skid_steers', 'Bobcat S650', 'Radius lift skid steer with excellent lift capacity and reach',
  jsonb_build_object('make', 'Bobcat', 'model', 'S650', 'year', 2021, 'operating_weight', '7865 lbs', 'engine_power', '74 HP', 'lift_capacity', '2050 lbs', 'bucket_capacity', '0.7 cu yd'),
  285.00, 1425.00, 5130.00, 'rented', 'BOB650-2021-003', NOW()),

('eq_cat_259d', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_skid_steers', 'CAT 259D Track Loader', 'Compact track loader with excellent traction and flotation',
  jsonb_build_object('make', 'Caterpillar', 'model', '259D', 'year', 2020, 'operating_weight', '8500 lbs', 'engine_power', '74 HP', 'lift_capacity', '2100 lbs', 'bucket_capacity', '0.8 cu yd'),
  295.00, 1475.00, 5310.00, 'available', 'CAT259-2020-004', NOW()),

-- Generators
('eq_gen_20kw', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_generators', '20kW Diesel Generator', 'Towable diesel generator for job site power needs',
  jsonb_build_object('make', 'Generac', 'model', 'MDG20DF4', 'year', 2022, 'fuel_type', 'Diesel', 'power_output', '20 kW', 'runtime', '24 hours', 'outlets', '120/240V'),
  125.00, 625.00, 2250.00, 'available', 'GEN20-2022-005', NOW()),

('eq_gen_6kw', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_generators', '6kW Portable Generator', 'Gas-powered portable generator for smaller applications',
  jsonb_build_object('make', 'Honda', 'model', 'EU6500is', 'year', 2021, 'fuel_type', 'Gasoline', 'power_output', '6.5 kW', 'runtime', '8.1 hours', 'outlets', '120/240V'),
  45.00, 225.00, 810.00, 'maintenance', 'HON65-2021-006', NOW()),

-- Compaction
('eq_plate_comp', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_compaction', 'Plate Compactor', 'Reversible plate compactor for asphalt and soil compaction',
  jsonb_build_object('make', 'Wacker Neuson', 'model', 'DPU6055', 'year', 2020, 'plate_width', '23 inches', 'compaction_force', '13200 lbs', 'travel_speed', '82 ft/min'),
  85.00, 425.00, 1530.00, 'available', 'WN6055-2020-007', NOW()),

-- Tools
('eq_jackhammer', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cat_tools', 'Electric Jackhammer', '60lb electric breaker hammer for concrete demolition',
  jsonb_build_object('make', 'Bosch', 'model', '11321EVS', 'year', 2021, 'weight', '60 lbs', 'power_type', 'Electric', 'impact_energy', '35 ft-lbs'),
  65.00, 325.00, 1170.00, 'available', 'BOS321-2021-008', NOW());

-- Insert customers
INSERT INTO customers (id, business_id, company_name, contact_name, email, phone, address, tax_id, credit_limit, payment_terms, created_at) VALUES
('cust_abc_construction', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'ABC Construction LLC', 'Mike Johnson', 'mike@abcconstruction.com', '920-555-0101', '1245 Construction Way, Appleton, WI 54915', '12-3456789', 25000.00, 'net_30', NOW() - INTERVAL '45 days'),
('cust_smith_builders', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Smith Builders Inc', 'Sarah Smith', 'sarah@smithbuilders.com', '920-555-0202', '567 Builder St, Green Bay, WI 54301', '98-7654321', 15000.00, 'net_15', NOW() - INTERVAL '30 days'),
('cust_valley_excavating', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'Valley Excavating', 'Tom Wilson', 'tom@valleyexcavating.com', '920-555-0303', '789 Excavation Dr, Oshkosh, WI 54901', '11-2233445', 35000.00, 'net_30', NOW() - INTERVAL '60 days'),
('cust_residential_joe', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', NULL, 'Joe Henderson', 'joe.henderson@email.com', '920-555-0404', '123 Maple Ave, Appleton, WI 54911', NULL, 5000.00, 'prepaid', NOW() - INTERVAL '15 days');

-- Insert active rentals
INSERT INTO rentals (id, business_id, customer_id, equipment_id, start_date, end_date, daily_rate, total_amount, deposit_amount, status, delivery_address, pickup_address, notes, created_at) VALUES
-- Active rental
('rent_001', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cust_abc_construction', 'eq_bobcat_s650', 
  CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', 285.00, 1995.00, 570.00, 'active',
  '1245 Construction Way, Appleton, WI 54915', NULL, 'Job site access through rear gate', NOW() - INTERVAL '3 days'),

-- Upcoming rental
('rent_002', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cust_valley_excavating', 'eq_cat320',
  CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '9 days', 850.00, 5950.00, 1700.00, 'confirmed',
  '789 Excavation Dr, Oshkosh, WI 54901', NULL, 'Large residential development project', NOW() - INTERVAL '5 days'),

-- Recent completed rental
('rent_003', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'cust_smith_builders', 'eq_kubota_kx040',
  CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 320.00, 2240.00, 640.00, 'completed',
  '567 Builder St, Green Bay, WI 54301', '567 Builder St, Green Bay, WI 54301', 'Basement excavation project', NOW() - INTERVAL '12 days');

-- Insert deliveries for driver app
INSERT INTO deliveries (id, business_id, rental_id, type, customer_id, scheduled_date, time_window, address, contact_name, contact_phone, equipment_items, status, driver_notes, created_at) VALUES
-- Today's deliveries
('del_001', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'rent_002', 'delivery', 'cust_valley_excavating',
  CURRENT_DATE, '8:00 AM - 10:00 AM', '789 Excavation Dr, Oshkosh, WI 54901', 'Tom Wilson', '920-555-0303',
  jsonb_build_array('CAT 320 Excavator', 'Safety Equipment'), 'scheduled', 'Customer requested early delivery', NOW()),

('del_002', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'rent_001', 'pickup', 'cust_abc_construction',
  CURRENT_DATE, '2:00 PM - 4:00 PM', '1245 Construction Way, Appleton, WI 54915', 'Mike Johnson', '920-555-0101',
  jsonb_build_array('Bobcat S650'), 'scheduled', 'Check hydraulic fluid level before pickup', NOW()),

-- Tomorrow's delivery
('del_003', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', NULL, 'delivery', 'cust_residential_joe',
  CURRENT_DATE + INTERVAL '1 day', '10:00 AM - 12:00 PM', '123 Maple Ave, Appleton, WI 54911', 'Joe Henderson', '920-555-0404',
  jsonb_build_array('Plate Compactor', 'Electric Jackhammer'), 'scheduled', 'Residential driveway project', NOW());

-- Insert maintenance records
INSERT INTO maintenance_records (id, business_id, equipment_id, type, description, scheduled_date, completed_date, cost, technician, status, notes, created_at) VALUES
('maint_001', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'eq_gen_6kw', 'preventive', '500-hour service',
  CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day', 125.50, 'Dave Peterson', 'completed',
  'Oil change, air filter replacement, spark plug inspection', NOW() - INTERVAL '3 days'),

('maint_002', 'b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', 'eq_cat320', 'preventive', '250-hour service',
  CURRENT_DATE + INTERVAL '7 days', NULL, 0.00, 'CAT Service Tech', 'scheduled',
  'Hydraulic system inspection, track tension check', NOW());

-- Insert sample business metrics data
INSERT INTO business_metrics (business_id, date, equipment_utilization, revenue, active_rentals, new_customers, created_at) VALUES
-- Last 30 days of metrics
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '30 days', 72.5, 8450.00, 12, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '29 days', 68.3, 7320.00, 11, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '28 days', 75.8, 9150.00, 13, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '27 days', 71.2, 8890.00, 12, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '26 days', 73.9, 9780.00, 14, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '25 days', 69.4, 8240.00, 11, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '24 days', 77.1, 10350.00, 15, 3, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '23 days', 74.6, 9540.00, 13, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '22 days', 70.8, 8670.00, 12, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '21 days', 76.3, 9920.00, 14, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '20 days', 72.7, 8830.00, 13, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '19 days', 75.5, 9450.00, 14, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '18 days', 73.2, 9120.00, 13, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '17 days', 71.9, 8750.00, 12, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '16 days', 78.1, 10580.00, 15, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '15 days', 74.8, 9360.00, 14, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '14 days', 72.4, 8950.00, 13, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '13 days', 76.7, 9840.00, 14, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '12 days', 73.5, 9210.00, 13, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '11 days', 75.2, 9680.00, 14, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '10 days', 71.6, 8790.00, 12, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '9 days', 77.9, 10240.00, 15, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '8 days', 74.1, 9380.00, 14, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '7 days', 72.8, 9050.00, 13, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '6 days', 76.4, 9790.00, 14, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '5 days', 73.7, 9220.00, 13, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '4 days', 75.6, 9650.00, 14, 0, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '3 days', 72.1, 8920.00, 13, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '2 days', 78.3, 10420.00, 15, 2, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE - INTERVAL '1 day', 74.9, 9480.00, 14, 1, NOW()),
('b1e4f8a0-8c7d-4e6f-9a1b-2c3d4e5f6789', CURRENT_DATE, 73.8, 9260.00, 13, 0, NOW());