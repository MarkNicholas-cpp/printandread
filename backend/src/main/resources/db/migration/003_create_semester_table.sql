-- =====================================================
-- MIGRATION 3: Create Semester Table
-- Phase 2: Academic Semester Structure
-- =====================================================
-- Description: Creates semester table to map semesters (1-8) 
--              to year levels. Standard Indian college structure:
--              Year 1 → Sem 1,2 | Year 2 → Sem 3,4 | 
--              Year 3 → Sem 5,6 | Year 4 → Sem 7,8
-- =====================================================

-- Create semester table
CREATE TABLE IF NOT EXISTS semester (
    id BIGSERIAL PRIMARY KEY,
    sem_number INTEGER NOT NULL CHECK (sem_number >= 1 AND sem_number <= 8),
    year_id BIGINT NOT NULL,
    CONSTRAINT fk_semester_year_level 
        FOREIGN KEY (year_id) 
        REFERENCES year_level(id) 
        ON DELETE CASCADE,
    CONSTRAINT uk_semester_year_unique 
        UNIQUE (sem_number, year_id)
);

-- Create index on year_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_semester_year_id ON semester(year_id);

-- Create index on sem_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_semester_number ON semester(sem_number);

-- Insert semester data mapped to year levels
-- Year 1 → Semesters 1, 2
INSERT INTO semester (sem_number, year_id)
SELECT 1, id FROM year_level WHERE year_number = 1
ON CONFLICT (sem_number, year_id) DO NOTHING;

INSERT INTO semester (sem_number, year_id)
SELECT 2, id FROM year_level WHERE year_number = 1
ON CONFLICT (sem_number, year_id) DO NOTHING;

-- Year 2 → Semesters 3, 4
INSERT INTO semester (sem_number, year_id)
SELECT 3, id FROM year_level WHERE year_number = 2
ON CONFLICT (sem_number, year_id) DO NOTHING;

INSERT INTO semester (sem_number, year_id)
SELECT 4, id FROM year_level WHERE year_number = 2
ON CONFLICT (sem_number, year_id) DO NOTHING;

-- Year 3 → Semesters 5, 6
INSERT INTO semester (sem_number, year_id)
SELECT 5, id FROM year_level WHERE year_number = 3
ON CONFLICT (sem_number, year_id) DO NOTHING;

INSERT INTO semester (sem_number, year_id)
SELECT 6, id FROM year_level WHERE year_number = 3
ON CONFLICT (sem_number, year_id) DO NOTHING;

-- Year 4 → Semesters 7, 8
INSERT INTO semester (sem_number, year_id)
SELECT 7, id FROM year_level WHERE year_number = 4
ON CONFLICT (sem_number, year_id) DO NOTHING;

INSERT INTO semester (sem_number, year_id)
SELECT 8, id FROM year_level WHERE year_number = 4
ON CONFLICT (sem_number, year_id) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE semester IS 'Maps semesters (1-8) to year levels';
COMMENT ON COLUMN semester.sem_number IS 'Semester number (1-8)';
COMMENT ON COLUMN semester.year_id IS 'Foreign key to year_level table';

