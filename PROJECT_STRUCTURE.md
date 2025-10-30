# Found Money App - Project Structure

## 📁 Project Overview
Complete React Native/Expo mobile app with Next.js backend for finding unclaimed money.

---

## 🎯 Mobile App Structure (Expo Router)

### Entry Points
```
index.js                    → Expo Router entry point
app/_layout.js             → Root layout with AppProvider & service initialization
app/index.js               → Initial route handler (loading/auth check)
```

### 🚀 Onboarding Flow (7 screens)
```
app/onboarding/
├── _layout.js             → Onboarding navigation stack
├── welcome.js             → Emotional hook ($1,847 average)
├── problem.js             → Agitation (animated counter)
├── personalization-1.js   → Subscriptions question
├── personalization-2.js   → Shopping habits
├── personalization-3.js   → Life changes (multi-select)
├── value-demo.js          → Show 6 money sources
├── quick-scan.js          → Email scan with animation
├── results-teaser.js      → $239 confirmed + locked results
└── paywall.js             → 2 pricing tiers with benefits
```

### 🏠 Main App (Tab Navigation)
```
app/tabs/
├── _layout.js             → Tab bar navigation
├── index.js               → Dashboard (stats, quick actions)
├── search.js              → Search all money sources
├── wallet.js              → Track claims by status
└── profile.js             → Settings & account management
```

### 📄 Detail Screens
```
app/money-detail/
└── [id].js                → Money opportunity details

app/claim-form/
└── [id].js                → AI-powered claim form
```

### 🔐 Authentication
```
app/auth/
├── sign-in.js             → Email/password sign in
└── sign-up.js             → Account creation
```

---

## 🧩 Components Library

```
components/
├── Button.js              → Primary/secondary/outline variants
├── Card.js                → White card with shadow
├── Input.js               → Form input with label/error
├── AnimatedCounter.js     → Animated number counter
└── MoneySourceCard.js     → Money opportunity card
```

---

## ⚙️ Services Layer

```
services/
├── supabase.js            → Database & auth (signIn, signUp, getMoneyFound)
├── api.js                 → Backend API calls (searchAll, autoFillForm)
├── analytics.js           → Mixpanel tracking
└── revenuecat.js          → Subscription management
```

---

## 🔄 State Management

```
contexts/
└── AppContext.js          → Global state (user, profile, subscription, money)
```

**State Structure:**
- `user` - Current authenticated user
- `profile` - User profile data
- `moneyFound` - Array of money opportunities
- `subscription` - Subscription status
- `onboardingComplete` - Boolean flag

---

## 🖥️ Backend Structure (Next.js 15)

```
backend/
├── app/
│   ├── layout.js          → Root layout
│   ├── page.js            → Homepage
│   └── api/
│       ├── auth/
│       │   └── callback/route.js
│       ├── gmail/
│       │   ├── connect/route.js
│       │   ├── scan/route.js
│       │   └── callback/route.js
│       ├── search/
│       │   ├── all/route.js
│       │   ├── class-actions/route.js
│       │   └── unclaimed-property/route.js
│       ├── forms/
│       │   ├── auto-fill/route.js
│       │   └── generate-pdf/route.js
│       ├── webhooks/
│       │   └── revenuecat/route.js
│       └── analytics/
│           └── track/route.js
├── lib/
│   ├── supabase.js        → Database client
│   ├── openai.js          → AI service
│   ├── gmailService.js    → Gmail OAuth & scanning
│   ├── classActionService.js
│   ├── unclaimedPropertyService.js
│   └── formService.js     → PDF generation
└── supabase-schema.sql    → Database schema
```

---

## 📊 Navigation Flow

```
App Launch
    ↓
Index (Loading)
    ↓
┌─────────────────┐
│  Has User?      │
└────┬──────┬─────┘
     │      │
    NO     YES
     │      │
     ↓      ↓
Welcome → Onboarding Complete?
     ↓           ↓
     ↓          YES → Main App (Tabs)
     ↓           ↓
Problem         Dashboard
     ↓               ├── Search
Personalization      ├── Wallet
     ↓               └── Profile
Value Demo
     ↓
Quick Scan
     ↓
Results Teaser
     ↓
Paywall
     ↓
Main App (Tabs)
```

---

## 🎨 Design System

### Colors
- Primary: `#10B981` (Green)
- Secondary: `#3B82F6` (Blue)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Gray Scale: `#1F2937` → `#F9FAFB`

### Typography
- Headlines: 28-32px, bold
- Body: 16px, regular
- Labels: 14px, semibold

### Spacing
- Cards: 16px padding
- Screens: 24px horizontal padding
- Gaps: 8-16px between elements

---

## 🔌 External Integrations

### Required Services
1. **Supabase** - Auth & Database
2. **RevenueCat** - Subscriptions (iOS + Android)
3. **Mixpanel** - Analytics
4. **OpenAI** - AI auto-fill
5. **Gmail OAuth** - Email scanning

### Environment Variables

**Mobile (.env)**
```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
EXPO_PUBLIC_MIXPANEL_TOKEN=
```

**Backend (backend/.env.local)**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=
REVENUECAT_API_KEY=
REVENUECAT_WEBHOOK_SECRET=
MIXPANEL_TOKEN=
```

---

## 📦 Dependencies

### Mobile App
- `expo` - App framework
- `expo-router` - File-based navigation
- `@supabase/supabase-js` - Database
- `react-native-purchases` - RevenueCat
- `@react-native-async-storage/async-storage` - Storage
- `expo-secure-store` - Secure storage
- `react-native-reanimated` - Animations

### Backend
- `next` (v16) - Framework
- `@supabase/supabase-js` - Database
- `openai` - AI services
- `googleapis` - Gmail API
- `pdf-lib` - PDF generation
- `cheerio` - Web scraping
- `mixpanel` - Analytics

---

## 🚦 Getting Started

### Mobile App
```bash
cd found-money
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

---

## ✅ Implementation Status

### Phase 1: Research & Design ✅
- [x] Research best onboarding practices 2025
- [x] Design 10-screen flow
- [x] Define color palette & typography

### Phase 2: Backend Development (Next.js) ✅
- [x] Next.js 15 setup
- [x] All API routes created
- [x] All core services implemented
- [x] Supabase schema defined

### Phase 3: Mobile App Development ✅
- [x] Expo Router navigation
- [x] 7 onboarding screens
- [x] 4 main app tabs
- [x] Authentication flow
- [x] All UI components
- [x] State management
- [x] Service integrations

### Phase 4-6: Testing & Deployment (TODO)
- [ ] End-to-end testing
- [ ] Deploy backend to Vercel
- [ ] Build for TestFlight
- [ ] App Store submission

---

## 💡 Key Features

1. **High-Converting Onboarding** - Based on 2025 best practices
2. **Show Value First** - Email scan before paywall
3. **Progressive Disclosure** - Reveal info step-by-step
4. **AI Auto-Fill** - Smart form completion
5. **Real-Time Tracking** - Monitor all claim statuses
6. **Multiple Money Sources** - Class actions, unclaimed property, tax refunds
7. **Subscription Management** - RevenueCat integration

---

## 📱 Screen Count

**Total Screens: 17**
- Onboarding: 7 screens
- Main App: 4 tabs
- Detail: 2 screens (money detail, claim form)
- Auth: 2 screens
- Index: 1 loading screen
- Onboarding Layout: 1

**Total Components: 5**
**Total Services: 4**
**Backend Routes: 13**
**Backend Services: 6**
