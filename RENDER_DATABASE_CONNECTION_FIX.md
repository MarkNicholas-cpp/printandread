# 🔧 Render PostgreSQL Database Connection Fix

## ⚠️ Problem

The backend is failing to connect to the PostgreSQL database with error:
```
UnknownHostException: dpg-d4dli31r0fns73fbs2v0-a
The connection attempt failed.
```

## 🔍 Root Cause

The issue occurs because:
1. **render.yaml is trying to create a NEW database** (`printandread-db`)
2. **You already have an EXISTING database** with different hostname
3. The connection string format needs proper parsing for Render's internal hostnames

## ✅ Solution Options

### Option 1: Use Existing Database (Recommended)

Since you already have a database, you should **manually set the connection string** in Render dashboard instead of using `render.yaml` database creation.

#### Steps:

1. **In Render Dashboard** → **Backend Service** → **Environment** tab

2. **Remove or ignore the database service** created by `render.yaml` (if any)

3. **Manually set these environment variables**:
   ```
   SPRING_DATASOURCE_URL=postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
   SPRING_DATASOURCE_USERNAME=production_db_postgres_6gz5_user
   SPRING_DATASOURCE_PASSWORD=SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF
   ```

4. **Keep other environment variables**:
   ```
   SPRING_PROFILES_ACTIVE=production
   PORT=8080
   FRONTEND_URL=https://printandread-frontend.onrender.com
   ```

### Option 2: Update render.yaml to Use Existing Database

Update `render.yaml` to remove database creation and use your existing database:

```yaml
services:
  # Backend Web Service (no database service - using existing one)
  - type: web
    name: printandread-backend
    runtime: docker
    plan: free
    region: singapore
    dockerfilePath: backend/Dockerfile
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: production
      - key: SPRING_DATASOURCE_URL
        value: postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
      - key: SPRING_DATASOURCE_USERNAME
        value: production_db_postgres_6gz5_user
      - key: SPRING_DATASOURCE_PASSWORD
        value: SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF
      - key: PORT
        value: 8080
      - key: FRONTEND_URL
        value: https://printandread-frontend.onrender.com
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
    healthCheckPath: /api/health
```

---

## 🔧 How the Connection String Works

### Render Connection String Format:
```
postgresql://username:password@internal-hostname:port/database-name
```

### Example:
```
postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
```

### Converted to JDBC Format:
```
jdbc:postgresql://dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
```

The `DatabaseConfig` class automatically:
1. ✅ Parses the `postgresql://` format
2. ✅ Extracts hostname, port, and database name
3. ✅ Converts to JDBC format
4. ✅ Uses username/password from separate environment variables

---

## 🧪 Testing the Connection

### Check Environment Variables in Render:

1. Go to **Backend Service** → **Environment** tab
2. Verify these are set:
   - `SPRING_DATASOURCE_URL` (should start with `postgresql://`)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`

### Check Logs:

After deployment, look for:
```
Database connection URL: jdbc:postgresql://dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
```

If you see this, the conversion worked. If you see errors, check the connection string format.

---

## 📝 Important Notes

1. **Internal Hostname**: Render uses internal hostnames (like `dpg-d4j0io6uk2gs73bhkldg-a`) that are only accessible from within Render's network
2. **Connection String Format**: Must be in `postgresql://` format, not `jdbc:postgresql://`
3. **Credentials**: Username and password are extracted and used separately
4. **Port**: Usually 5432 for PostgreSQL

---

## 🐛 Troubleshooting

### Error: "UnknownHostException"
- **Cause**: Hostname is incorrect or database doesn't exist
- **Fix**: Verify the hostname in your database connection string matches your actual database

### Error: "Connection attempt failed"
- **Cause**: Database is not accessible or credentials are wrong
- **Fix**: 
  - Verify database is running in Render
  - Check username and password are correct
  - Ensure database is in the same region as your backend service

### Error: "Database URL is not set"
- **Cause**: `SPRING_DATASOURCE_URL` environment variable is missing
- **Fix**: Set the environment variable in Render dashboard

---

**Last Updated:** 2025-01-17

