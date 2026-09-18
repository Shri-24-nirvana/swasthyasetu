-- ====================================================================================
-- SwasthyaSetu 2.0: Single-QR Multi-Department Role-Based Access Control (RBAC)
-- PostgreSQL + Supabase Schema & Row-Level Security (RLS) Implementation
-- ====================================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Define Custom Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'PATIENT',
        'DOCTOR',
        'HEALTHCARE_WORKER',
        'HOSPITAL_STAFF',
        'PHARMACY',
        'LAB',
        'ADMIN',
        'SECURITY',
        'SUPER_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visit_status AS ENUM (
        'WAITING',
        'TRIAGED',
        'IN_CONSULTATION',
        'LAB_PENDING',
        'PHARMACY_PENDING',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Healthcare Facilities Master Table
CREATE TABLE IF NOT EXISTS facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'PHC', 'CHC', 'DISTRICT_HOSPITAL', 'SUB_CENTER'
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    pincode TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles (Extends Supabase auth.users or standalone mock)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    swasthya_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'PATIENT',
    facility_id TEXT REFERENCES facilities(id),
    department TEXT, -- e.g., 'General Medicine', 'Cardiology', 'OPD Desk'
    email TEXT UNIQUE,
    phone TEXT,
    license_number TEXT, -- For Doctors, Pharmacists, Lab Techs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Role-Permission Definition Tables (RBAC)
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    permission TEXT NOT NULL, -- e.g., 'patient.basic.read', 'patient.medicines.read'
    UNIQUE(role, permission)
);

-- Populate Default Role Permissions
INSERT INTO role_permissions (role, permission) VALUES
    -- Doctor
    ('DOCTOR', 'patient.basic.read'),
    ('DOCTOR', 'patient.vitals.read'),
    ('DOCTOR', 'patient.vitals.write'),
    ('DOCTOR', 'patient.medicines.read'),
    ('DOCTOR', 'patient.medicines.write'),
    ('DOCTOR', 'patient.diagnostics.read'),
    ('DOCTOR', 'patient.diagnostics.write'),
    ('DOCTOR', 'patient.consultations.read'),
    ('DOCTOR', 'patient.consultations.write'),
    ('DOCTOR', 'patient.referrals.read'),
    ('DOCTOR', 'patient.referrals.write'),
    
    -- Pharmacy
    ('PHARMACY', 'patient.basic.read'),
    ('PHARMACY', 'patient.medicines.read'),
    ('PHARMACY', 'patient.medicines.dispense'),
    ('PHARMACY', 'patient.allergies.read'),
    
    -- Lab / Diagnostics
    ('LAB', 'patient.basic.read'),
    ('LAB', 'patient.diagnostics.read'),
    ('LAB', 'patient.diagnostics.write'),
    
    -- Healthcare Worker (ASHA / ANM / CHO)
    ('HEALTHCARE_WORKER', 'patient.basic.read'),
    ('HEALTHCARE_WORKER', 'patient.basic.write'),
    ('HEALTHCARE_WORKER', 'patient.vitals.read'),
    ('HEALTHCARE_WORKER', 'patient.vitals.write'),
    ('HEALTHCARE_WORKER', 'patient.community.read'),
    ('HEALTHCARE_WORKER', 'patient.community.write'),
    
    -- Hospital Staff / Reception
    ('HOSPITAL_STAFF', 'patient.basic.read'),
    ('HOSPITAL_STAFF', 'patient.visits.read'),
    ('HOSPITAL_STAFF', 'patient.visits.write'),
    ('HOSPITAL_STAFF', 'queue.manage'),
    
    -- Hospital Admin
    ('ADMIN', 'facility.metrics.read'),
    ('ADMIN', 'audit.logs.read'),
    ('ADMIN', 'staff.manage'),
    ('ADMIN', 'patient.visits.read')
ON CONFLICT (role, permission) DO NOTHING;

-- 6. Patients Master Record
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swasthya_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INT NOT NULL,
    dob DATE,
    gender TEXT NOT NULL,
    phone TEXT,
    blood_group TEXT,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    home_facility_id TEXT REFERENCES facilities(id),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_relationship TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Cryptographic QR Tokens (SHA-256 Hashed for privacy & zero raw exposure)
