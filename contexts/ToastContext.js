/**
 * Toast context for managing toast notifications globally
 * @module contexts/ToastContext
 */

import React, { createContext, useContext, useState } from 'react';
import Toast, { ToastType } from '../components/Toast';

const ToastContext = createContext();

/**
 * Toast provider component
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: ToastType.INFO,
    duration: 3000,
  });

  const showToast = (message, type = ToastType.INFO, duration = 3000) => {
    setToast({
      visible: true,
      message,
      type,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Convenience methods
  const toastSuccess = (message, duration) => showToast(message, ToastType.SUCCESS, duration);
  const toastError = (message, duration) => showToast(message, ToastType.ERROR, duration);
  const toastWarning = (message, duration) => showToast(message, ToastType.WARNING, duration);
  const toastInfo = (message, duration) => showToast(message, ToastType.INFO, duration);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
        toastSuccess,
        toastError,
        toastWarning,
        toastInfo,
      }}
    >
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast context
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
