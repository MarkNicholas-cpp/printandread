-- =====================================================
-- MIGRATION 4: Alter Subject Table - Add Phase 2 Columns
-- Phase 2: Add New Relationships to Subject
-- =====================================================
-- Description: Adds regulation_id, sub_branch_id, and semester_id
--              columns to subject table. Initially nullable to allow
--              safe data migration in next step.
-- =====================================================

-- Add regulation_id column (nullable initially)
ALTER TABLE printnread_subject 
ADD COLUMN IF NOT EXISTS regulation_id BIGINT;

-- Add sub_branch_id column (nullable - optional)
ALTER TABLE printnread_subject 
ADD COLUMN IF NOT EXISTS sub_branch_id BIGINT;

-- Add semester_id column (nullable initially)
ALTER TABLE printnread_subject 
ADD COLUMN IF NOT EXISTS semester_id BIGINT;

-- Add foreign key constraints
-- Note: These will be enforced after data migration

-- Foreign key: regulation_id → printnread_regulation(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_printnread_subject_regulation'
    ) THEN
        ALTER TABLE printnread_subject
        ADD CONSTRAINT fk_printnread_subject_regulation
            FOREIGN KEY (regulation_id)
            REFERENCES printnread_regulation(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

-- Foreign key: sub_branch_id → printnread_sub_branch(id)
-- Note: Check for both possible constraint names to avoid duplicates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname IN ('fk_printnread_subject_sub_branch', 'fkf0qubpm4mc9lq0bn7059547rn')
    ) THEN
        ALTER TABLE printnread_subject
        ADD CONSTRAINT fk_printnread_subject_sub_branch
            FOREIGN KEY (sub_branch_id)
            REFERENCES printnread_sub_branch(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Foreign key: semester_id → printnread_semester(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_printnread_subject_semester'
    ) THEN
        ALTER TABLE printnread_subject
        ADD CONSTRAINT fk_printnread_subject_semester
            FOREIGN KEY (semester_id)
            REFERENCES printnread_semester(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_printnread_subject_regulation_id ON printnread_subject(regulation_id);
CREATE INDEX IF NOT EXISTS idx_printnread_subject_sub_branch_id ON printnread_subject(sub_branch_id);
CREATE INDEX IF NOT EXISTS idx_printnread_subject_semester_id ON printnread_subject(semester_id);

-- Add comments
COMMENT ON COLUMN printnread_subject.regulation_id IS 'Foreign key to printnread_regulation table (Phase 2)';
COMMENT ON COLUMN printnread_subject.sub_branch_id IS 'Foreign key to printnread_sub_branch table (Phase 2 - optional)';
COMMENT ON COLUMN printnread_subject.semester_id IS 'Foreign key to printnread_semester table (Phase 2)';

