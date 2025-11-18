# Render Static Site - Fresh Setup Guide

## Step-by-Step Configuration

After deleting the old static site, follow these steps to configure it correctly from scratch.

---

## ✅ STEP 1: Create New Static Site in Render

1. Go to **Render Dashboard** → **New** → **Static Site**
2. Connect your repository: `MarkNicholas-cpp/printandread`
3. Configure basic settings:

### Basic Settings:
- **Name:** `printandread-frontend` (or any name you prefer)
- **Branch:** `main`
- **Root Directory:** `frontend` ⚠️ **IMPORTANT**
- **Build Command:** `npm install && npm run build -- --configuration=production`
- **Publish Directory:** `dist/printandread` ⚠️ **IMPORTANT**

**DO NOT** click "Create Static Site" yet - continue to next step.

---

## ✅ STEP 2: Configure Build Settings

Before creating, verify these settings match:

### Build Settings:
```
Root Directory: frontend
Build Command: npm install && npm run build -- --configuration=production
Publish Directory: dist/printandread
```

**Why these values:**
- `rootDirectory: frontend` - Render will `cd` into `frontend/` folder
- Build command runs from `frontend/` directory
- Output goes to `frontend/dist/printandread/`
- Publish directory is relative to `rootDirectory`, so `dist/printandread` means `frontend/dist/printandread/`

---

## ✅ STEP 3: Create the Site

1. Click **"Create Static Site"**
2. Wait for first build to complete
3. **DO NOT** configure rewrite rules yet - wait for build to finish

---

## ✅ STEP 4: Check Build Output

After first build completes:

1. Go to **Events** tab
2. Look for line: `Output location: /opt/render/project/src/frontend/dist/printandread`
3. **Verify** this matches your `Publish Directory` setting

**If different:**
- Update **Publish Directory** in Settings to match the actual output location
- Common variations:
  - `dist/printandread` ✅ (correct)
  - `dist/printandread/browser` (if Angular creates browser subdirectory)

---

## ✅ STEP 5: Configure Rewrite Rule (CRITICAL)

**ONLY AFTER** first build completes successfully:

1. Go to **Settings** → **Redirects and Rewrites**
2. Click **"+ Add Rule"**
3. Configure EXACTLY:

| Field | Value |
|-------|-------|
| **Source** | `/*` |
| **Destination** | `/index.html` |
| **Action** | **Rewrite** (NOT Redirect) |

4. **Save Changes**

⚠️ **IMPORTANT:**
- Action MUST be **"Rewrite"** (serves index.html with status 200)
- NOT "Redirect" (which sends 301/302)
- Source MUST be `/*` (matches all paths)

---

## ✅ STEP 6: Verify Configuration

### Final Checklist:

- [ ] **Root Directory:** `frontend`
- [ ] **Build Command:** `npm install && npm run build -- --configuration=production`
- [ ] **Publish Directory:** `dist/printandread` (or whatever build logs show)
- [ ] **Rewrite Rule:** `/*` → `/index.html` (Rewrite, Status 200)
- [ ] **No other redirect/rewrite rules** (delete any `/` → `/home` rules)

---

## ✅ STEP 7: Test the Site

After configuration:

1. Visit: `https://printandread-ui.onrender.com/`
2. Should redirect to `/home` automatically
3. Page should load (not white screen)

### If white screen:

**Check Browser DevTools (F12):**

1. **Console Tab:**
   - Any red errors?
   - Share error messages

2. **Network Tab:**
   - Refresh page
   - Check these files:
     - `index.html` → Status should be **200**
     - `main-*.js` → Status should be **200** (NOT 404)
     - `chunk-*.js` → Status should be **200**
     - `styles-*.css` → Status should be **200**

**If `main-*.js` shows 404:**
- Publish Directory is wrong
- Check build logs for actual output location
- Update Publish Directory to match

---

## 📋 Current Code Configuration (Already Correct)

### `angular.json`
```json
"production": {
  "outputPath": "dist/printandread",
  "baseHref": "/",
  ...
}
```

### `render.yaml`
```yaml
staticPublishPath: dist/printandread
```

### `index.html`
```html
<base href="/">
```

### `app.routes.ts`
```typescript
{ path: '', redirectTo: 'home', pathMatch: 'full' }
```

---

## 🚨 Common Issues & Fixes

### Issue 1: JavaScript files return 404
**Fix:** Update Publish Directory to match actual build output location

### Issue 2: White screen, no errors
**Fix:** Check Network tab - if JS files 404, publish directory is wrong

### Issue 3: Redirect not working
**Fix:** Ensure rewrite rule is `/*` → `/index.html` (Rewrite, NOT Redirect)

### Issue 4: Site works but routes don't
**Fix:** Ensure rewrite rule exists and is correct

---

## ✅ Summary

**Key Settings:**
1. Root Directory: `frontend`
2. Publish Directory: `dist/printandread` (verify from build logs)
3. Rewrite Rule: `/*` → `/index.html` (Rewrite, 200)
4. No other rules needed

**After setup:**
- `/` should redirect to `/home`
- All routes should work
- No white screens

