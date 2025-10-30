/**
 * Supabase client and database helpers for mobile app
 * @module services/supabase
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helpers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data?.user, session: data?.session, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, session: data?.session, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

export const getMoneyFound = async (userId) => {
  const { data, error } = await supabase
    .from('money_found')
    .select('*')
    .eq('user_id', userId)
    .order('amount_numeric', { ascending: false });
  return { data, error };
};

export const updateMoneyStatus = async (moneyId, status) => {
  const { data, error } = await supabase
    .from('money_found')
    .update({
      status,
      claimed_date: status === 'claimed' ? new Date().toISOString() : null
    })
    .eq('id', moneyId);
  return { data, error };
};

export const saveUserAddresses = async (userId, addresses) => {
  // Delete existing addresses
  await supabase
    .from('addresses')
    .delete()
    .eq('user_id', userId);

  // Insert new addresses
  const addressRecords = addresses.map(addr => ({
    ...addr,
    user_id: userId
  }));

  const { data, error } = await supabase
    .from('addresses')
    .insert(addressRecords);

  return { data, error };
};

export const getClaimForms = async (userId) => {
  const { data, error } = await supabase
    .from('claim_forms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};