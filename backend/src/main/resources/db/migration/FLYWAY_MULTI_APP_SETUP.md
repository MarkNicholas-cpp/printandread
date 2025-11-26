# 🔄 Flyway Multi-Application Database Setup

## ⚠️ **Problem: Multiple Applications Sharing Same Database**

When **2 or more applications** share the **same PostgreSQL database**, they will **conflict** if they both use Flyway's default schema history table (`flyway_schema_history`).

### **What Happens Without Configuration:**

1. **Both applications** try to use the same `flyway_schema_history` table
2. **Migration version conflicts** - App A's migration V001 might conflict with App B's migration V001
3. **One app might try to run the other app's migrations** - causing errors
4. **No way to identify which migrations belong to which project**

### **Example Conflict Scenario:**

```
Database: shared_postgres_db

App A (printnread):
  - flyway_schema_history table
  - V001__create_users.sql
  - V002__create_orders.sql

App B (otherproject):
  - flyway_schema_history table (SAME TABLE!)
  - V001__create_products.sql  ← CONFLICT! Same version number
  - V002__create_categories.sql
```

**Result:** Both apps write to the same history table, causing confusion and potential errors.

---

## ✅ **Solution: Project-Specific Schema History Tables**

Each application should use a **unique schema history table name** to track its own migrations independently.

### **Configuration Applied:**

1. **Java Configuration** (`DatabaseConfig.java`):
   ```java
   .table("flyway_schema_history_printnread")  // Project-specific table
   ```

2. **Properties Configuration** (`application-prod.properties`):
   ```properties
   spring.flyway.table=flyway_schema_history_printnread
   ```

3. **Development Configuration** (`application.properties`):
   ```properties
   spring.flyway.table=flyway_schema_history_printnread
   ```

---

## 📊 **How It Works Now**

### **Database Structure:**

```
Database: shared_postgres_db

App A (printnread):
  - flyway_schema_history_printnread  ← Unique table
  - printnread_branch
  - printnread_subject
  - printnread_material
  - ... (all printnread_* tables)

App B (otherproject):
  - flyway_schema_history_otherproject  ← Different table
  - otherproject_users
  - otherproject_orders
  - ... (all otherproject_* tables)
```

### **Benefits:**

✅ **No conflicts** - Each app tracks its own migrations  
✅ **Clear identification** - Table name shows which project it belongs to  
✅ **Independent versioning** - Each app can use V001, V002, etc. without conflicts  
✅ **Safe coexistence** - Multiple apps can share the same database safely  

---

## 🔍 **Verification**

### **Check Schema History Tables:**

```sql
-- List all Flyway schema history tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'flyway_schema_history%'
ORDER BY table_name;
```

**Expected Output:**
```
flyway_schema_history_printnread
flyway_schema_history_otherproject
... (one per application)
```

### **Check Migration Status:**

```sql
-- Check printnread migrations
SELECT * FROM flyway_schema_history_printnread 
ORDER BY installed_rank;

-- Check other project migrations (if exists)
SELECT * FROM flyway_schema_history_otherproject 
ORDER BY installed_rank;
```

---

## 📝 **Best Practices for Multi-App Databases**

1. **Table Prefixes**: Use project-specific prefixes for all tables (e.g., `printnread_*`)
2. **Schema History Table**: Use project-specific name (e.g., `flyway_schema_history_printnread`)
3. **Naming Convention**: 
   - Schema history: `flyway_schema_history_{projectname}`
   - Tables: `{projectname}_{tablename}`
4. **Documentation**: Document which tables belong to which project

---

## 🚀 **For Other Projects**

When setting up a new application that will share the database:

1. **Set unique schema history table:**
   ```properties
   spring.flyway.table=flyway_schema_history_{projectname}
   ```

2. **Prefix all tables:**
   ```sql
   CREATE TABLE {projectname}_users (...)
   CREATE TABLE {projectname}_orders (...)
   ```

3. **Update entity classes:**
   ```java
   @Table(name = "{projectname}_users")
   ```

---

**Last Updated:** 2025-01-17  
**Status:** ✅ Configured for Multi-App Database

