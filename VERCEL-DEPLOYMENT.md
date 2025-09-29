# Car Expo V1 - Vercel Deployment Guide

## 🚀 Deploy to Vercel

This project is configured as a monorepo with:

- **Frontend**: Next.js application (`car_expo/frontend`)
- **Backend**: Node.js API (`car_expo/backend`)
- **Scraper**: Python web scraper (`car_scraper`)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your API keys

## 🔧 Environment Variables

Set these in your Vercel dashboard:

### Required

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Optional

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

## 🚀 Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 2. Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `car_expo/frontend`
- **Build Command**: `yarn build`
- **Output Directory**: `.next`

### 3. Set Environment Variables

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the variables listed above

### 4. Deploy

Click "Deploy" and wait for the build to complete!

## 📁 Project Structure

```
car_expoV1/
├── vercel.json                 # Vercel configuration
├── package.json               # Root package.json for monorepo
├── car_expo/
│   ├── frontend/              # Next.js app
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── ...
│   └── backend/               # Node.js API
│       ├── package.json
│       ├── src/index.js
│       └── ...
└── car_scraper/               # Python scraper
    ├── api.py                 # Vercel Python function
    ├── carfax_tempe_scraper.py
    ├── requirements-vercel.txt
    └── ...
```

## 🔗 API Endpoints

After deployment, your app will have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.vercel.app/api/*`
- **Python Scraper**: `https://your-project.vercel.app/scraper/*`

## 🧪 Testing the Deployment

### Frontend

Visit your Vercel URL to see the car expo interface.

### Backend API

```bash
curl https://your-project.vercel.app/api/cars
```

### Python Scraper

```bash
curl -X POST https://your-project.vercel.app/scraper \
  -H "Content-Type: application/json" \
  -d '{"make": "toyota", "model": "camry"}'
```

## 🔧 Local Development

### Install Dependencies

```bash
# Install root dependencies
yarn install

# Install frontend dependencies
cd car_expo/frontend && yarn install

# Install backend dependencies
cd ../backend && npm install

# Install Python dependencies
cd ../../car_scraper && pip install -r requirements.txt
```

### Run Development Servers

```bash
# From root directory
yarn dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🐛 Troubleshooting

### Build Failures

1. Check environment variables are set
2. Verify all dependencies are installed
3. Check the build logs in Vercel dashboard

### API Issues

1. Ensure OpenAI API key is valid
2. Check function timeout settings (max 60s for Python)
3. Verify CORS headers are set correctly

### Python Scraper Issues

1. Check that all Python dependencies are in `requirements-vercel.txt`
2. Verify the scraper can run locally
3. Check Vercel function logs for errors

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and function logs
- **Function Logs**: Check real-time logs for debugging
- **Analytics**: View usage statistics and performance

## 🔄 Updates

To update your deployment:

1. Push changes to your GitHub repository
2. Vercel will automatically trigger a new deployment
3. Monitor the build process in the dashboard

## 💡 Tips

1. **Environment Variables**: Use different values for development and production
2. **Function Limits**: Python functions have a 60-second timeout limit
3. **Cold Starts**: First requests may be slower due to function initialization
4. **Caching**: Vercel automatically caches static assets

---

**Need Help?** Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in your repository.
