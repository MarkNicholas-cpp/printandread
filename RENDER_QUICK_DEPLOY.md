# 🚀 Quick Render Deployment Guide

## ✅ Changes Pushed to GitHub

All changes have been successfully pushed to the repository.

---

## 📋 Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect GitHub Repository**: `MarkNicholas-cpp/printandread`
4. **Select Branch**: `main`
5. **Render will detect `render.yaml`** and create services automatically

**⚠️ Important**: The `render.yaml` will try to create a new database. Since you already have one, you have two options:

#### Option A: Use Existing Database (Recommended)
- After Blueprint creates services, **delete the database service** it creates
- **Manually link your existing database** to the backend service
- Update environment variables to use your existing database credentials

#### Option B: Create New Database via Blueprint
- Let Blueprint create everything
- Migrate data from old database to new one later

---

### Option 2: Manual Service Creation

Since you already have a database, manually create services:

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
   - **Docker Build Context**: `backend` ⚠️ **Set this in Advanced Settings!**

4. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
   SPRING_DATASOURCE_USERNAME=production_db_postgres_6gz5_user
   SPRING_DATASOURCE_PASSWORD=SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF
   PORT=8080
   FRONTEND_URL=https://printandread-frontend.onrender.com
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

5. **Health Check Path**: `/api/health`

6. **Click "Create Web Service"**

#### Step 2: Create Frontend Service

1. **Go to Render Dashboard** → **"New +"** → **"Web Service"**
2. **Connect Repository**: `MarkNicholas-cpp/printandread`
3. **Configure**:
   - **Name**: `printandread-frontend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Environment**: `Docker`
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Docker Build Context**: `frontend` ⚠️ **Set this in Advanced Settings!**

4. **Health Check Path**: `/health`

5. **Click "Create Web Service"**

#### Step 3: Update Backend with Frontend URL

After frontend deploys and gets a URL:

1. **Go to Backend Service** → **Environment** tab
2. **Update** `FRONTEND_URL` to the actual frontend URL:
   ```
   FRONTEND_URL=https://printandread-frontend.onrender.com
   ```
3. **Save Changes** (this will trigger a redeploy)

---

## 🔍 What Happens During Deployment

### Backend Deployment:
1. ✅ Docker builds the Spring Boot application
2. ✅ Application starts with `production` profile
3. ✅ Flyway automatically runs all 8 migrations
4. ✅ Creates tables with `printnread_` prefix
5. ✅ Creates schema history table: `flyway_schema_history_printnread`
6. ✅ Application starts on port 8080

### Frontend Deployment:
1. ✅ Docker builds Angular application
2. ✅ nginx serves the built application
3. ✅ Application accessible on port 80

---

## ✅ Verification

### 1. Check Backend Logs

Look for:
```
Flyway migration successful
Migrating schema to version 0 - Create Base Tables
...
Successfully applied 8 migrations
Started PrintandreadApplication
```

### 2. Test Endpoints

- **Backend Health**: `https://printandread-backend.onrender.com/api/health`
- **Frontend**: `https://printandread-frontend.onrender.com`
- **Frontend Health**: `https://printandread-frontend.onrender.com/health`

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

## ⚠️ Important Notes

1. **Docker Build Context**: 
   - **MUST** be set in Advanced Settings:
     - Backend: `backend`
     - Frontend: `frontend`
   - This is critical for Docker builds to work!

2. **Database Connection**:
   - Your existing database credentials are already configured
   - Migrations will run automatically on first deployment

3. **Free Tier**:
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds

4. **Cloudinary Credentials**:
   - Set these manually in the backend service environment variables
   - Never commit credentials to git

---

## 🐛 Troubleshooting

### Build Fails
- Check Docker Build Context is set correctly
- Verify Dockerfile paths are correct
- Check build logs for specific errors

### Migrations Not Running
- Verify `SPRING_PROFILES_ACTIVE=production`
- Check database connection string is correct
- Review backend logs for Flyway errors

### Frontend Not Loading
- Verify Docker Build Context is `frontend`
- Check nginx configuration
- Verify Angular build completed successfully

---

**Ready to Deploy!** 🚀

Go to https://dashboard.render.com and follow the steps above.

