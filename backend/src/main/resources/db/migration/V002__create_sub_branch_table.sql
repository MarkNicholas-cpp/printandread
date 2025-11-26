-- =====================================================
-- MIGRATION 2: Create SubBranch Table
-- Phase 2: Optional Branch Specializations
-- =====================================================
-- Description: Creates sub_branch table for optional branch
--              specializations (e.g., CSE → CSE-AIML, CSE-DS)
--              This table is optional and can remain empty.
-- =====================================================

-- Ensure printnread_branch table exists (should be created by V000)
-- If it doesn't exist, create it first
CREATE TABLE IF NOT EXISTS printnread_branch (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- Create index on branch code if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_printnread_branch_code ON printnread_branch(code);

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

