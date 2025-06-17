# Render.com Deployment Guide for SmartKoop Frontend

## Quick Fix Applied
✅ Created `public/_redirects` file to handle React Router routing

## Deployment Steps

### 1. Repository Setup
- Ensure your code is pushed to GitHub/GitLab
- Frontend code is in the `frontend/` directory

### 2. Render.com Configuration
1. Go to https://render.com and sign in
2. Click "New +" → "Static Site"
3. Connect your repository
4. Configure these settings:

**Build Settings:**
- **Name**: `smartkoop-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Node Version**: `18` (recommended)

**Environment Variables:**
- **Key**: `REACT_APP_API_URL`
- **Value**: `http://3.83.25.0:8000/api/v1`

### 3. Deploy
- Click "Create Static Site"
- Wait for build to complete (2-5 minutes)
- Your app will be available at: `https://your-app-name.onrender.com`

## Files Created for Deployment

### `public/_redirects`
```
/*    /index.html   200
```
This ensures all routes are handled by React Router instead of returning 404 errors.

## Troubleshooting

### Mixed Content Warnings
- Your frontend (HTTPS) calls backend (HTTP)
- Browsers may show security warnings but requests should work
- Consider upgrading backend to HTTPS for production

### Build Failures
- Check build logs in Render dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

### API Connection Issues
- Verify backend is accessible: `http://3.83.25.0:8000/api/v1`
- Check CORS settings on backend
- Ensure environment variable is set correctly

## Post-Deployment
- Test all major functionality
- Verify routing works (no more "Not Found" errors)
- Check API connectivity
- Monitor build logs for any issues

## Auto-Deploy
Render will automatically redeploy when you push changes to your repository branch.
