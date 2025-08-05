'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { Sun, Moon, MessageSquare, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme'; 

export default function SignInForm() {
  const router = useRouter();
  const isDark = useTheme(); // Use the custom hook instead of local state and effects
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
      <div className={`relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 rounded-lg shadow-lg transition-colors duration-300 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-white'
        }`}>

        {/* Decorative background gradient - NOW CONTAINED WITHIN THE CARD */}
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

            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
              : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
              Welcome Back
            </h1>

            <p className={`mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Sign in to continue your secret conversations
            </p>

            {/* Visual separator */}
            <div className={`h-px mx-auto w-16 sm:w-24 mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
              : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'
              }`}></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      Email/Username
                    </FormLabel>
                    <Input
                      {...field}
                      className={`relative z-30 h-10 sm:h-12 text-sm sm:text-base transition-colors duration-300 border-2 focus:ring-2 ${isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                        }`}
                      placeholder="Enter your email or username"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className={`relative z-30 h-10 sm:h-12 pr-10 sm:pr-12 text-sm sm:text-base transition-colors duration-300 border-2 focus:ring-2 ${isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                          }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 z-40 p-1 rounded-md transition-colors duration-200 hover:bg-opacity-20 ${isDark
                          ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-400'
                          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-500'
                          }`}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2 sm:pt-4">
                {isLoading ? (
                  <Button
                    disabled
                    className={`w-full h-10 sm:h-12 font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg transition-all duration-300 cursor-not-allowed ${isDark
                      ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                      : 'bg-gray-400 hover:bg-gray-300 text-white'
                      }`}
                  >
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Signing In...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-full h-10 sm:h-12 font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] active:scale-[0.98] cursor-pointer ${isDark
                      ? 'bg-amber-400 hover:bg-amber-500 focus:bg-amber-500 active:bg-amber-600 text-slate-800 focus:ring-2 focus:ring-amber-400/50'
                      : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 text-white focus:ring-2 focus:ring-blue-400/50'
                      }`}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="text-center mt-4 sm:mt-6">
            <p className={`text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Not a member yet?{' '}
              <Link
                href="/sign-up"
                className={`font-medium transition-colors duration-300 underline hover:no-underline cursor-pointer ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                  }`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}