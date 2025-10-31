# Quick Start Guide - Production Deployment

## 🚀 Your app is 95% ready! Just need your API keys.

---

## ⚡ Quick Deploy (30 Minutes)

### Step 1: Configure Backend Environment (10 min)

```bash
cd backend
cp .env.local .env.production
```

Edit `.env.production` and replace these placeholders:

```bash
# Supabase - Get from https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# Gmail OAuth - Get from https://console.cloud.google.com/
GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REDIRECT_URI=https://your-domain.com/api/gmail/callback

# RevenueCat - Get from https://app.revenuecat.com/
REVENUECAT_API_KEY=your_key
REVENUECAT_WEBHOOK_SECRET=your_secret

# Mixpanel (Optional) - Get from https://mixpanel.com/
MIXPANEL_TOKEN=your_token

# App URL - Your backend URL after deployment
NEXT_PUBLIC_APP_URL=https://your-backend.vercel.app
NODE_ENV=production
```

### Step 2: Deploy Backend (10 min)

**Option A: Vercel (Recommended)**
```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```
Then add environment variables in Vercel dashboard.

**Option B: Railway**
```bash
cd backend
npm install -g railway
railway login
railway up
```
Then add environment variables in Railway dashboard.

### Step 3: Configure Mobile App (5 min)

```bash
cd ..  # Back to root
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Use your deployed backend URL
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app

# Use your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# RevenueCat keys from dashboard
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxx

NODE_ENV=production
```

### Step 4: Test Everything (5 min)

```bash
# Test backend health
curl https://your-backend.vercel.app/api/health

# Test mobile app
npm start
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Health endpoint returns 200: `curl https://your-backend.vercel.app/api/health`
- [ ] Can sign up new user
- [ ] Can search for opportunities
- [ ] Toasts appear (not alerts)
- [ ] Backend logs are in JSON format

---

## 🎯 What Was Already Done For You

✅ **Backend:**
- Rate limiting configured
- Input validation added to all routes
- Structured logging implemented
- Health check endpoint created
- Webhook security enforced
- Request size limits set
- Error handling improved

✅ **Mobile App:**
- Toast notification system
- Retry logic for API calls
- Mock data only in development
- Better error messages
- Proper loading states

✅ **Configuration:**
- Deployment configs created (Vercel, Railway)
- Environment templates provided
- Package.json scripts updated
- Comprehensive documentation

---

## 📚 Documentation Files

Created for you:

1. **PRODUCTION_CHECKLIST.md** - Detailed deployment steps
2. **SECURITY_REVIEW.md** - Security best practices & issues
3. **CHANGES_SUMMARY.md** - All changes made explained
4. **QUICK_START.md** - This file!

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Should return configuration issues
```

### Environment variables not loading
- Make sure file is named `.env.local` or `.env.production`
- Restart the dev server after changes
- Check no `your_*` placeholders remain

### Mobile app shows mock data
- Check `EXPO_PUBLIC_API_URL` is set
- Check backend is actually deployed and accessible
- Look at console logs for API errors

---

## 🆘 Need Help?

1. **Read the health check response** - Tells you what's misconfigured
2. **Check backend logs** - All errors are now structured JSON
3. **Review PRODUCTION_CHECKLIST.md** - Step-by-step guide
4. **Review SECURITY_REVIEW.md** - Security considerations

---

## 🎉 You're Almost There!

Just add your API keys and you're ready to launch! 🚀

The hard work is done - everything is production-ready except the environment variables.
