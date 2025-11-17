# 📋 Database Migrations - Complete Schema

## 🎯 Overview

This directory contains **8 sequential migration scripts** that create the complete database schema for the Print & Read application. These migrations ensure your production database matches your local development database exactly.

---

## ⚠️ **IMPORTANT: Execution Order**

**Migrations MUST be executed in numerical order:**

1. `000_create_base_tables.sql` - Creates base tables (branch, year_level, subject, material)
2. `001_create_regulation_table.sql` - Creates regulation table
3. `002_create_sub_branch_table.sql` - Creates sub_branch table
4. `003_create_semester_table.sql` - Creates semester table
5. `004_alter_subject_table_add_columns.sql` - Adds Phase 2 columns to subject
6. `005_migrate_existing_subject_data.sql` - Migrates existing data
7. `006_set_not_null_constraints.sql` - Sets NOT NULL constraints
8. `007_fix_duplicate_constraints.sql` - Cleans up duplicate constraints

---

## 🚀 **Execution Methods**

### **Method 1: Automatic via Flyway (Recommended for Production)**

Flyway will automatically run all migrations when your Spring Boot application starts:

1. **Configure Flyway** in `application-prod.properties`:
   ```properties
   spring.flyway.enabled=true
   spring.flyway.locations=classpath:db/migration
   spring.flyway.baseline-on-migrate=true
   spring.flyway.validate-on-migrate=true
   ```

2. **Deploy your backend** - Migrations run automatically on startup

3. **Check logs** - Verify migrations completed successfully

### **Method 2: Manual Execution (For Testing)**

1. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres -d printandread
   ```

2. **Execute each migration in order:**
   ```sql
   \i src/main/resources/db/migration/000_create_base_tables.sql
   \i src/main/resources/db/migration/001_create_regulation_table.sql
   \i src/main/resources/db/migration/002_create_sub_branch_table.sql
   \i src/main/resources/db/migration/003_create_semester_table.sql
   \i src/main/resources/db/migration/004_alter_subject_table_add_columns.sql
   \i src/main/resources/db/migration/005_migrate_existing_subject_data.sql
   \i src/main/resources/db/migration/006_set_not_null_constraints.sql
   \i src/main/resources/db/migration/007_fix_duplicate_constraints.sql
   ```

---

## 📊 **Database Schema**

### **Tables Created:**

1. **branch** - Academic branches (CSE, ECE, etc.)
2. **year_level** - Academic years (1, 2, 3, 4)
3. **subject** - Subjects with relationships to branch, year, regulation, semester
4. **material** - Study materials (PDFs) linked to subjects
5. **regulation** - Academic regulations (R18, R20, R22, R23, etc.)
6. **semester** - Semesters (1-8) mapped to years
7. **sub_branch** - Optional branch specializations

### **Key Relationships:**

- `subject.branch_id` → `branch.id` (required)
- `subject.year_id` → `year_level.id` (required)
- `subject.regulation_id` → `regulation.id` (required, NOT NULL)
- `subject.semester_id` → `semester.id` (optional, nullable)
- `subject.sub_branch_id` → `sub_branch.id` (optional, nullable)
- `material.subject_id` → `subject.id` (required)
- `semester.year_id` → `year_level.id` (required)
- `sub_branch.branch_id` → `branch.id` (required)

---

## ✅ **Verification Steps**

After running all migrations, verify success:

### **1. Check Tables Created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected:** branch, material, regulation, semester, sub_branch, subject, year_level

### **2. Check Subject Table Structure:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subject'
ORDER BY ordinal_position;
```

**Expected columns:** id, code, name, branch_id, year_id, sub_branch_id, regulation_id, semester_id

### **3. Verify Constraints:**
```sql
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'subject'::regclass
ORDER BY contype, conname;
```

### **4. Verify Data Migration:**
```sql
-- All subjects should have regulation_id
SELECT COUNT(*) as total_subjects,
       COUNT(regulation_id) as with_regulation,
       COUNT(semester_id) as with_semester
FROM subject;
```

### **5. Check Semester Structure:**
```sql
SELECT yl.year_number, sem.sem_number, COUNT(*) as count
FROM semester sem
JOIN year_level yl ON sem.year_id = yl.id
GROUP BY yl.year_number, sem.sem_number
ORDER BY yl.year_number, sem.sem_number;
```

**Expected:** Year 1 → Sem 1,2 | Year 2 → Sem 3,4 | Year 3 → Sem 5,6 | Year 4 → Sem 7,8

---

## 🔍 **Migration Details**

### **Migration 000: Base Tables**
- Creates branch, year_level, subject, material tables
- Sets up basic foreign key relationships
- Creates initial indexes

### **Migration 001: Regulation Table**
- Creates regulation table
- Inserts default regulations (R18, R20, R22)
- Creates index on code

### **Migration 002: SubBranch Table**
- Creates sub_branch table for optional specializations
- Sets up foreign key to branch

### **Migration 003: Semester Table**
- Creates semester table
- Maps semesters to year levels (Year 1→Sem 1,2, etc.)
- Creates unique constraint on (sem_number, year_id)

### **Migration 004: Subject Alterations**
- Adds regulation_id, semester_id, sub_branch_id columns
- Creates foreign key constraints
- Creates indexes for performance

### **Migration 005: Data Migration**
- Assigns default regulation (R22) to existing subjects
- Assigns semesters based on year level
- Ensures data consistency

### **Migration 006: NOT NULL Constraints**
- Sets regulation_id to NOT NULL (with CHECK constraint)
- Keeps semester_id nullable (for flexibility)
- Keeps sub_branch_id nullable (optional field)

### **Migration 007: Cleanup**
- Removes duplicate foreign key constraints
- Ensures unique constraint on semester exists
- Final cleanup for production readiness

---

## 🎯 **Production Deployment**

### **On Render (or any cloud platform):**

1. **Create PostgreSQL database**
2. **Deploy backend** with Flyway enabled
3. **Flyway automatically runs all migrations**
4. **Import your data** using the export/import scripts
5. **Verify** everything works

### **Environment Variables Required:**

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
SPRING_PROFILES_ACTIVE=production
```

---

## 📝 **Notes**

1. **Semester Mapping:** Year 1 → Semesters 1,2 | Year 2 → Semesters 3,4 | Year 3 → Semesters 5,6 | Year 4 → Semesters 7,8

2. **Nullable Fields:**
   - `subject.code` - Optional
   - `subject.semester_id` - Optional (can be assigned later)
   - `subject.sub_branch_id` - Optional (for specializations)

3. **Required Fields:**
   - `subject.regulation_id` - Required (NOT NULL with CHECK constraint)
   - `subject.branch_id` - Required
   - `subject.year_id` - Required

4. **Safety:** All migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to prevent errors on re-run.

---

**Last Updated:** 2025-11-17  
**Database:** PostgreSQL  
**Status:** ✅ Production Ready
