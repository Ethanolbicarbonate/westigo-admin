import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import { loginSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { showSuccess, showError } from '../utils/toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import logo from '../assets/westigo_admin_logo.svg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get global auth state
  const { login, user, isAdmin, loading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/';

  // 1. Auto-redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, from]);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setFormError('');
    try {
      await login(data.email, data.password);
      showSuccess('Welcome back!');
      // Navigation is handled by the useEffect above or here
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login Error:', error);
      const message = error.message || 'Failed to sign in';
      setFormError(message);
      showError(message);
    }
  };

  // 2. Prevent form flash while checking session
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-ios-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ios-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ios-bg p-4">
      <Card className="w-full max-w-md shadow-ios-lg animate-enter bg-white">
        <CardHeader className="items-center space-y-3 pb-2">
          {/* Replaced Icon with Logo */}
          <div className="flex justify-center mb-2">
            <img 
              src={logo} 
              alt="Westigo Admin" 
              className="h-16 w-auto object-contain" 
            />
          </div>
          <div className="text-center">
            {/* Removed redundant Westigo Title */}
            <p className="text-sm text-ios-secondaryLabel mt-2">
              Sign in to manage campus data
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {formError && (
            <div className="mb-4 rounded-ios bg-ios-red/10 p-3 text-sm text-ios-red border border-ios-red/20">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-ios-label">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@westigo.edu"
                autoComplete="email"
                autoFocus
                disabled={isSubmitting}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-ios-label">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  error={errors.password?.message}
                  {...register('password')}
                  className="pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-ios-gray2 hover:text-ios-label focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              isLoading={isSubmitting}
            >
              {!isSubmitting && <LogIn className="mr-2 h-4 w-4" />}
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-ios-tertiaryLabel">
            © {new Date().getFullYear()} West Visayas State University
          </div>
        </CardContent>
      </Card>
    </div>
  );
}