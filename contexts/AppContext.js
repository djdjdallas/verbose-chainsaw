/**
 * Global app state management using React Context
 * @module contexts/AppContext
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '../services/supabase';
// import { checkSubscriptionStatus } from '../services/subscriptions';

const AppContext = createContext();

const initialState = {
  user: null,
  profile: null,
  moneyFound: [],
  isLoading: true,
  subscription: { isActive: false },
  onboardingComplete: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_MONEY_FOUND':
      return { ...state, moneyFound: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          dispatch({ type: 'SET_USER', payload: session.user });
          await loadUserProfile(session.user.id);
          // await loadSubscriptionStatus();
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        await loadUserProfile(user.id);
        // await loadSubscriptionStatus();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadUserProfile = async (userId) => {
    const { data, error } = await getUserProfile(userId);
    if (data) {
      dispatch({ type: 'SET_PROFILE', payload: data });
    }
  };

  // const loadSubscriptionStatus = async () => {
  //   const status = await checkSubscriptionStatus();
  //   dispatch({ type: 'SET_SUBSCRIPTION', payload: status });
  // };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}