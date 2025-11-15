-- =====================================================
-- MIGRATION 4: Alter Subject Table - Add Phase 2 Columns
-- Phase 2: Add New Relationships to Subject
-- =====================================================
-- Description: Adds regulation_id, sub_branch_id, and semester_id
--              columns to subject table. Initially nullable to allow
--              safe data migration in next step.
-- =====================================================

-- Add regulation_id column (nullable initially)
ALTER TABLE subject 
ADD COLUMN IF NOT EXISTS regulation_id BIGINT;

-- Add sub_branch_id column (nullable - optional)
ALTER TABLE subject 
ADD COLUMN IF NOT EXISTS sub_branch_id BIGINT;

-- Add semester_id column (nullable initially)
ALTER TABLE subject 
ADD COLUMN IF NOT EXISTS semester_id BIGINT;

-- Add foreign key constraints
-- Note: These will be enforced after data migration

-- Foreign key: regulation_id → regulation(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_subject_regulation'
    ) THEN
        ALTER TABLE subject
        ADD CONSTRAINT fk_subject_regulation
            FOREIGN KEY (regulation_id)
            REFERENCES regulation(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

-- Foreign key: sub_branch_id → sub_branch(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_subject_sub_branch'
    ) THEN
        ALTER TABLE subject
        ADD CONSTRAINT fk_subject_sub_branch
            FOREIGN KEY (sub_branch_id)
            REFERENCES sub_branch(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Foreign key: semester_id → semester(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_subject_semester'
    ) THEN
        ALTER TABLE subject
        ADD CONSTRAINT fk_subject_semester
            FOREIGN KEY (semester_id)
            REFERENCES semester(id)
            ON DELETE RESTRICT;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subject_regulation_id ON subject(regulation_id);
CREATE INDEX IF NOT EXISTS idx_subject_sub_branch_id ON subject(sub_branch_id);
CREATE INDEX IF NOT EXISTS idx_subject_semester_id ON subject(semester_id);

-- Add comments
COMMENT ON COLUMN subject.regulation_id IS 'Foreign key to regulation table (Phase 2)';
COMMENT ON COLUMN subject.sub_branch_id IS 'Foreign key to sub_branch table (Phase 2 - optional)';
COMMENT ON COLUMN subject.semester_id IS 'Foreign key to semester table (Phase 2)';

