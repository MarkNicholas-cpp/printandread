# 🚀 Complete Render Deployment Guide

## 📋 Prerequisites

- [x] GitHub account
- [x] Render account (sign up at https://render.com)
- [x] Code pushed to GitHub repository
- [x] Cloudinary account (for PDF storage)

---

## 🗂️ Step 1: Files Created

✅ **Created Files:**
- `render.yaml` - Blueprint for all services
- `frontend/src/environments/environment.prod.ts` - Production environment config
- Updated `frontend/angular.json` - Added fileReplacements for production build

---

## 🚀 Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Production ready: Added render.yaml, production environment, and Angular config"
git push origin main
```

---

## 🗄️ Step 3: Deploy on Render

### Option A: Using Blueprint (Recommended)

1. Go to **Render Dashboard** → **New** → **Blueprint**
2. Connect your GitHub repository
3. Render will detect `render.yaml` and create all services automatically
4. **IMPORTANT:** After services are created, go to **Backend Service** → **Environment** and manually add:
   - `CLOUDINARY_CLOUD_NAME` = [your-cloudinary-name]
   - `CLOUDINARY_API_KEY` = [your-cloudinary-key]
   - `CLOUDINARY_API_SECRET` = [your-cloudinary-secret]
5. Click **Create Blueprint**
6. Wait for all services to deploy (10-15 minutes first time)

### Option B: Manual Setup (If Blueprint doesn't work)

#### 3.1 Create PostgreSQL Database

1. **Render Dashboard** → **New** → **PostgreSQL**
2. Configure:
   - **Name:** `printandread-db`
   - **Database:** `printandread`
   - **Region:** Singapore (or your preferred)
   - **Instance Type:** Free
   - **Storage:** 1 GB
3. Click **Create Database**
4. **Save connection details** (you'll need them)

#### 3.2 Create Backend Web Service

1. **Render Dashboard** → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

   **Basic Settings:**
   - **Name:** `printandread-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ **IMPORTANT**

   **Build & Deploy:**
   - **Runtime:** Java
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/printandread-0.0.1-SNAPSHOT.jar`

4. **Environment Variables** (add these):
   ```
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=[Internal Database URL from database settings]
   SPRING_DATASOURCE_USERNAME=[from database]
   SPRING_DATASOURCE_PASSWORD=[from database]
   CLOUDINARY_CLOUD_NAME=[your-cloudinary-name]
   CLOUDINARY_API_KEY=[your-cloudinary-key]
   CLOUDINARY_API_SECRET=[your-cloudinary-secret]
   PORT=8080
   FRONTEND_URL=https://printandread-frontend.onrender.com
   ```

5. Click **Create Web Service**
6. Wait for deployment (5-10 minutes)
7. **Check logs** for:
   - ✅ "Flyway migration successful"
   - ✅ "Started PrintandreadApplication"
   - ✅ No errors

#### 3.3 Create Frontend Static Site

1. **Render Dashboard** → **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:

   **Basic Settings:**
   - **Name:** `printandread-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`

   **Build Settings:**
   - **Build Command:** `npm install && npm run build -- --configuration=production`
   - **Publish Directory:** `dist/printandread/browser` (or `dist/printandread` if browser folder doesn't exist)

4. Click **Create Static Site**
5. Wait for build (3-5 minutes)

---

## 📦 Step 4: Import Your Data

### 4.1 Export Local Data (if not done)

```bash
cd backend/scripts
export_local_data.bat
```

The export file will be at: `C:\Users\markp\AppData\Local\Temp\printandread_data_export.sql`

### 4.2 Import to Render Database

1. Get **External Database URL** from Render database settings
2. Run import script:
   ```bash
   cd backend/scripts
   import_to_render.bat
   ```
3. When prompted, enter:
   - **Host:** [from External Database URL]
   - **Port:** [from External Database URL]
   - **Database:** `printandread`
   - **Username:** [from database]
   - **Password:** [from database]
   - **SQL File Path:** `C:\Users\markp\AppData\Local\Temp\printandread_data_export.sql`
4. Wait for import to complete
5. Verify success message

---

## 🔄 Step 5: Update Frontend API URL

After backend deploys, update the production environment file:

1. Get your backend URL from Render (e.g., `https://printandread-backend.onrender.com`)
2. Update `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://printandread-backend.onrender.com/api'  // Your actual backend URL
   };
   ```
3. Commit and push:
   ```bash
   git add frontend/src/environments/environment.prod.ts
   git commit -m "Update production API URL"
   git push origin main
   ```
4. Render will auto-redeploy frontend

---

## ✅ Step 6: Verify Deployment

### 6.1 Test Backend

```bash
# Health check
curl https://printandread-backend.onrender.com/api/health

# Expected response:
# {"status":"OK","timestamp":"2025-11-17T..."}

# Test API endpoints
curl https://printandread-backend.onrender.com/api/branches
curl https://printandread-backend.onrender.com/api/subjects
```

### 6.2 Test Frontend

1. Visit: `https://printandread-frontend.onrender.com`
2. Open browser DevTools → Network tab
3. Test features:
   - ✅ Navigation works
   - ✅ Search works
   - ✅ Materials load
   - ✅ PDF viewer works
   - ✅ Admin panel (if accessible)

### 6.3 Verify Database

1. Connect to Render database using External Database URL
2. Verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' ORDER BY table_name;
   ```
3. Verify data imported:
   ```sql
   SELECT COUNT(*) FROM branch;
   SELECT COUNT(*) FROM subject;
   SELECT COUNT(*) FROM material;
   ```

---

## 🔍 Troubleshooting

### Backend Won't Start

**Symptoms:** Service shows "Failed" or keeps restarting

**Solutions:**
1. Check logs in Render dashboard
2. Verify database connection:
   - Use **Internal Database URL** (not External)
   - Check credentials are correct
3. Verify environment variables:
   - `SPRING_PROFILES_ACTIVE=production` is set
   - All Cloudinary variables are set
4. Check Flyway migrations:
   - Look for "Flyway migration successful" in logs
   - If migration fails, check migration files

### Frontend Can't Connect to Backend

**Symptoms:** API calls fail, CORS errors in console

**Solutions:**
1. Verify backend URL in `environment.prod.ts` matches actual backend URL
2. Check CORS configuration:
   - `FRONTEND_URL` in backend environment variables should match frontend URL
   - Update if different
3. Check backend is running:
   - Visit backend health endpoint
   - Check backend logs

### Database Connection Failed

**Symptoms:** Backend logs show "Connection refused" or "Authentication failed"

**Solutions:**
1. Use **Internal Database URL** for backend (not External)
2. Verify database is running (check status in Render dashboard)
3. Check credentials match database settings
4. Verify database name is correct

### Migrations Not Running

**Symptoms:** Tables don't exist or schema errors

**Solutions:**
1. Check `SPRING_PROFILES_ACTIVE=production` is set
2. Verify Flyway is enabled in `application-prod.properties`
3. Check logs for Flyway messages
4. Manually run migrations if needed (not recommended)

### Frontend Build Fails

**Symptoms:** Static site build fails

**Solutions:**
1. Check build logs for errors
2. Verify Node.js version (Render uses Node 18+)
3. Check `package.json` dependencies
4. Verify `angular.json` configuration
5. Check if `dist/printandread/browser` exists (if not, use `dist/printandread`)

---

## 📊 Quick Reference

### URLs (Update with your actual URLs):

- **Backend:** `https://printandread-backend.onrender.com`
- **Backend Health:** `https://printandread-backend.onrender.com/api/health`
- **Frontend:** `https://printandread-frontend.onrender.com`

### Database Connection:

- **Internal URL:** Use for backend (auto-configured in render.yaml)
- **External URL:** Use for local tools (pgAdmin, psql, import scripts)

### Environment Variables Checklist:

**Backend:**
- [x] `SPRING_PROFILES_ACTIVE=production`
- [x] `SPRING_DATASOURCE_URL` (from database)
- [x] `SPRING_DATASOURCE_USERNAME` (from database)
- [x] `SPRING_DATASOURCE_PASSWORD` (from database)
- [x] `CLOUDINARY_CLOUD_NAME`
- [x] `CLOUDINARY_API_KEY`
- [x] `CLOUDINARY_API_SECRET`
- [x] `PORT=8080`
- [x] `FRONTEND_URL` (frontend URL)

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `render.yaml` created
- [ ] `environment.prod.ts` created
- [ ] `angular.json` updated with fileReplacements
- [ ] PostgreSQL database created on Render
- [ ] Backend web service created
- [ ] All backend environment variables set
- [ ] Backend deployed successfully
- [ ] Backend health check passes
- [ ] Flyway migrations completed
- [ ] Data exported from local database
- [ ] Data imported to Render database
- [ ] Frontend static site created
- [ ] Frontend deployed successfully
- [ ] Frontend API URL updated
- [ ] CORS configured correctly
- [ ] All features tested and working

---

## 💰 Cost Estimate (Free Tier)

- **PostgreSQL:** Free for 90 days → $7/month after
- **Backend:** Free (spins down after 15 min inactivity, ~30s cold start)
- **Frontend:** Free (always on)
- **Total:** $0 for 90 days, then ~$7/month

---

## 🚀 Next Steps After Deployment

1. **Monitor Logs:** Check Render logs regularly for errors
2. **Set Up Alerts:** Configure email alerts for service failures
3. **Backup Database:** Set up regular database backups
4. **Performance:** Monitor response times and optimize if needed
5. **Updates:** Keep dependencies updated
6. **SSL:** Render provides free SSL certificates automatically
7. **Custom Domain:** Add your custom domain in Render settings

---

## 📝 Notes

- **Free Tier Limitations:**
  - Backend spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds (cold start)
  - Database free for 90 days only
  - Limited to 1 GB database storage

- **Production Recommendations:**
  - Upgrade to paid tier for always-on backend
  - Set up database backups
  - Monitor performance metrics
  - Use CDN for static assets (Render handles this)

---

**Status:** ✅ Ready to Deploy

**Last Updated:** 2025-11-17

