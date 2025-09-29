# Car Expo V1 - Vercel Deployment Guide

## 🚀 Complete Deployment Guide for New Vercel Account

This guide will walk you through deploying your Car Expo V1 project to Vercel from scratch.

## 📋 Prerequisites

✅ **Completed:**

- [x] Vercel account created
- [x] Project configured for deployment
- [x] Environment variables identified

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Navigate to your project
cd /Users/igenius/Desktop/Hobby_projects/final_Sub3/car_expoV1

# Add all files
git add .

# Commit changes
git commit -m "feat: Add Vercel deployment configuration

- Configure monorepo structure for Vercel
- Add Python scraper as Vercel function
- Optimize Next.js build for production
- Add comprehensive deployment documentation
- Fix build errors and linting issues"

# Push to GitHub
git push origin main
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your `car_expo` repository
5. Click **"Import"**

### 2.2 Configure Project Settings

#### Project Name

- **Project Name**: `car-expo-v1` (or any unique name)
- **Framework Preset**: `Next.js` (auto-detected)
- **Root Directory**: `car_expo/frontend`
- **Build Command**: `yarn build`
- **Output Directory**: `.next`

#### Build Settings

```
Framework Preset: Next.js
Root Directory: car_expo/frontend
Build Command: yarn build
Output Directory: .next
Install Command: yarn install
```

### 2.3 Environment Variables

Add these environment variables in the Vercel dashboard:

#### Required Variables

```
OPENAI_API_KEY=your_openai_api_key_here
```

#### Optional Variables

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
NODE_ENV=production
```

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## 🧪 Step 3: Test Your Deployment

### 3.1 Frontend Test

Visit your Vercel URL to see the car expo interface:

```
https://your-project-name.vercel.app
```

### 3.2 Backend API Test

Test the backend API:

```bash
curl https://your-project-name.vercel.app/api/cars
```

### 3.3 Python Scraper Test

Test the Python scraper:

```bash
curl -X POST https://your-project-name.vercel.app/scraper \
  -H "Content-Type: application/json" \
  -d '{"make": "toyota", "model": "camry"}'
```

## 🔧 Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain

1. Go to your project dashboard
2. Click **"Domains"** tab
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 SSL Certificate

Vercel automatically provides SSL certificates for all domains.

## 📊 Step 5: Monitor Your Deployment

### 5.1 Vercel Dashboard

- **Deployments**: View all deployments and their status
- **Functions**: Monitor serverless function performance
- **Analytics**: View traffic and performance metrics
- **Logs**: Check real-time function logs

### 5.2 Performance Monitoring

- **Core Web Vitals**: Automatic monitoring
- **Function Duration**: Track API response times
- **Error Rates**: Monitor application errors

## 🐛 Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails during deployment
**Solution**:

1. Check build logs in Vercel dashboard
2. Verify all dependencies are in package.json
3. Ensure environment variables are set

#### API Not Working

**Problem**: Backend API returns 404
**Solution**:

1. Check function logs in Vercel dashboard
2. Verify API routes are correctly configured
3. Test locally first

#### Python Scraper Issues

**Problem**: Scraper function fails
**Solution**:

1. Check Python function logs
2. Verify all dependencies are in requirements-vercel.txt
3. Test with simple requests first

#### Environment Variables

**Problem**: App can't access environment variables
**Solution**:

1. Ensure variables are set in Vercel dashboard
2. Use `NEXT_PUBLIC_` prefix for client-side variables
3. Redeploy after adding new variables

### Debug Commands

```bash
# Check build locally
cd car_expo/frontend && yarn build

# Test API locally
cd car_expo/backend && npm start

# Test Python scraper locally
cd car_scraper && python api.py
```

## 🔄 Step 6: Continuous Deployment

### 6.1 Automatic Deployments

- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Branch-specific deployments

### 6.2 Manual Deployments

```bash
# Trigger manual deployment
git push origin main
```

## 📈 Step 7: Optimize Performance

### 7.1 Frontend Optimization

- **Image Optimization**: Automatic with Next.js
- **Code Splitting**: Automatic with Next.js
- **Caching**: Automatic with Vercel Edge Network

### 7.2 Backend Optimization

- **Function Caching**: Configure in vercel.json
- **Database Connections**: Use connection pooling
- **API Rate Limiting**: Implement if needed

### 7.3 Python Function Optimization

- **Cold Start**: First request may be slower
- **Memory**: Optimize for 1024MB limit
- **Timeout**: 60-second maximum

## 🔒 Step 8: Security

### 8.1 Environment Variables

- Never commit `.env` files
- Use Vercel's secure environment variable storage
- Rotate API keys regularly

### 8.2 API Security

- Implement rate limiting
- Use HTTPS (automatic with Vercel)
- Validate all inputs

### 8.3 CORS Configuration

- Configured in Python function
- Allow only necessary origins
- Use proper headers

## 📱 Step 9: Mobile Optimization

### 9.1 Responsive Design

- Already implemented in your app
- Test on various devices
- Use Vercel's mobile preview

### 9.2 Performance

- Optimize images for mobile
- Minimize bundle size
- Use service workers if needed

## 🎯 Step 10: Go Live Checklist

### Pre-Launch

- [ ] All environment variables set
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] All features tested
- [ ] Performance optimized
- [ ] Error monitoring set up

### Post-Launch

- [ ] Monitor deployment logs
- [ ] Check analytics
- [ ] Test all user flows
- [ ] Monitor error rates
- [ ] Set up alerts

## 🆘 Support

### Vercel Support

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

### Project-Specific Issues

- Check the `VERCEL-DEPLOYMENT.md` file for detailed technical information
- Review build logs in Vercel dashboard
- Test locally before deploying

## 🎉 Success!

Once deployed, your Car Expo V1 will be available at:

- **Frontend**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api/*`
- **Scraper**: `https://your-project-name.vercel.app/scraper/*`

Your app is now live and ready for users! 🚗✨

---

**Need Help?**

- Check Vercel dashboard logs
- Test locally first
- Review this guide step by step
- Contact Vercel support if needed
