# Found Money - Deployment Guide

## Overview
Complete deployment guide for the Found Money app (React Native + Next.js backend)

---

## Prerequisites

### Required Accounts
- [ ] Supabase account
- [ ] Vercel account (for backend)
- [ ] Expo account
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)
- [ ] RevenueCat account
- [ ] OpenAI API access
- [ ] Gmail API credentials
- [ ] Mixpanel account

### Required Tools
- [ ] Node.js 20.19+ installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] EAS CLI installed (`npm install -g eas-cli`)

---

## Backend Deployment (Next.js to Vercel)

### 1. Supabase Setup
```bash
# 1. Create new Supabase project at supabase.com
# 2. Copy the SQL from backend/supabase-schema.sql
# 3. Run it in Supabase SQL Editor
# 4. Get your API keys from Settings > API
```

### 2. Environment Variables Setup
Create these in Vercel Dashboard > Settings > Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=https://yourdomain.com/api/auth/gmail/callback
REVENUECAT_API_KEY=your_revenuecat_key
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret
MIXPANEL_TOKEN=your_mixpanel_token
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Deploy to Vercel
```bash
cd backend
npx vercel --prod
```

### 4. Configure Webhooks
- RevenueCat: Add webhook URL `https://yourdomain.com/api/webhooks/revenuecat`
- Set up Gmail OAuth redirect URI in Google Console

---

## Mobile App Deployment

### 1. Configure Environment Variables
Update `.env` in root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### 2. RevenueCat Setup
1. Create products in RevenueCat:
   - Monthly: `monthly_subscription` ($9.99)
   - Yearly: `yearly_subscription` ($79.99)
2. Configure entitlement: `pro`
3. Set up App Store Connect and Google Play Console products

### 3. Build for Testing
```bash
# Install dependencies
npm install

# Configure EAS
eas build:configure

# Build for iOS TestFlight
eas build --platform ios --profile preview

# Build for Android Internal Testing
eas build --platform android --profile preview
```

### 4. Production Build
```bash
# iOS App Store
eas build --platform ios --profile production

# Android Google Play
eas build --platform android --profile production
```

### 5. Submit to Stores
```bash
# Submit to App Store Connect
eas submit --platform ios

# Submit to Google Play Console
eas submit --platform android
```

---

## App Store Submission Checklist

### App Store Connect (iOS)
- [ ] App name: "Found Money - Claim What's Yours"
- [ ] Bundle ID: com.foundmoney.app
- [ ] App icon (1024x1024)
- [ ] Screenshots for all required sizes
- [ ] App description (focus on benefits)
- [ ] Keywords: unclaimed money, class action, settlements, refunds
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support URL
- [ ] Age rating: 4+

### Google Play Console (Android)
- [ ] Package name: com.foundmoney.app
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Privacy policy URL
- [ ] Content rating questionnaire

---

## Post-Launch Monitoring

### Analytics Setup
1. Mixpanel Dashboard:
   - Create funnels for onboarding flow
   - Set up retention cohorts
   - Monitor conversion rates

2. RevenueCat Dashboard:
   - Monitor trial starts
   - Track conversion rates
   - Set up subscription alerts

3. Supabase Dashboard:
   - Monitor database usage
   - Set up alerts for errors

### Key Metrics to Track
- [ ] Day 1 retention: Target >25%
- [ ] Trial to paid conversion: Target >5%
- [ ] Onboarding completion: Target >60%
- [ ] Average revenue per user (ARPU)
- [ ] Customer acquisition cost (CAC): Target <$5

---

## Security Checklist

### Backend Security
- [ ] All API routes require authentication
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secure
- [ ] Database RLS policies enabled

### Mobile Security
- [ ] API keys in environment variables
- [ ] Secure token storage with expo-secure-store
- [ ] Certificate pinning (optional)
- [ ] Obfuscation for production builds

---

## Launch Strategy

### Week 1: Soft Launch
1. Release to 100 beta testers via TestFlight
2. Monitor crash reports and feedback
3. Fix critical issues
4. A/B test paywall pricing

### Week 2: Limited Release
1. Release to 1000 users
2. Monitor conversion metrics
3. Optimize onboarding based on drop-off data
4. Implement user feedback

### Week 3: Full Launch
1. Submit final build to stores
2. Launch paid acquisition campaigns
3. Target $5 CPA initially
4. Scale based on LTV:CAC ratio

---

## Troubleshooting

### Common Issues

**Supabase Connection Issues**
```bash
# Check if environment variables are set
# Verify RLS policies are correct
# Check Supabase service status
```

**RevenueCat Not Working**
```bash
# Verify products are created in stores
# Check API keys are correct
# Ensure entitlements are configured
```

**Gmail OAuth Failing**
```bash
# Verify redirect URI matches exactly
# Check OAuth consent screen is configured
# Ensure scopes are approved
```

---

## Support Resources

- Expo Documentation: https://docs.expo.dev
- Supabase Documentation: https://supabase.com/docs
- RevenueCat Documentation: https://docs.revenuecat.com
- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs

---

## Contact

For deployment support or questions:
- Create an issue on GitHub
- Email: support@foundmoney.app (to be configured)

---

## Final Launch Checklist

### Technical ✅
- [ ] All environment variables configured
- [ ] Backend deployed and tested
- [ ] Database migrations complete
- [ ] Mobile builds working on both platforms
- [ ] Push notifications configured
- [ ] Analytics tracking verified
- [ ] Subscription flow tested end-to-end

### Business ✅
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Support email configured
- [ ] Customer service process defined
- [ ] Refund policy established

### Marketing ✅
- [ ] App Store optimization complete
- [ ] Landing page live
- [ ] Social media accounts created
- [ ] Press kit prepared
- [ ] Launch announcement drafted

### Legal ✅
- [ ] Business entity formed
- [ ] Apple/Google developer accounts verified
- [ ] Payment processing configured
- [ ] Tax obligations understood
- [ ] Data privacy compliance (GDPR/CCPA)

---

## Success Targets

### Month 1
- 10,000 downloads
- 5% trial conversion
- $5k MRR

### Month 2
- 25,000 downloads
- 6% trial conversion
- $12k MRR

### Month 3
- 50,000 downloads
- 7% trial conversion
- $25k MRR

---

Good luck with your launch! 🚀