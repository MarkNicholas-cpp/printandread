# 📋 Phase 2 Database Migrations - Execution Guide

## 🎯 Overview

This directory contains **6 sequential migration scripts** for Phase 2 database expansion. These migrations add Regulation, Semester, and SubBranch support to the Print & Read application.

---

## ⚠️ **IMPORTANT: Execution Order**

**Migrations MUST be executed in numerical order:**

1. `001_create_regulation_table.sql`
2. `002_create_sub_branch_table.sql`
3. `003_create_semester_table.sql`
4. `004_alter_subject_table_add_columns.sql`
5. `005_migrate_existing_subject_data.sql`
6. `006_set_not_null_constraints.sql`

---

## 🚀 **Execution Methods**

### **Method 1: Manual Execution (Recommended for First Run)**

1. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres -d printandread
   ```

2. **Execute each migration in order:**
   ```sql
   \i src/main/resources/db/migration/001_create_regulation_table.sql
   \i src/main/resources/db/migration/002_create_sub_branch_table.sql
   \i src/main/resources/db/migration/003_create_semester_table.sql
   \i src/main/resources/db/migration/004_alter_subject_table_add_columns.sql
   \i src/main/resources/db/migration/005_migrate_existing_subject_data.sql
   \i src/main/resources/db/migration/006_set_not_null_constraints.sql
   ```

### **Method 2: Using psql Command Line**

```bash
# From backend directory
psql -U postgres -d printandread -f src/main/resources/db/migration/001_create_regulation_table.sql
psql -U postgres -d printandread -f src/main/resources/db/migration/002_create_sub_branch_table.sql
psql -U postgres -d printandread -f src/main/resources/db/migration/003_create_semester_table.sql
psql -U postgres -d printandread -f src/main/resources/db/migration/004_alter_subject_table_add_columns.sql
psql -U postgres -d printandread -f src/main/resources/db/migration/005_migrate_existing_subject_data.sql
psql -U postgres -d printandread -f src/main/resources/db/migration/006_set_not_null_constraints.sql
```

### **Method 3: Using Flyway (If Configured)**

If you have Flyway configured, migrations will run automatically on application startup.

---

## ✅ **Verification Steps**

After running all migrations, verify success:

### **1. Check Tables Created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('regulation', 'semester', 'sub_branch')
ORDER BY table_name;
```

### **2. Check Subject Table Columns:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subject'
  AND column_name IN ('regulation_id', 'semester_id', 'sub_branch_id')
ORDER BY column_name;
```

### **3. Verify Data Migration:**
```sql
-- All subjects should have regulation_id
SELECT COUNT(*) as total_subjects,
       COUNT(regulation_id) as with_regulation,
       COUNT(semester_id) as with_semester,
       COUNT(sub_branch_id) as with_sub_branch
FROM subject;

-- Should show: total_subjects = with_regulation = with_semester
```

### **4. Check Regulation Data:**
```sql
SELECT * FROM regulation ORDER BY code;
-- Should show: R18, R20, R22
```

### **5. Check Semester Data:**
```sql
SELECT sem.sem_number, yl.year_number, COUNT(*) as count
FROM semester sem
JOIN year_level yl ON sem.year_id = yl.id
GROUP BY sem.sem_number, yl.year_number
ORDER BY yl.year_number, sem.sem_number;
-- Should show: Year 1 → Sem 1,2 | Year 2 → Sem 3,4 | etc.
```

---

## 🔄 **Rollback Plan (If Needed)**

If you need to rollback migrations:

### **Rollback Migration 6 (Remove NOT NULL):**
```sql
ALTER TABLE subject ALTER COLUMN regulation_id DROP NOT NULL;
ALTER TABLE subject ALTER COLUMN semester_id DROP NOT NULL;
```

### **Rollback Migration 5 (Clear Data):**
```sql
UPDATE subject SET regulation_id = NULL, semester_id = NULL;
```

### **Rollback Migration 4 (Remove Columns):**
```sql
ALTER TABLE subject DROP COLUMN IF EXISTS regulation_id;
ALTER TABLE subject DROP COLUMN IF EXISTS sub_branch_id;
ALTER TABLE subject DROP COLUMN IF EXISTS semester_id;
```

### **Rollback Migrations 1-3 (Drop Tables):**
```sql
DROP TABLE IF EXISTS semester CASCADE;
DROP TABLE IF EXISTS sub_branch CASCADE;
DROP TABLE IF EXISTS regulation CASCADE;
```

---

## 📊 **Migration Summary**

| Migration | Action | Impact |
|-----------|--------|--------|
| 001 | Create regulation table + insert R18, R20, R22 | ✅ Safe - New table |
| 002 | Create sub_branch table | ✅ Safe - New table (optional) |
| 003 | Create semester table + insert semesters 1-8 | ✅ Safe - New table |
| 004 | Add columns to subject (nullable) | ✅ Safe - Non-destructive |
| 005 | Assign defaults to existing subjects | ⚠️ Updates existing data |
| 006 | Set NOT NULL constraints | ⚠️ Enforces data integrity |

---

## 🎯 **Post-Migration Checklist**

- [ ] All 6 migrations executed successfully
- [ ] Verification queries return expected results
- [ ] No NULL values in regulation_id or semester_id
- [ ] Foreign key constraints are active
- [ ] Indexes created for performance
- [ ] Application starts without errors
- [ ] API endpoints return Phase 2 data

---

## 💡 **Notes**

1. **Backward Compatibility:** Existing subjects are assigned R22 regulation and first semester of their year level. You can manually adjust these later.

2. **Sub-Branch:** Remains optional (nullable). Add sub-branches as needed.

3. **Semester Mapping:** Default mapping assigns odd semesters (1,3,5,7) to years (1,2,3,4). Adjust manually if your college uses different mapping.

4. **Safety:** All migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to prevent errors on re-run.

---

**Last Updated:** 2024  
**Database:** PostgreSQL  
**Phase:** 2 - Database Expansion

