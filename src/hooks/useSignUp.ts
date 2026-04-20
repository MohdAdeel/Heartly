import { useState } from 'react';
import { isStrongPassword, isValidEmail, isValidName } from '../utils/validators';

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpError {
  field?: 'fullName' | 'email' | 'password' | 'confirmPassword' | 'general';
  message: string;
}

interface UseSignUpReturn {
  signUp: (data: SignUpFormData) => Promise<{ success: boolean; error?: SignUpError }>;
  loading: boolean;
  error: SignUpError | null;
  clearError: () => void;
}

export const useSignUp = (): UseSignUpReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignUpError | null>(null);

  const signUp = async (
    data: SignUpFormData,
  ): Promise<{ success: boolean; error?: SignUpError }> => {
    setLoading(true);
    setError(null);

    if (!data.fullName || !isValidName(data.fullName)) {
      const nextError: SignUpError = {
        field: 'fullName',
        message: 'Please enter a valid full name',
      };
      setError(nextError);
      setLoading(false);
      return { success: false, error: nextError };
    }

    if (!data.email || !isValidEmail(data.email)) {
      const nextError: SignUpError = {
        field: 'email',
        message: 'Please enter a valid email address',
      };
      setError(nextError);
      setLoading(false);
      return { success: false, error: nextError };
    }

    if (!data.password || !isStrongPassword(data.password)) {
      const nextError: SignUpError = {
        field: 'password',
        message:
          'Password must be at least 8 characters with uppercase, lowercase, and number',
      };
      setError(nextError);
      setLoading(false);
      return { success: false, error: nextError };
    }

    if (data.password !== data.confirmPassword) {
      const nextError: SignUpError = {
        field: 'confirmPassword',
        message: 'Passwords do not match',
      };
      setError(nextError);
      setLoading(false);
      return { success: false, error: nextError };
    }

    setLoading(false);
    return { success: true };
  };

  return {
    signUp,
    loading,
    error,
    clearError: () => setError(null),
  };
};
