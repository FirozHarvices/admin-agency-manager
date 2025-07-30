import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getErrorMessage = (error: any): string => {
  if (error?.backendError && error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Something went wrong. Please try again.';
};

export const getSpecificErrorMessage = (error: any, context: 'otp' | 'login'): string => {
  const message = getErrorMessage(error);
  
  if (context === 'otp') {
    if (message === 'Agency not found.') {
      return 'Email not found. Please check your email address and try again.';
    }
    if (message.toLowerCase().includes('rate limit')) {
      return 'Too many OTP requests. Please wait a moment before trying again.';
    }
    return message || 'Failed to send OTP. Please try again.';
  }
  
  if (context === 'login') {
    if (message === 'Login failed') {
      return 'Invalid OTP. Please check the code and try again.';
    }
    if (error?.response?.status === 401) {
      return 'Invalid or expired OTP. Please request a new one.';
    }
    return message || 'Login failed. Please try again.';
  }
  
  return message;
};

