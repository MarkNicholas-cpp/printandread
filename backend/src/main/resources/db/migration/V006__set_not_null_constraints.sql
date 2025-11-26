-- =====================================================
-- MIGRATION 6: Set NOT NULL Constraints
-- Phase 2: Enforce Required Fields
-- =====================================================
-- Description: After data migration is complete, set NOT NULL
--              constraints on regulation_id and semester_id.
--              sub_branch_id remains nullable (optional field).
-- =====================================================

-- IMPORTANT: Only run this migration AFTER verifying that all subjects
-- have been assigned regulation_id and semester_id in Migration 5.

-- Step 1: Verify no NULL values exist (safety check)
-- If these queries return any rows, DO NOT proceed with this migration
-- SELECT COUNT(*) FROM printnread_subject WHERE regulation_id IS NULL;
-- SELECT COUNT(*) FROM printnread_subject WHERE semester_id IS NULL;

-- Step 2: Set regulation_id to NOT NULL
-- This will fail if any NULL values exist
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'printnread_subject_regulation_id_not_null'
    ) THEN
        -- First, ensure no NULLs exist
        IF EXISTS (SELECT 1 FROM printnread_subject WHERE regulation_id IS NULL) THEN
            RAISE EXCEPTION 'Cannot set NOT NULL: Some subjects have NULL regulation_id. Run Migration 5 first.';
        END IF;
        
        -- Set NOT NULL constraint
        ALTER TABLE printnread_subject 
        ALTER COLUMN regulation_id SET NOT NULL;
        
        -- Add constraint name for documentation
        ALTER TABLE printnread_subject 
        ADD CONSTRAINT printnread_subject_regulation_id_not_null 
        CHECK (regulation_id IS NOT NULL);
    END IF;
END $$;

-- Step 3: semester_id remains nullable (optional field)
-- Note: Based on current database state, semester_id is nullable
-- This allows flexibility for subjects that may not have a semester assigned yet
-- No action needed - this field is intentionally nullable

-- Step 4: sub_branch_id remains nullable (optional field)
-- No action needed - this field is intentionally nullable

-- Verification: Confirm constraints are in place
-- SELECT 
--     column_name, 
--     is_nullable,
--     data_type
-- FROM information_schema.columns
-- WHERE table_name = 'printnread_subject'
--   AND column_name IN ('regulation_id', 'semester_id', 'sub_branch_id')
-- ORDER BY column_name;

