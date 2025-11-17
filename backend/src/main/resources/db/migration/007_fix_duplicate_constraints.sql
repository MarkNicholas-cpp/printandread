-- =====================================================
-- MIGRATION 7: Fix Duplicate Foreign Key Constraints
-- Cleanup: Remove duplicate constraints if they exist
-- =====================================================
-- Description: Removes any duplicate foreign key constraints
--              that may have been created during migration.
--              This ensures a clean database state.
-- =====================================================

-- Remove duplicate sub_branch foreign key constraint if it exists
-- Keep fk_subject_sub_branch, remove the auto-generated one
DO $$
BEGIN
    -- Check if duplicate constraint exists (auto-generated name)
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'subject'::regclass 
        AND conname = 'fkf0qubpm4mc9lq0bn7059547rn'
        AND contype = 'f'
    ) THEN
        -- Only remove if fk_subject_sub_branch also exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conrelid = 'subject'::regclass 
            AND conname = 'fk_subject_sub_branch'
            AND contype = 'f'
        ) THEN
            ALTER TABLE subject DROP CONSTRAINT IF EXISTS fkf0qubpm4mc9lq0bn7059547rn;
        END IF;
    END IF;
END $$;

-- Ensure unique constraint exists on semester (sem_number, year_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'semester'::regclass 
        AND conname = 'uk_semester_year_unique'
        AND contype = 'u'
    ) THEN
        ALTER TABLE semester
        ADD CONSTRAINT uk_semester_year_unique 
        UNIQUE (sem_number, year_id);
    END IF;
END $$;

-- Verification queries (uncomment to run):
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'subject'::regclass AND contype = 'f' ORDER BY conname;
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'semester'::regclass ORDER BY contype;

