-- =====================================================
-- MIGRATION 8: Ensure All Base Tables Exist
-- Fix for missing tables when Flyway is baselined after V000
-- =====================================================
-- Description: This migration ensures that all base tables (branch, year_level, subject, material)
--              are present in the database, even if V000 was skipped during an initial baseline.
--              It uses CREATE TABLE IF NOT EXISTS to safely create tables and indexes.
-- =====================================================

-- Create branch table
CREATE TABLE IF NOT EXISTS printnread_branch (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_printnread_branch_code ON printnread_branch(code);

-- Create year_level table
CREATE TABLE IF NOT EXISTS printnread_year_level (
    id BIGSERIAL PRIMARY KEY,
    year_number INTEGER NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_printnread_year_level_year_number ON printnread_year_level(year_number);

-- Create subject table (base version, Phase 2 columns will be added later)
CREATE TABLE IF NOT EXISTS printnread_subject (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(30),
    name VARCHAR(150) NOT NULL,
    branch_id BIGINT NOT NULL,
    year_id BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_printnread_subject_branch_id ON printnread_subject(branch_id);
CREATE INDEX IF NOT EXISTS idx_printnread_subject_year_id ON printnread_subject(year_id);

-- Create material table
CREATE TABLE IF NOT EXISTS printnread_material (
    id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    material_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    cloudinary_url TEXT NOT NULL,
    public_id TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL DEFAULT 'pdf',
    uploaded_on TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_printnread_material_subject_id ON printnread_material(subject_id);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Subject -> Branch
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_printnread_subject_branch'
    ) THEN
        ALTER TABLE printnread_subject
        ADD CONSTRAINT fk_printnread_subject_branch 
            FOREIGN KEY (branch_id) 
            REFERENCES printnread_branch(id);
    END IF;
    
    -- Subject -> Year Level
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_printnread_subject_year_level'
    ) THEN
        ALTER TABLE printnread_subject
        ADD CONSTRAINT fk_printnread_subject_year_level 
            FOREIGN KEY (year_id) 
            REFERENCES printnread_year_level(id);
    END IF;
    
    -- Material -> Subject
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_printnread_material_subject'
    ) THEN
        ALTER TABLE printnread_material
        ADD CONSTRAINT fk_printnread_material_subject 
            FOREIGN KEY (subject_id) 
            REFERENCES printnread_subject(id);
    END IF;
END $$;

-- Add comments
COMMENT ON TABLE printnread_branch IS 'Academic branches (e.g., CSE, ECE, ME)';
COMMENT ON TABLE printnread_year_level IS 'Academic year levels (1, 2, 3, 4)';
COMMENT ON TABLE printnread_subject IS 'Subjects offered in different branches and years';
COMMENT ON TABLE printnread_material IS 'Study materials (PDFs) uploaded for subjects';

