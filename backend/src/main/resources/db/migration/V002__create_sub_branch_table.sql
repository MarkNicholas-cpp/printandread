-- =====================================================
-- MIGRATION 2: Create SubBranch Table
-- Phase 2: Optional Branch Specializations
-- =====================================================
-- Description: Creates sub_branch table for optional branch
--              specializations (e.g., CSE → CSE-AIML, CSE-DS)
--              This table is optional and can remain empty.
-- =====================================================

-- =====================================================
-- ENSURE ALL BASE TABLES EXIST (from V000)
-- =====================================================
-- V000 may have been skipped during baseline, so we ensure
-- all base tables exist before proceeding with Phase 2 migrations
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

-- =====================================================
-- MIGRATION 2: Create SubBranch Table
-- =====================================================

-- Create sub_branch table
CREATE TABLE IF NOT EXISTS printnread_sub_branch (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) NOT NULL,
    branch_id BIGINT NOT NULL,
    CONSTRAINT fk_printnread_sub_branch_branch 
        FOREIGN KEY (branch_id) 
        REFERENCES printnread_branch(id) 
        ON DELETE CASCADE
);

-- Create index on branch_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_printnread_sub_branch_branch_id ON printnread_sub_branch(branch_id);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_printnread_sub_branch_code ON printnread_sub_branch(code);

-- Optional: Insert example sub-branches (uncomment if needed)
-- These are examples - adjust based on your college's structure
/*
INSERT INTO printnread_sub_branch (name, code, branch_id)
SELECT 
    'CSE - Artificial Intelligence & Machine Learning',
    'CSE-AIML',
    id
FROM printnread_branch 
WHERE code = 'cse'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO printnread_sub_branch (name, code, branch_id)
SELECT 
    'CSE - Cyber Security',
    'CSE-CYBER',
    id
FROM printnread_branch 
WHERE code = 'cse'
LIMIT 1
ON CONFLICT DO NOTHING;
*/

-- Add comment to table
COMMENT ON TABLE printnread_sub_branch IS 'Optional branch specializations (e.g., CSE-AIML, CSE-DS)';
COMMENT ON COLUMN printnread_sub_branch.code IS 'Unique code for sub-branch (e.g., CSE-AIML)';

