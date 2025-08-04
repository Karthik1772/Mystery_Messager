'use client';

import React, { useState, useEffect } from 'react';
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
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${isDark
        ? 'bg-slate-900'
        : 'bg-gray-100'
      }`}>
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-xl transition-colors duration-300 relative overflow-hidden ${isDark
          ? 'bg-slate-800 shadow-amber-400/10'
          : 'bg-white shadow-blue-500/10'
        }`}>

        {/* Decorative background gradient */}
        <div className={`absolute inset-0 opacity-10 ${isDark
            ? 'bg-gradient-to-br from-amber-400/20 via-transparent to-orange-400/20'
            : 'bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20'
          }`}></div>

        <div className="relative">
          <div className="text-center">
            {/* Icon */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${isDark
                ? 'bg-amber-400/20 text-amber-400'
                : 'bg-blue-500/20 text-blue-500'
              }`}>
              <Shield className="w-8 h-8" />
            </div>

            <h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 transition-colors duration-300 ${isDark
                ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
                : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
              Verify Your Account
            </h1>

            <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Enter the verification code sent to your email
            </p>

            {/* Visual separator */}
            <div className={`h-px mx-auto w-24 mb-6 transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
                : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'
              }`}></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      Verification Code
                    </FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        className={`text-center text-lg font-mono tracking-widest transition-colors duration-300 border-2 focus:ring-2 ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                          }`}
                        placeholder="••••••"
                        maxLength={6}
                      />
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${field.value && field.value.length === 6 ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-300`}>
                        <CheckCircle className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-blue-500'
                          }`} />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-4">
                {isLoading ? (
                  <Button
                    disabled
                    className={`w-full transition-all duration-300 font-semibold px-6 py-3 text-lg ${isDark
                        ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                        : 'bg-gray-400 hover:bg-gray-300 text-white'
                      }`}
                  >
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-full transition-all duration-300 hover:scale-[1.02] font-semibold px-6 py-3 text-lg ${isDark
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    Verify Account
                  </Button>
                )}
              </div>
            </form>
          </Form>

          {/* Additional info */}
          <div className="text-center mt-6">
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Didn't receive the code? Check your spam folder or{' '}
              <button
                className={`underline hover:no-underline transition-colors duration-300 ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                  }`}
                onClick={() => {
                  toast({
                    title: 'Code Resent',
                    description: 'A new verification code has been sent to your email.',
                  });
                }}
              >
                resend it
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}