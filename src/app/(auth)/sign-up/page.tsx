'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  // Load theme preference and listen for changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Default to system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Listen for theme changes from other components
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) {
        setIsDark(currentTheme === 'dark');
      }
    };

    // Listen for storage changes (when localStorage is updated from another component)
    window.addEventListener('storage', handleThemeChange);

    // Listen for custom theme change events
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg transition-colors duration-300 ${isDark ? 'bg-slate-700' : 'bg-white'
        }`}>
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            <MessageSquare className={`w-8 h-8 ${isDark ? 'text-amber-400' : 'text-blue-500'
              }`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              True Feedback
            </span>
          </div>

          <h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Join True Feedback
          </h1>
          <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                    Username
                  </FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    className={`transition-colors duration-300 ${isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                  />
                  {isCheckingUsername && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-amber-400' : 'text-blue-500'
                        }`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Checking username...
                      </span>
                    </div>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                    Email
                  </FormLabel>
                  <Input
                    {...field}
                    name="email"
                    className={`transition-colors duration-300 ${isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                  />
                  <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    {...field}
                    name="password"
                    className={`transition-colors duration-300 ${isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`w-full font-semibold transition-colors duration-300 ${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Already a member?{' '}
            <Link
              href="/sign-in"
              className={`font-medium transition-colors duration-300 ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                }`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}