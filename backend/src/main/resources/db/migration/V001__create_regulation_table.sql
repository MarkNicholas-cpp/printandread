-- =====================================================
-- MIGRATION 1: Create Regulation Table
-- Phase 2: Academic Regulation Support
-- =====================================================
-- Description: Creates regulation table to track different 
--              academic regulations (R16, R18, R20, R22, etc.)
--              used by Indian colleges.
-- =====================================================

-- Create regulation table
CREATE TABLE IF NOT EXISTS printnread_regulation (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    description TEXT
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_printnread_regulation_code ON printnread_regulation(code);

-- Insert initial regulation data
-- These are common regulations used in Indian colleges
INSERT INTO printnread_regulation (name, code, start_year, end_year, description)
VALUES 
    ('Regulation 2018', 'R18', 2018, 2021, 'Regulation introduced in 2018, active until 2021'),
    ('Regulation 2020', 'R20', 2020, 2023, 'Regulation introduced in 2020, active until 2023'),
    ('Regulation 2022', 'R22', 2022, NULL, 'Current regulation introduced in 2022')
ON CONFLICT (code) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE printnread_regulation IS 'Stores academic regulations (R16, R18, R20, R22, etc.) used by colleges';
COMMENT ON COLUMN printnread_regulation.code IS 'Unique regulation code (e.g., R18, R20, R22)';
COMMENT ON COLUMN printnread_regulation.end_year IS 'NULL if regulation is currently active';

