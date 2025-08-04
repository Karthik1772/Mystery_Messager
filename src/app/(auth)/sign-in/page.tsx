'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
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
import { Sun, Moon, MessageSquare } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  // Load theme preference from localStorage on component mount
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

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);



  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
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
            Welcome Back
          </h1>
          <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                    Email/Username
                  </FormLabel>
                  <Input
                    {...field}
                    className={`transition-colors duration-300 ${isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500'
                      }`}
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
                  <FormLabel className={`transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    {...field}
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
              className={`w-full font-semibold transition-colors duration-300 ${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className={`font-medium transition-colors duration-300 ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                }`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}