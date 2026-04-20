import { useState } from 'react';
import { isValidEmail } from '../utils/validators';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInError {
  field?: 'email' | 'password' | 'general';
  message: string;
}

interface UseSignInReturn {
  signIn: (
    data: SignInFormData,
  ) => Promise<{ success: boolean; error?: SignInError; user?: { id: string; email: string } }>;
  loading: boolean;
  error: SignInError | null;
  clearError: () => void;
}

export const useSignIn = (): UseSignInReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignInError | null>(null);

  const signIn = async (
    data: SignInFormData,
  ): Promise<{ success: boolean; error?: SignInError; user?: { id: string; email: string } }> => {
    setLoading(true);
    setError(null);

    if (!data.email || !isValidEmail(data.email)) {
      const emailError: SignInError = {
        field: 'email',
        message: 'Please enter a valid email address',
      };
      setError(emailError);
      setLoading(false);
      return { success: false, error: emailError };
    }

    if (!data.password || data.password.trim().length === 0) {
      const passwordError: SignInError = {
        field: 'password',
        message: 'Password is required',
      };
      setError(passwordError);
      setLoading(false);
      return { success: false, error: passwordError };
    }

    setLoading(false);
    return {
      success: true,
      user: {
        id: 'local-user',
        email: data.email.trim().toLowerCase(),
      },
    };
  };

  return {
    signIn,
    loading,
    error,
    clearError: () => setError(null),
  };
};
