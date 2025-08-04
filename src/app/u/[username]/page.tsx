'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isDark, setIsDark] = useState(true);

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

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className={`container mx-auto my-8 p-6 rounded-lg max-w-4xl transition-colors duration-300 ${isDark
        ? 'bg-slate-800 text-white'
        : 'bg-white text-gray-900'
      }`}>
      <div className="relative">
        {/* Decorative background gradient */}
        <div className={`absolute inset-0 rounded-lg opacity-20 ${isDark
            ? 'bg-gradient-to-br from-amber-400/20 via-transparent to-orange-400/20'
            : 'bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20'
          }`}></div>

        <div className="relative">
          <h1 className={`text-4xl font-bold mb-6 text-center transition-colors duration-300 ${isDark
              ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
              : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
            Public Profile Link
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className={`resize-none min-h-[120px] transition-colors duration-300 border-2 focus:ring-2 ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                          }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button
                    disabled
                    className={`transition-all duration-300 font-semibold px-6 py-2 ${isDark
                        ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                        : 'bg-gray-400 hover:bg-gray-300 text-white'
                      }`}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className={`transition-all duration-300 hover:scale-105 font-semibold px-6 py-2 ${isDark
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="space-y-4 my-8">
            <div className="space-y-2">
              <Button
                onClick={fetchSuggestedMessages}
                className={`my-4 transition-all duration-300 hover:scale-105 font-semibold px-4 py-2 border ${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                  }`}
                disabled={isSuggestLoading}
                variant="outline"
              >
                {isSuggestLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Messages
              </Button>
              <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Click on any message below to select it.
              </p>
            </div>

            <Card className={`transition-colors duration-300 border-2 ${isDark
                ? 'bg-slate-700 border-slate-600'
                : 'bg-white border-gray-200'
              }`}>
              <CardHeader>
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  Messages
                </h3>
                <div className={`h-px transition-colors duration-300 ${isDark
                    ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'
                    : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
                  }`}></div>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {error ? (
                  <p className="text-red-500">{error.message}</p>
                ) : (
                  parseStringMessages(completion).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`mb-2 transition-all duration-300 hover:scale-[1.02] border font-medium ${isDark
                          ? 'bg-slate-700 border-amber-400/30 text-amber-400 hover:bg-slate-600'
                          : 'bg-gray-100 border-blue-200 text-blue-500 hover:bg-gray-200'
                        }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className={`my-6 transition-colors duration-300 ${isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`} />

          <div className="text-center">
            <div className={`mb-4 text-lg transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Get Your Message Board
            </div>
            <Link href={'/sign-up'}>
              <Button className={`transition-all duration-300 hover:scale-105 font-semibold px-6 py-2 ${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}>
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}