# 🚀 Render Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] All changes pushed to GitHub
- [x] Database migrations configured with `printnread_` prefix
- [x] Flyway configured with project-specific schema history table
- [x] Frontend Docker + nginx configuration ready
- [x] Backend Docker configuration ready
- [x] render.yaml configured

---

## 📋 Deployment Steps

### Step 1: Connect GitHub Repository to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"** (or use existing services)
3. **Connect your GitHub repository**: `MarkNicholas-cpp/printandread`
4. **Select the branch**: `main`

---

### Step 2: Database Configuration

Your PostgreSQL database is already created:
- **Database Name**: `production_db_postgres_6gz5`
- **Hostname**: `dpg-d4j0io6uk2gs73bhkldg-a`
- **Port**: `5432`
- **Username**: `production_db_postgres_6gz5_user`
- **Password**: `SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF`

**Note**: The database connection string will be automatically provided via environment variables.

---

### Step 3: Deploy Backend Service

#### Option A: Using render.yaml (Recommended)

1. **In Render Dashboard**, go to **"Blueprints"**
2. **Click "New Blueprint"**
3. **Connect your repository** and select `render.yaml`
4. **Render will automatically detect** and create:
   - PostgreSQL database (already exists, will link to it)
   - Backend web service
   - Frontend web service

#### Option B: Manual Service Creation

If not using Blueprint:

1. **Create Web Service**:
   - **Name**: `printandread-backend`
   - **Environment**: `Docker`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Build Context**: `backend` (IMPORTANT: Set this in Advanced Settings)

2. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=<from database connection>
   SPRING_DATASOURCE_USERNAME=<from database connection>
   SPRING_DATASOURCE_PASSWORD=<from database connection>
   PORT=8080
   FRONTEND_URL=https://printandread-frontend.onrender.com
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

3. **Health Check Path**: `/api/health`

---

### Step 4: Deploy Frontend Service

1. **Create Web Service**:
   - **Name**: `printandread-frontend`
   - **Environment**: `Docker`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Docker Build Context**: `frontend` (IMPORTANT: Set this in Advanced Settings)

2. **Health Check Path**: `/health`

3. **No environment variables needed** for frontend (it's a static Angular app served by nginx)

---

### Step 5: Configure Database Connection

1. **In Backend Service Settings**:
   - Go to **"Environment"** tab
   - **Link the PostgreSQL database** (if not already linked)
   - Render will automatically set:
     - `SPRING_DATASOURCE_URL`
     - `SPRING_DATASOURCE_USERNAME`
     - `SPRING_DATASOURCE_PASSWORD`

2. **Manual Setup** (if needed):
   ```
   SPRING_DATASOURCE_URL=postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5
   SPRING_DATASOURCE_USERNAME=production_db_postgres_6gz5_user
   SPRING_DATASOURCE_PASSWORD=SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF
   ```

---

### Step 6: Set Cloudinary Credentials

In **Backend Service** → **Environment Variables**:

```
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

---

### Step 7: Update Frontend URL in Backend

After frontend is deployed, update the backend's `FRONTEND_URL`:

```
FRONTEND_URL=https://printandread-frontend.onrender.com
```

---

## 🔍 Verification Steps

### 1. Check Backend Deployment

1. **View Logs**: Check that Flyway migrations ran successfully
   - Look for: `Migrating schema to version 0 - Create Base Tables`
   - Look for: `Successfully applied 8 migrations`

2. **Test Health Endpoint**:
   ```
   https://printandread-backend.onrender.com/api/health
   ```

3. **Check Database Tables**:
   - Connect to database and verify:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name LIKE 'printnread_%'
   ORDER BY table_name;
   ```

### 2. Check Frontend Deployment

1. **Test Frontend URL**:
   ```
   https://printandread-frontend.onrender.com
   ```

2. **Test Health Endpoint**:
   ```
   https://printandread-frontend.onrender.com/health
   ```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Migrations not running
- **Solution**: Check that `SPRING_PROFILES_ACTIVE=production` is set
- Check logs for Flyway errors
- Verify database connection string is correct

**Problem**: Database connection failed
- **Solution**: Verify database credentials in environment variables
- Check that database is accessible from Render's network

### Frontend Issues

**Problem**: Frontend not loading
- **Solution**: Check Docker build logs
- Verify `Docker Build Context` is set to `frontend`
- Check nginx configuration

**Problem**: API calls failing
- **Solution**: Verify `FRONTEND_URL` in backend matches frontend URL
- Check CORS configuration in backend

---

## 📝 Important Notes

1. **Docker Build Context**: 
   - Backend: Must be set to `backend` in Render dashboard
   - Frontend: Must be set to `frontend` in Render dashboard

2. **Database Migrations**: 
   - Will run automatically on first backend deployment
   - Schema history table: `flyway_schema_history_printnread`

3. **Free Tier Limitations**:
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds

4. **Environment Variables**:
   - Never commit sensitive credentials to git
   - Use Render's environment variable system

---

## 🎯 Quick Deploy Commands (Using Render CLI - Optional)

If you have Render CLI installed:

```bash
# Deploy using render.yaml
render deploy
```

---

**Last Updated**: 2025-01-17  
**Status**: Ready for Deployment

