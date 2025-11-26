-- =====================================================
-- MIGRATION 0: Create Base Tables
-- Initial Schema: Branch, YearLevel, Subject, Material
-- =====================================================
-- Description: Creates the base tables that existed before Phase 2.
--              These are the core tables for the Print & Read application.
-- =====================================================

-- Create branch table
CREATE TABLE IF NOT EXISTS printnread_branch (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- Create index on branch code
CREATE INDEX IF NOT EXISTS idx_printnread_branch_code ON printnread_branch(code);

-- Create year_level table
CREATE TABLE IF NOT EXISTS printnread_year_level (
    id BIGSERIAL PRIMARY KEY,
    year_number INTEGER NOT NULL UNIQUE
);

-- Create index on year_number
CREATE INDEX IF NOT EXISTS idx_printnread_year_level_year_number ON printnread_year_level(year_number);

-- Create subject table (base version, Phase 2 columns will be added later)
CREATE TABLE IF NOT EXISTS printnread_subject (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(30),
    name VARCHAR(150) NOT NULL,
    branch_id BIGINT NOT NULL,
    year_id BIGINT NOT NULL,
    CONSTRAINT fk_printnread_subject_branch 
        FOREIGN KEY (branch_id) 
        REFERENCES printnread_branch(id),
    CONSTRAINT fk_printnread_subject_year_level 
        FOREIGN KEY (year_id) 
        REFERENCES printnread_year_level(id)
);

-- Create indexes on subject foreign keys
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
    uploaded_on TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_printnread_material_subject 
        FOREIGN KEY (subject_id) 
        REFERENCES printnread_subject(id)
);

-- Create index on material subject_id
CREATE INDEX IF NOT EXISTS idx_printnread_material_subject_id ON printnread_material(subject_id);

-- Add comments
COMMENT ON TABLE printnread_branch IS 'Academic branches (e.g., CSE, ECE, ME)';
COMMENT ON TABLE printnread_year_level IS 'Academic year levels (1, 2, 3, 4)';
COMMENT ON TABLE printnread_subject IS 'Subjects offered in different branches and years';
COMMENT ON TABLE printnread_material IS 'Study materials (PDFs) uploaded for subjects';

