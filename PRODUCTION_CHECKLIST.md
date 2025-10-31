# Production Deployment Checklist

## ☑️ CRITICAL - Must Complete Before Launch

### Environment Variables
- [ ] Replace ALL placeholder values in `.env.local` with real credentials
- [ ] Set up production environment variables in hosting platform
- [ ] Verify `REVENUECAT_WEBHOOK_SECRET` is configured
- [ ] Verify `OPENAI_API_KEY` is valid and has credits
- [ ] Set `NODE_ENV=production`
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Update `GMAIL_REDIRECT_URI` to production domain

### Security
- [ ] Ensure `.env*` files are in `.gitignore`
- [ ] Never commit actual API keys to git
- [ ] Enable webhook signature verification (already fixed in code)
- [ ] Review Row Level Security policies in Supabase
- [ ] Add rate limiting (middleware.js already created)
- [ ] Test CORS configuration with mobile app

### Backend
- [ ] Disable mock data mode (`USE_MOCK_DATA = false` - already fixed)
- [ ] Deploy `middleware.js` for rate limiting and security headers
- [ ] Deploy `/api/health` endpoint for monitoring
- [ ] Test all API endpoints with real data
- [ ] Add input validation to all routes (use `lib/validation.js`)
- [ ] Implement proper error logging (use `lib/logger.js`)

### Database
- [ ] Run migrations in Supabase (check `supabase-schema.sql`)
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Add database indexes for common queries
- [ ] Test Row Level Security policies

### Mobile App
- [ ] Update `EXPO_PUBLIC_API_URL` to production backend URL
- [ ] Update RevenueCat API keys (iOS & Android)
- [ ] Update Supabase URL and anon key
- [ ] Replace `alert()` with proper UI components
- [ ] Test authentication flow end-to-end
- [ ] Test in-app purchases on TestFlight/Internal Testing

---

## ⚠️ HIGH PRIORITY - Complete Soon After Launch

### Monitoring & Logging
- [ ] Set up external logging service (Sentry, LogRocket, CloudWatch)
- [ ] Configure uptime monitoring
- [ ] Set up error alerts
- [ ] Monitor API usage and costs
- [ ] Set up performance monitoring

### Performance
- [ ] Implement database connection pooling
- [ ] Add Redis for rate limiting (if using multiple backend instances)
- [ ] Optimize OpenAI API calls (caching, batching)
- [ ] Add CDN for static assets
- [ ] Implement response caching where appropriate

### API Protection
- [ ] Add API key authentication for sensitive endpoints
- [ ] Implement request size limits
- [ ] Add DDoS protection (Cloudflare, etc.)
- [ ] Review and tighten CORS policy

---

## 📋 MEDIUM PRIORITY - Nice to Have

### User Experience
- [ ] Replace all `alert()` with Toast notifications
- [ ] Add loading states to all async operations
- [ ] Improve error messages for users
- [ ] Add retry logic for failed requests

### Code Quality
- [ ] Add JSDoc comments to all functions
- [ ] Set up automated testing
- [ ] Add type checking (TypeScript or JSDoc)
- [ ] Set up CI/CD pipeline

### Features
- [ ] Implement proper form validation UI
- [ ] Add email verification flow
- [ ] Add password reset flow
- [ ] Implement proper onboarding analytics

---

## 🚀 Deployment Steps

### Backend (Next.js)

1. **Choose hosting provider** (Vercel, Railway, Fly.io, or AWS)

2. **Vercel (Recommended for Next.js)**:
   ```bash
   cd backend
   npm install -g vercel
   vercel
   ```
   - Add all environment variables in Vercel dashboard
   - Enable Edge Functions if needed

3. **Alternative - Railway**:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

### Mobile App (Expo)

1. **Update environment variables**:
   - Create `.env.production` with production values
   - Never commit this file

2. **Build for iOS**:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

3. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Health check endpoint returns 200
- [ ] Authentication works with real Supabase
- [ ] Gmail OAuth flow completes successfully
- [ ] OpenAI API calls work
- [ ] RevenueCat webhook signature verification works
- [ ] Rate limiting blocks excessive requests
- [ ] All database queries work

### Mobile App Tests
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Search functionality returns results
- [ ] Gmail scanning works (if connected)
- [ ] In-app purchase flow works
- [ ] Data persists after app restart
- [ ] Works on slow network connections

---

## 📞 Support Contacts

- **Supabase Issues**: Check Supabase dashboard logs
- **RevenueCat Issues**: Check RevenueCat dashboard
- **OpenAI Issues**: Check OpenAI usage dashboard
- **Expo Issues**: Check Expo dashboard and EAS Build logs

---

## 🔄 Rollback Plan

If critical issues arise:

1. **Backend**: Revert to previous deployment in hosting dashboard
2. **Mobile App**: Cannot rollback immediately (app stores take time)
   - Push hotfix through TestFlight for iOS
   - Use internal testing for Android
3. **Database**: Restore from backup (make sure backups are enabled!)

---

## ✅ Post-Launch Monitoring

Monitor these metrics daily for first week:

- [ ] Error rates in logs
- [ ] API response times
- [ ] User sign-up success rate
- [ ] In-app purchase success rate
- [ ] OpenAI API costs
- [ ] Database query performance
- [ ] User retention (Day 1, Day 7)

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}
