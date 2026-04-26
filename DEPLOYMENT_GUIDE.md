# 🚀 Deployment Guide - SOA Project

## **Part 1: MongoDB Atlas Setup (Cloud Database)**

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with your email
4. Verify email

### Step 2: Create a MongoDB Cluster
1. After login, click **"Create"** (on left side)
2. Choose **"Shared"** (Free tier) → Click **"Create"**
3. Choose region closest to you (e.g., N. Virginia, London, Singapore)
4. Wait 2-3 minutes for cluster to be created

### Step 3: Create Database User
1. Click **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in:
   - Username: `admin` (or your choice)
   - Password: Create a strong password (save it!)
4. Click **"Add User"**

### Step 4: Allow Network Access
1. Click **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** → **"Confirm"**
   - (For production, restrict to specific IPs)

### Step 5: Get Connection String
1. Go to **"Clusters"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Select **"Node.js"** and version **"3.6 or later"**
4. **Copy the connection string** (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

## **Part 2: Backend Deployment (Render.com)**

### Step 1: Prepare Backend for Deployment

1. **Create `.env` file in backend folder:**
   ```
   JWT_SECRET=your_secret_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/scss_research?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=production
   ```

2. **Update backend/server.js CORS:**
   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:3001',
       'http://localhost:5173',
       'https://your-vercel-domain.vercel.app'  // ADD YOUR VERCEL URL HERE LATER
     ],
     credentials: true,
   };
   ```

3. **Make sure package.json has start script:**
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

### Step 2: Create Render Account
1. Go to https://render.com
2. Click **"Sign Up"** with GitHub (recommended)
3. Authorize Render to access your GitHub

### Step 3: Deploy Backend to Render
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository (SOA_PROJECT)
3. Fill in settings:
   - **Name:** `soa-backend` (or your choice)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free tier
4. Click **"Advanced"** and add Environment Variables:
   - `JWT_SECRET` = (your secret)
   - `JWT_EXPIRE` = `7d`
   - `MONGODB_URI` = (your MongoDB connection string)
   - `NODE_ENV` = `production`
5. Click **"Create Web Service"**
6. Wait 2-3 minutes for deployment
7. **Copy the deployed URL** (e.g., `https://soa-backend.onrender.com`)

### Step 4: Test Backend
1. Open: `https://soa-backend.onrender.com/api/admin/papers`
   - Should show: `{ "data": [] }` (empty array)
2. If you see this, backend is working! ✅

---

## **Part 3: Frontend Deployment (Vercel)**

### Step 1: Update Frontend API URLs

1. **Create `.env` file in frontend folder:**
   ```
   VITE_API_BASE_URL=https://soa-backend.onrender.com/api
   ```

2. **Update frontend/src/services/api.js:**
   - Change hardcoded URL from `http://localhost:5000/api` to:
   ```javascript
   const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
   ```

3. **Update backend/server.js CORS again:**
   - Add your Vercel deployment URL (you'll get this in next steps)

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"** with GitHub
3. Authorize Vercel

### Step 3: Deploy Frontend to Vercel
1. Click **"Add New"** → **"Project"**
2. Select your SOA_PROJECT repository
3. Fill in settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **"Advanced"** and add Environment Variables:
   - `VITE_API_BASE_URL` = `https://soa-backend.onrender.com/api`
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. You'll get a URL like: `https://your-project-name.vercel.app` ✅

### Step 4: Update Backend CORS
1. Go back to Render dashboard
2. Click your backend service
3. Go to **"Environment"**
4. Update `CORS_ORIGIN` to include: `https://your-vercel-url.vercel.app`
5. Click **"Save"** and service will redeploy

---

## **Part 4: Final Testing**

### Test Admin Login
1. Go to your Vercel URL: `https://your-project-name.vercel.app`
2. Click **"Admin Login"** tab
3. Enter:
   - Username: `admin`
   - Password: `admin123`
4. Should redirect to Dashboard ✅

### Test Faculty Registration
1. Click **"Faculty Login"** tab → **"Register"**
2. Fill in form and upload a photo
3. Should say: "Registration successful!" ✅
4. Go to Admin Dashboard → **"Faculty Registrations"**
5. Approve the new faculty member ✅

### Test Faculty Login
1. Logout or open private/incognito window
2. Go to **"Faculty Login"** tab
3. Use the faculty email and password
4. Should show Faculty Dashboard ✅

---

## **Troubleshooting**

### API calls showing 404 or connection errors
- Check Render backend URL is correct
- Check MongoDB connection string (replace `<password>`)
- Check Render service is running (green status)

### Cloudinary photos not uploading
- Verify upload preset is "Unsigned"
- Check cloud name is correct (ddeeonffd)
- Clear browser cache

### CORS errors
- Add Vercel URL to backend CORS_ORIGIN
- Restart Render service

### Database not connecting
- Check MongoDB URI in .env
- Verify IP whitelist in MongoDB Atlas allows "0.0.0.0"

---

## **Important: Save These URLs**

After deployment, save:
```
Backend API: https://soa-backend.onrender.com
Frontend: https://your-project-name.vercel.app
MongoDB Connection String: [your connection string]
```

---

## **For Future Updates**

Simply push code to GitHub and:
- **Vercel** auto-deploys on every push to main branch
- **Render** auto-deploys when you enable auto-deploy in settings

✅ **Done!** Your app is live! 🎉
