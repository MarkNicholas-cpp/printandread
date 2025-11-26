# 🚀 Backend Deployment Guide for Render

## 📋 Overview

This guide covers deploying the Spring Boot backend to Render using Docker with proper environment profiles.

---

## ✅ Prerequisites

- [x] Backend Dockerfile configured
- [x] Production profile (`application-prod.properties`) configured
- [x] Development profile (`application.properties`) configured
- [x] Database migrations ready
- [x] `render.yaml` configured

---

## 🔧 Environment Profiles

### Development Profile (Default)
- **File:** `application.properties`
- **Usage:** Local development
- **Features:** SQL logging, debug mode, DevTools enabled

### Production Profile
- **File:** `application-prod.properties`
- **Usage:** Render deployment
- **Features:** Optimized, secure, production-ready

---

## 📋 Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect GitHub Repository**: `MarkNicholas-cpp/printandread`
4. **Select Branch**: `main`
5. **Render will detect `render.yaml`** and create:
   - PostgreSQL database
   - Backend web service (with production profile)
   - Frontend web service

### Option 2: Manual Service Creation

#### Step 1: Create Backend Service

1. **Go to Render Dashboard** → **"New +"** → **"Web Service"**
2. **Connect Repository**: `MarkNicholas-cpp/printandread`
3. **Configure**:
   - **Name**: `printandread-backend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Build Context**: `backend` ⚠️ **CRITICAL: Set this in Advanced Settings!**

4. **Environment Variables** (Set in Render Dashboard):
   ```
   SPRING_PROFILES_ACTIVE=production
   PORT=8080
   FRONTEND_URL=https://printandread-frontend.onrender.com
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

5. **Link Database**:
   - In Backend Service → **Environment** tab
   - Click **"Link Database"**
   - Select your PostgreSQL database
   - Render will automatically set:
     - `SPRING_DATASOURCE_URL`
     - `SPRING_DATASOURCE_USERNAME`
     - `SPRING_DATASOURCE_PASSWORD`

6. **Health Check Path**: `/api/health`

7. **Click "Create Web Service"**

---

## 🔍 What Happens During Deployment

1. ✅ **Docker Build**:
   - Builds Spring Boot application using Maven
   - Creates JAR file: `printandread-0.0.1-SNAPSHOT.jar`
   - Packages into minimal JRE image

2. ✅ **Application Start**:
   - Uses `production` profile (from `SPRING_PROFILES_ACTIVE`)
   - Loads `application-prod.properties`
   - Connects to Render PostgreSQL database

3. ✅ **Flyway Migrations**:
   - Automatically runs all 8 migrations
   - Creates tables with `printnread_` prefix
   - Creates schema history table: `flyway_schema_history_printnread`

4. ✅ **Application Ready**:
   - Starts on port 8080
   - Health check available at `/api/health`
   - API endpoints available at `/api/*`

---

## ✅ Verification

### 1. Check Deployment Logs

Look for:
```
The following profiles are active: production
Flyway migration successful
Migrating schema to version 0 - Create Base Tables
...
Successfully applied 8 migrations
Started PrintandreadApplication
```

### 2. Test Health Endpoint

```bash
curl https://printandread-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "UP"
}
```

### 3. Verify Database Tables

Connect to your database and run:
```sql
-- Check all printnread tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'printnread_%'
ORDER BY table_name;

-- Check Flyway schema history
SELECT * FROM flyway_schema_history_printnread 
ORDER BY installed_rank;
```

**Expected Tables:**
- `printnread_branch`
- `printnread_material`
- `printnread_regulation`
- `printnread_semester`
- `printnread_sub_branch`
- `printnread_subject`
- `printnread_year_level`
- `flyway_schema_history_printnread`

---

## 🔧 Environment Variables Reference

### Required Variables:

| Variable | Source | Description |
|----------|--------|-------------|
| `SPRING_PROFILES_ACTIVE` | Manual | Set to `production` |
| `SPRING_DATASOURCE_URL` | Auto (from DB) | Database connection string |
| `SPRING_DATASOURCE_USERNAME` | Auto (from DB) | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Auto (from DB) | Database password |
| `PORT` | Manual | Set to `8080` |
| `FRONTEND_URL` | Manual | Frontend service URL |

### Optional Variables (Cloudinary):

| Variable | Source | Description |
|----------|--------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Manual | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Manual | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Manual | Your Cloudinary API secret |

---

## 🐛 Troubleshooting

### Build Fails
- **Check:** Docker Build Context is set to `backend` in Advanced Settings
- **Check:** Dockerfile path is `backend/Dockerfile`
- **Check:** Build logs for Maven errors

### Application Won't Start
- **Check:** `SPRING_PROFILES_ACTIVE=production` is set
- **Check:** Database connection string is correct
- **Check:** All required environment variables are set

### Migrations Not Running
- **Check:** `SPRING_PROFILES_ACTIVE=production` is set
- **Check:** Database credentials are correct
- **Check:** Flyway is enabled in `application-prod.properties`
- **Review:** Backend logs for Flyway errors

### Database Connection Failed
- **Check:** Database is linked to backend service
- **Check:** Database is running and accessible
- **Check:** Connection string format is correct

### CORS Errors
- **Check:** `FRONTEND_URL` matches actual frontend URL
- **Check:** CORS configuration in `application-prod.properties`
- **Check:** Frontend is making requests to correct backend URL

---

## 📝 Important Notes

1. **Docker Build Context**: 
   - **MUST** be set to `backend` in Advanced Settings
   - This is critical for the build to work!

2. **Profile Activation**:
   - Production profile is activated via `SPRING_PROFILES_ACTIVE=production`
   - This is set in `render.yaml` or manually in dashboard

3. **Database Migrations**:
   - Run automatically on first deployment
   - Use project-specific schema history table
   - Safe to re-run (uses `IF NOT EXISTS`)

4. **Free Tier Limitations**:
   - Service spins down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds

5. **Environment Variables**:
   - Never commit production credentials to git
   - Use Render's environment variable system
   - Database credentials are auto-set when database is linked

---

## 🔄 Switching Between Profiles

### Local Development (Default):
```bash
# No profile needed - uses application.properties
mvn spring-boot:run
```

### Local Production Testing:
```bash
export SPRING_PROFILES_ACTIVE=production
mvn spring-boot:run
```

### Render Deployment:
- Automatically uses `production` profile
- Set via `SPRING_PROFILES_ACTIVE=production` in environment variables

---

**Last Updated:** 2025-01-17  
**Status:** ✅ Ready for Deployment

