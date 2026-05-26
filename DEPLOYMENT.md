# Deployment Guide

⚠️ **Important**: Deploy the **Server (Backend) FIRST**, then the Client (Frontend).

---

## Server Deployment (Render) - DEPLOY THIS FIRST

### Prerequisites
- GitHub account connected to Render
- MongoDB Atlas account (free tier)

### MongoDB Setup

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Create database user
   - Whitelist all IPs (0.0.0.0/0) for Render access
   - Get connection string

### Render Deployment

1. **Go to [Render](https://render.com)**
   - Sign in with GitHub
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select `app-news-management` repository
   - Click "Connect"

3. **Configure Service** (if not using render.yaml)
   
   **Option A: Using render.yaml (Recommended)**
   - Render will automatically detect `render.yaml` in the root directory
   - Just add the required environment variables in the dashboard
   
   **Option B: Manual Configuration**
   - **Name**: `news-backend`
   - **Region**: Frankfurt (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. **Environment Variables**
   Add the following:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/news-db?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
   JWT_REFRESH_EXPIRES_IN=7d
   ```
   
   ⚠️ **Important**: Make sure to set the **Root Directory** to `server` in the Render dashboard settings if not using render.yaml!

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be live at `https://news-backend-xxxx.onrender.com`

### Important Notes

- **Free tier limitations**: 
  - Render free tier spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free

- **CORS**: Server is configured to accept requests from any origin. Update `server/src/main.ts` if you want to restrict to specific domains.

- **Save your backend URL**: Copy the URL (e.g., `https://news-backend-xxxx.onrender.com`) - you'll need it for the client deployment.

---

## Client Deployment (Vercel) - DEPLOY THIS SECOND

### Prerequisites
- Backend deployed on Render (from previous step)
- Backend URL copied

### Steps

1. **Go to [Vercel](https://vercel.com)**
   - Sign in with GitHub
   - Click "Add New Project"

2. **Import Repository**
   - Select `app-news-management` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add the following environment variable with your Render backend URL:
   ```
   VITE_API_BASE_URL=https://news-backend-xxxx.onrender.com
   ```
   ⚠️ Replace `news-backend-xxxx.onrender.com` with your actual Render URL from the previous step.

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your client will be live at `https://your-project.vercel.app`

6. **Test the Application**
   - Visit your Vercel URL
   - Try to login with mock credentials (see README.md)
   - Check if API calls work properly

---

## Deployment Order Summary

1. ✅ **First**: Deploy Server to Render → Get backend URL
2. ✅ **Second**: Deploy Client to Vercel → Use backend URL in environment variables

---

## Post-Deployment

### Test Deployment
1. Visit your Vercel URL
2. Try to register/login
3. Check if API calls work
4. Monitor Render logs for errors

### Monitoring
- **Vercel**: Check deployment logs in dashboard
- **Render**: Check service logs in dashboard
- **MongoDB**: Monitor connections in Atlas dashboard

---

## Troubleshooting

### Client Issues
- **API calls fail**: Check `VITE_API_BASE_URL` is correct
- **Build fails**: Check Node version (should be 18+)
- **404 on refresh**: Vercel routing is configured in `vercel.json`

### Server Issues
- **MongoDB connection fails**: Check connection string and IP whitelist
- **JWT errors**: Ensure JWT secrets are set and at least 32 characters
- **Cold start slow**: Normal for Render free tier

### Common Fixes
- Clear Vercel build cache and redeploy
- Check Render logs for specific errors
- Verify all environment variables are set correctly
