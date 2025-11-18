# Render Deployment Configuration - Complete Setup

## ✅ Current Configuration Status

All configurations are optimized and ready for Render deployment.

---

## 📋 Configuration Summary

### 1. Angular Build Configuration (`angular.json`)

**Production Build Settings:**
```json
{
  "outputPath": "dist/printandread",
  "baseHref": "/",
  "outputHashing": "all",
  "optimization": true
}
```

✅ **Status:** Correctly configured

---

### 2. Render Blueprint (`render.yaml`)

**Frontend Static Site:**
```yaml
- type: web
  name: printandread-frontend
  runtime: static
  rootDirectory: frontend
  buildCommand: npm install && npm run build -- --configuration=production
  staticPublishPath: dist/printandread
```

✅ **Status:** Correctly configured

---

### 3. HTML Configuration (`index.html`)

**Key Settings:**
- `<base href="/">` ✅ Present
- No redirect scripts ✅ Clean
- Standard Angular structure ✅ Correct

✅ **Status:** Clean and ready

---

### 4. Angular Router (`app.routes.ts`)

**Root Redirect:**
```typescript
{ path: '', redirectTo: 'home', pathMatch: 'full' }
```

✅ **Status:** Correctly configured

---

### 5. Environment Configuration (`environment.prod.ts`)

**API URL:**
```typescript
apiUrl: 'https://printandread.onrender.com/api'
```

✅ **Status:** Correctly configured

---

## 🚀 Render Dashboard Setup Instructions

### Step 1: Create Static Site

1. Go to **Render Dashboard** → **New** → **Static Site**
2. Connect repository: `MarkNicholas-cpp/printandread`
3. Configure settings:

| Setting | Value |
|---------|-------|
| **Name** | `printandread-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build -- --configuration=production` |
| **Publish Directory** | `dist/printandread` |

4. Click **"Create Static Site"**

---

### Step 2: Wait for First Build

1. Wait for build to complete
2. Check **Events** tab for build logs
3. Verify output: `Output location: /opt/render/project/src/frontend/dist/printandread`

**If output shows different path:**
- Update **Publish Directory** in Settings to match actual output

---

### Step 3: Configure Rewrite Rule (CRITICAL)

**ONLY AFTER** first build completes:

1. Go to **Settings** → **Redirects and Rewrites**
2. Click **"+ Add Rule"**
3. Configure:

| Field | Value |
|-------|-------|
| **Source** | `/*` |
| **Destination** | `/index.html` |
| **Action** | **Rewrite** (NOT Redirect) |

4. **Save Changes**

⚠️ **IMPORTANT:**
- Action MUST be **"Rewrite"** (Status 200)
- NOT "Redirect" (301/302)
- Only ONE rule needed: `/*` → `/index.html`

---

### Step 4: Verify Configuration

**Final Checklist:**

- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build -- --configuration=production`
- [ ] Publish Directory: `dist/printandread` (verify from build logs)
- [ ] Rewrite Rule: `/*` → `/index.html` (Rewrite, Status 200)
- [ ] No other redirect/rewrite rules

---

## 🧪 Testing After Deployment

### Test 1: Root URL Redirect
1. Visit: `https://printandread-ui.onrender.com/`
2. Should automatically redirect to `/home`
3. URL bar should show `/home`

### Test 2: Direct Routes
1. Visit: `https://printandread-ui.onrender.com/branches`
2. Should load branches page (not redirect)

### Test 3: Browser DevTools
1. Open DevTools (F12) → **Network** tab
2. Refresh page
3. Verify all files load:
   - `index.html` → 200 OK
   - `main-*.js` → 200 OK
   - `chunk-*.js` → 200 OK
   - `styles-*.css` → 200 OK

---

## 🔧 Troubleshooting

### Issue: White Screen

**Check:**
1. Browser Console (F12) → Any errors?
2. Network Tab → Are JS files loading (200) or failing (404)?

**If JS files 404:**
- Publish Directory is wrong
- Check build logs for actual output location
- Update Publish Directory to match

### Issue: Redirect Not Working

**Check:**
1. Rewrite rule exists: `/*` → `/index.html` (Rewrite)
2. No conflicting rules (delete any `/` → `/home` rules)

### Issue: Routes Don't Work

**Check:**
1. Rewrite rule is configured correctly
2. Rule is `Rewrite` (not `Redirect`)
3. Only ONE rule exists

---

## ✅ Configuration Files Status

All files are correctly configured:

- ✅ `angular.json` - Production build optimized
- ✅ `render.yaml` - Static site configured
- ✅ `index.html` - Clean, base href set
- ✅ `app.routes.ts` - Root redirect configured
- ✅ `app.config.ts` - Clean router config
- ✅ `environment.prod.ts` - API URL set
- ✅ `main.ts` - Standard bootstrap
- ✅ `app.ts` - Clean component

---

## 📝 Summary

**Everything is ready for Render deployment.**

Follow the dashboard setup steps above, and the site should work correctly.

**Key Points:**
1. Publish Directory: `dist/printandread` (verify from build logs)
2. Rewrite Rule: `/*` → `/index.html` (Rewrite, Status 200)
3. Only ONE rewrite rule needed
4. Wait for first build before adding rewrite rule

