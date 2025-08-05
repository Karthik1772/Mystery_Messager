'use client';

import React, { useState } from 'react';
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
import { Loader2, Shield, CheckCircle, MessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme'; 

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isDark = useTheme(); // Use the custom hook

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
    <div className={`flex justify-center items-center min-h-screen px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark
      ? 'bg-slate-800'
      : 'bg-gray-100'
      }`}>
      <div className={`relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 rounded-lg shadow-xl transition-colors duration-300 overflow-hidden ${isDark
        ? 'bg-slate-700 shadow-amber-400/10'
        : 'bg-white shadow-blue-500/10'
        }`}>

        {/* Decorative background gradient */}
        <div className={`absolute inset-0 opacity-10 pointer-events-none -z-10 ${isDark
          ? 'bg-gradient-to-br from-amber-400/20 via-transparent to-orange-400/20'
          : 'bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20'
          }`}></div>

        <div className="relative z-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
              <div className={`p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${isDark ? 'bg-amber-400/20' : 'bg-blue-500/20'
                }`}>
                <MessageSquare className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-amber-400' : 'text-blue-500'
                  }`} />
              </div>
              <span className={`text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Mystery Messager
              </span>
            </div>

            {/* Main Icon */}
            <div className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'bg-amber-400/20 text-amber-400'
              : 'bg-blue-500/20 text-blue-500'
              }`}>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
              : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
              Verify Your Account
            </h1>

            <p className={`mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Enter the verification code sent to your email
            </p>

            {/* Username display */}
            {params.username && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 transition-colors duration-300 ${isDark
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                }`}>
                Verifying: @{params.username}
              </div>
            )}

            {/* Visual separator */}
            <div className={`h-px mx-auto w-16 sm:w-24 mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
              : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'
              }`}></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      Verification Code
                    </FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        className={`h-12 sm:h-14 text-center text-base sm:text-lg md:text-xl font-mono tracking-widest transition-colors duration-300 border-2 focus:ring-2 ${isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                          }`}
                        placeholder="••••••"
                        maxLength={6}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                      />
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${field.value && field.value.length === 6 ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-300`}>
                        <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-amber-400' : 'text-blue-500'
                          }`} />
                      </div>
                    </div>
                    <FormMessage className={`text-xs sm:text-sm ${isDark ? 'text-orange-400' : 'text-red-600'}`} />
                  </FormItem>
                )}
              />

              <div className="pt-2 sm:pt-4">
                {isLoading ? (
                  <Button
                    disabled
                    className={`w-full h-10 sm:h-12 transition-all duration-300 font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg cursor-not-allowed ${isDark
                      ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                      : 'bg-gray-400 hover:bg-gray-300 text-white'
                      }`}
                  >
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Verifying...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-full h-10 sm:h-12 transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] active:scale-[0.98] font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg ${isDark
                      ? 'bg-amber-400 hover:bg-amber-500 focus:bg-amber-500 active:bg-amber-600 text-slate-800 focus:ring-2 focus:ring-amber-400/50'
                      : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 text-white focus:ring-2 focus:ring-blue-400/50'
                      }`}
                  >
                    Verify Account
                  </Button>
                )}
              </div>
            </form>
          </Form>

          {/* Additional info */}
          <div className="text-center mt-4 sm:mt-6">
            <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Didn&#39;t receive the code? Check your spam folder or{' '}
              <button
                className={`underline hover:no-underline transition-colors duration-300 font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
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

          {/* Security note */}
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border transition-colors duration-300 ${isDark
            ? 'bg-slate-800/50 border-slate-600/50 text-gray-300'
            : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
            <div className="flex items-start space-x-2">
              <Shield className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-blue-500'
                }`} />
              <p className="text-xs sm:text-sm">
                This verification step helps keep your account secure. The code expires in 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}