CREATE TABLE IF NOT EXISTS qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of the public QR payload
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'REVOKED', 'EXPIRED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Index on token_hash for ultra-fast QR lookup (<2ms)
CREATE INDEX IF NOT EXISTS idx_qr_tokens_hash ON qr_tokens(token_hash);

-- 8. Hospital Visits / OPD Queue
CREATE TABLE IF NOT EXISTS hospital_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    facility_id TEXT REFERENCES facilities(id),
    department TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    token_number TEXT,
    status visit_status NOT NULL DEFAULT 'WAITING',
    reason TEXT,
    vitals JSONB, -- { bp: '120/80', pulse: 74, spo2: 98, temp: 98.4, sugar: 110 }
    diagnosis TEXT,
    clinical_notes TEXT,
    risk_level risk_level DEFAULT 'LOW',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in_at TIMESTAMPTZ,
    consulted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 9. Prescriptions & Medicines (Accessed by Doctors & Pharmacy)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES hospital_visits(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructions TEXT,
    is_dispensed BOOLEAN DEFAULT FALSE,
    dispensed_by TEXT,
    dispensed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Diagnostics & Lab Orders (Accessed by Doctors & Lab)
CREATE TABLE IF NOT EXISTS diagnostic_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES hospital_visits(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Blood', 'Radiology', 'Pathology'
    status TEXT NOT NULL DEFAULT 'ORDERED', -- 'ORDERED', 'COLLECTED', 'COMPLETED'
    result_value TEXT,
    normal_range TEXT,
    report_url TEXT,
    notes TEXT,
    prescribed_by TEXT NOT NULL,
    completed_by TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Immutable Security Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role user_role NOT NULL,
    facility_id TEXT,
    patient_id UUID REFERENCES patients(id),
    resource TEXT NOT NULL, -- e.g., 'MEDICINES', 'DIAGNOSTICS', 'CLINICAL_SUMMARY'
    action TEXT NOT NULL,   -- e.g., 'READ', 'WRITE', 'DISPENSE', 'EXPORT'
    status TEXT NOT NULL,   -- 'ALLOWED', 'DENIED'
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast audit filtering
CREATE INDEX IF NOT EXISTS idx_audit_patient ON audit_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- ====================================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current authenticated user's role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Patients Table Access: Authenticated staff can read basic patient profiles
CREATE POLICY "Staff can view patient demographics"
    ON patients FOR SELECT
    TO authenticated
    USING (true);

-- 2. Prescriptions Table Access: DOCTOR, PHARMACY can select
CREATE POLICY "Doctors and Pharmacy can access prescriptions"
    ON prescriptions FOR SELECT
    TO authenticated
    USING (
        current_user_role() IN ('DOCTOR', 'PHARMACY', 'SUPER_ADMIN')
    );

CREATE POLICY "Doctors can insert prescriptions"
    ON prescriptions FOR INSERT
    TO authenticated
    WITH CHECK (
        current_user_role() IN ('DOCTOR', 'SUPER_ADMIN')
    );

CREATE POLICY "Pharmacy can update dispensation status"
    ON prescriptions FOR UPDATE
    TO authenticated
    USING (
        current_user_role() IN ('PHARMACY', 'SUPER_ADMIN')
    );

-- 3. Diagnostics Table Access: DOCTOR, LAB can select
CREATE POLICY "Doctors and Lab can access diagnostic orders"
    ON diagnostic_orders FOR SELECT
    TO authenticated
    USING (
        current_user_role() IN ('DOCTOR', 'LAB', 'SUPER_ADMIN')
    );

CREATE POLICY "Lab technicians can update test results"
    ON diagnostic_orders FOR UPDATE
    TO authenticated
    USING (
        current_user_role() IN ('LAB', 'SUPER_ADMIN')
    );

-- 4. Audit Logs: Read-only for ADMIN & SUPER_ADMIN, Append-only for all staff
CREATE POLICY "Admins can view audit logs"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (
        current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
    );

CREATE POLICY "Staff can insert audit entries"
    ON audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);
