-- =====================================================
-- MIGRATION 5: Data Migration - Assign Defaults to Existing Subjects
-- Phase 2: Populate New Columns with Safe Defaults
-- =====================================================
-- Description: Assigns default regulation (R22) and semester
--              mappings to all existing subjects. This ensures
--              backward compatibility and safe migration.
-- =====================================================

-- Step 1: Assign default regulation (R22) to all subjects without regulation_id
UPDATE subject 
SET regulation_id = (
    SELECT id FROM regulation WHERE code = 'R22' LIMIT 1
)
WHERE regulation_id IS NULL;

-- Verify: Check if any subjects still have NULL regulation_id
-- (This should return 0 rows after migration)
-- SELECT COUNT(*) FROM subject WHERE regulation_id IS NULL;

-- Step 2: Assign semester based on year level
-- Mapping: Year 1 → Sem 1, Year 2 → Sem 3, Year 3 → Sem 5, Year 4 → Sem 7
-- This is a temporary assignment - you can manually adjust later
UPDATE subject s
SET semester_id = (
    SELECT sem.id 
    FROM semester sem
    JOIN year_level yl ON sem.year_id = yl.id
    WHERE yl.id = s.year_id
      AND sem.sem_number = (yl.year_number * 2 - 1)
    LIMIT 1
)
WHERE semester_id IS NULL;

-- Alternative: If you want to assign first semester of each year instead:
-- UPDATE subject s
-- SET semester_id = (
--     SELECT sem.id 
--     FROM semester sem
--     JOIN year_level yl ON sem.year_id = yl.id
--     WHERE yl.id = s.year_id
--       AND sem.sem_number = ((yl.year_number - 1) * 2 + 1)
--     LIMIT 1
-- )
-- WHERE semester_id IS NULL;

-- Step 3: Sub-branch remains NULL (optional field)
-- No action needed - sub_branch_id can remain NULL

-- Verification queries (run these to verify migration success):
-- SELECT COUNT(*) as total_subjects FROM subject;
-- SELECT COUNT(*) as subjects_with_regulation FROM subject WHERE regulation_id IS NOT NULL;
-- SELECT COUNT(*) as subjects_with_semester FROM subject WHERE semester_id IS NOT NULL;
-- SELECT COUNT(*) as subjects_with_sub_branch FROM subject WHERE sub_branch_id IS NOT NULL;

-- Show distribution by regulation
-- SELECT r.code, COUNT(s.id) as subject_count
-- FROM regulation r
-- LEFT JOIN subject s ON s.regulation_id = r.id
-- GROUP BY r.code
-- ORDER BY r.code;

-- Show distribution by semester
-- SELECT sem.sem_number, COUNT(s.id) as subject_count
-- FROM semester sem
-- LEFT JOIN subject s ON s.semester_id = sem.id
-- GROUP BY sem.sem_number
-- ORDER BY sem.sem_number;

