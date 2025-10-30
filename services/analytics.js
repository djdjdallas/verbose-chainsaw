/**
 * Analytics service for tracking user events
 * @module services/analytics
 */

// Will use Mixpanel when configured
// import { Mixpanel } from 'mixpanel-react-native';

// const mixpanel = new Mixpanel(process.env.EXPO_PUBLIC_MIXPANEL_TOKEN || 'placeholder');

export const initAnalytics = async () => {
  // await mixpanel.init();
  console.log('Analytics initialized');
};

export const identifyUser = (userId, properties = {}) => {
  // mixpanel.identify(userId);
  // mixpanel.getPeople().set(properties);
  console.log('User identified:', userId);
};

export const trackEvent = (eventName, properties = {}) => {
  // mixpanel.track(eventName, properties);
  console.log('Event tracked:', eventName, properties);
};

export const trackScreen = (screenName) => {
  trackEvent('Screen Viewed', { screen: screenName });
};

// Pre-defined events
export const AnalyticsEvents = {
  // Onboarding
  ONBOARDING_STARTED: 'Onboarding Started',
  ONBOARDING_SCREEN_VIEWED: 'Onboarding Screen Viewed',
  ONBOARDING_COMPLETED: 'Onboarding Completed',

  // Paywall
  PAYWALL_VIEWED: 'Paywall Viewed',
  TRIAL_STARTED: 'Free Trial Started',
  SUBSCRIPTION_PURCHASED: 'Subscription Purchased',

  // Features
  GMAIL_CONNECTED: 'Gmail Connected',
  GMAIL_SCANNED: 'Gmail Scanned',
  MONEY_FOUND: 'Money Found',
  CLAIM_STARTED: 'Claim Started',
  CLAIM_COMPLETED: 'Claim Completed',
  PDF_GENERATED: 'PDF Generated',

  // Engagement
  APP_OPENED: 'App Opened',
  SEARCH_PERFORMED: 'Search Performed',
  FILTER_APPLIED: 'Filter Applied',
};