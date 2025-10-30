/**
 * RevenueCat service for subscription management
 * @module services/revenuecat
 */

import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
});

/**
 * Initialize RevenueCat SDK
 */
export async function initRevenueCat(userId) {
  try {
    if (!API_KEY || API_KEY.includes('your_')) {
      console.warn('RevenueCat API key not configured');
      return;
    }

    await Purchases.configure({ apiKey: API_KEY });

    if (userId) {
      await Purchases.logIn(userId);
    }

    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('RevenueCat initialization error:', error);
  }
}

/**
 * Get available offerings/packages
 */
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return [];
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(rcPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(rcPackage);
    return {
      success: true,
      customerInfo,
      entitlements: customerInfo.entitlements.active,
    };
  } catch (error) {
    if (error.userCancelled) {
      return { success: false, cancelled: true };
    }
    console.error('Purchase error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      success: true,
      customerInfo,
      entitlements: customerInfo.entitlements.active,
    };
  } catch (error) {
    console.error('Restore purchases error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check current subscription status
 */
export async function getSubscriptionStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlements = customerInfo.entitlements.active;

    const hasPremium = entitlements['premium'] !== undefined;

    return {
      isActive: hasPremium,
      entitlements,
      customerInfo,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false };
  }
}

/**
 * Log out user
 */
export async function logOutUser() {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Error logging out from RevenueCat:', error);
  }
}

/**
 * Get customer info
 */
export async function getCustomerInfo() {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
}
