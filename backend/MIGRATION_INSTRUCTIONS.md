# 🚀 Running Flyway Migrations on Production Database

## Database Connection Details

- **Hostname:** `dpg-d4j0io6uk2gs73bhkldg-a`
- **Port:** `5432`
- **Database:** `production_db_postgres_6gz5`
- **Username:** `production_db_postgres_6gz5_user`
- **Password:** `SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF`
- **Internal URL:** `postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a/production_db_postgres_6gz5`

---

## Method 1: Using Spring Boot Application (Recommended)

The easiest way is to run the Spring Boot application with production profile. Flyway will automatically run all migrations on startup.

### Windows PowerShell:
```powershell
cd backend
$env:SPRING_DATASOURCE_URL="postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"
$env:SPRING_DATASOURCE_USERNAME="production_db_postgres_6gz5_user"
$env:SPRING_DATASOURCE_PASSWORD="SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF"
$env:SPRING_PROFILES_ACTIVE="production"
mvn spring-boot:run
```

### Linux/Mac:
```bash
cd backend
export SPRING_DATASOURCE_URL="postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"
export SPRING_DATASOURCE_USERNAME="production_db_postgres_6gz5_user"
export SPRING_DATASOURCE_PASSWORD="SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF"
export SPRING_PROFILES_ACTIVE="production"
mvn spring-boot:run
```

**Note:** The application will start, run migrations, and then you can stop it (Ctrl+C) after migrations complete.

---

## Method 2: Using psql (Manual SQL Execution)

If you prefer to run migrations manually using psql:

### Connect to Database:
```bash
psql -h dpg-d4j0io6uk2gs73bhkldg-a -p 5432 -U production_db_postgres_6gz5_user -d production_db_postgres_6gz5
```

When prompted, enter password: `SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF`

### Run Migrations in Order:
```sql
-- Migration 0: Base Tables
\i src/main/resources/db/migration/V000__create_base_tables.sql

-- Migration 1: Regulation Table
\i src/main/resources/db/migration/V001__create_regulation_table.sql

-- Migration 2: SubBranch Table
\i src/main/resources/db/migration/V002__create_sub_branch_table.sql

-- Migration 3: Semester Table
\i src/main/resources/db/migration/V003__create_semester_table.sql

-- Migration 4: Alter Subject Table
\i src/main/resources/db/migration/V004__alter_subject_table_add_columns.sql

-- Migration 5: Data Migration
\i src/main/resources/db/migration/V005__migrate_existing_subject_data.sql

-- Migration 6: NOT NULL Constraints
\i src/main/resources/db/migration/V006__set_not_null_constraints.sql

-- Migration 7: Fix Duplicate Constraints
\i src/main/resources/db/migration/V007__fix_duplicate_constraints.sql
```

---

## Method 3: Using Flyway CLI (If Installed)

If you have Flyway CLI installed:

```bash
flyway -url=jdbc:postgresql://dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5 \
       -user=production_db_postgres_6gz5_user \
       -password=SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF \
       -locations=filesystem:src/main/resources/db/migration \
       -table=flyway_schema_history_printnread \
       migrate
```

---

## ✅ Verification After Migration

After migrations complete, verify the tables were created:

```sql
-- Check all printnread tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'printnread_%'
ORDER BY table_name;
```

**Expected Tables:**
- `printnread_branch`
- `printnread_material`
- `printnread_regulation`
- `printnread_semester`
- `printnread_sub_branch`
- `printnread_subject`
- `printnread_year_level`

**Check Flyway Schema History:**
```sql
SELECT * FROM flyway_schema_history_printnread 
ORDER BY installed_rank;
```

You should see 8 migrations (V000 through V007) with status 'Success'.

---

## 🔒 Security Note

**Important:** These credentials are for production database. Make sure to:
- Never commit credentials to version control
- Use environment variables in production
- Rotate passwords regularly
- Use Render's environment variable system for deployment

---

**Last Updated:** 2025-01-17

