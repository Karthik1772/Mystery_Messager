'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, MessageSquare, Sparkles } from 'lucide-react';
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
import { useTheme } from '@/hooks/useTheme'; // Import the custom hook

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString.split(specialChar);
};

const initialMessageString = { message: "What's your favorite movie?||Do you have any pets?||What's your dream job?" };

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const isDark = useTheme(); // Use the custom hook

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: JSON.stringify(initialMessageString),
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-slate-800'
      : 'bg-gray-50'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg transition-colors duration-300 ${isDark
          ? 'bg-slate-700 text-white'
          : 'bg-white text-gray-900'
          }`}>

          <div className="relative">
            {/* Decorative background gradient */}
            <div className={`absolute inset-0 rounded-lg opacity-20 ${isDark
              ? 'bg-gradient-to-br from-amber-400/20 via-transparent to-orange-400/20'
              : 'bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20'
              }`}></div>

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <MessageSquare className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDark
                  ? 'text-amber-400'
                  : 'text-blue-500'
                  }`} />
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 transition-colors duration-300 ${isDark
                  ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
                  : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  }`}>
                  Send Anonymous Message
                </h1>
                <p className={`text-sm sm:text-base transition-colors duration-300 ${isDark
                  ? 'text-gray-300'
                  : 'text-gray-600'
                  }`}>
                  Send a message to <span className="font-semibold">@{username}</span>
                </p>
              </div>

              {/* Message Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                          Your Anonymous Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className={`resize-none min-h-[120px] sm:min-h-[140px] text-sm sm:text-base transition-colors duration-300 border-2 focus:ring-2 ${isDark
                              ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400/20'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20'
                              }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className={`text-sm transition-colors duration-300 ${isDark ? 'text-orange-400' : 'text-red-600'}`} />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    {isLoading ? (
                      <Button
                        disabled
                        className={`w-full sm:w-auto transition-all duration-300 font-semibold px-6 py-3 ${isDark
                          ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                          : 'bg-gray-400 hover:bg-gray-300 text-white'
                          }`}
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading || !messageContent}
                        className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 font-semibold px-6 py-3 text-base ${isDark
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                      >
                        Send Message
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              {/* Suggested Messages Section */}
              <div className="space-y-4 sm:space-y-6 my-6 sm:my-8">
                <div className="space-y-2">
                  <Button
                    onClick={fetchSuggestedMessages}
                    className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 font-medium px-4 py-3 border ${isDark
                      ? 'bg-slate-600 hover:bg-slate-500 text-amber-400 border-amber-400/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                      }`}
                    disabled={isSuggestLoading}
                    variant="outline"
                  >
                    {isSuggestLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isSuggestLoading ? 'Generating...' : 'Get Message Ideas'}
                  </Button>
                  <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Click on any suggested message below to use it.
                  </p>
                </div>

                <Card className={`transition-colors duration-300 border-2 ${isDark
                  ? 'bg-slate-600 border-slate-500'
                  : 'bg-gray-50 border-gray-200'
                  }`}>
                  <CardHeader className="pb-3">
                    <h3 className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      Suggested Messages
                    </h3>
                    <div className={`h-px transition-colors duration-300 ${isDark
                      ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
                      }`}></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {error ? (
                      <div className={`text-center py-6 transition-colors duration-300 ${isDark ? 'text-orange-400' : 'text-red-500'}`}>
                        <p className="text-sm">{error.message}</p>
                      </div>
                    ) : (
                      <>
                        {parseStringMessages(completion ? JSON.parse(completion).message : '').length === 0 ? (
                          <div className={`text-center py-8 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Click &quot;Get Message Ideas&quot; to see suggestions</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {parseStringMessages(completion ? JSON.parse(completion).message : '').map((message, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className={`text-left h-auto p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] border font-normal text-sm sm:text-base whitespace-normal ${isDark
                                  ? 'bg-slate-700 border-amber-400/30 text-amber-100 hover:bg-slate-600 hover:border-amber-400/50'
                                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                                  }`}
                                onClick={() => handleMessageClick(message)}
                              >
                                {message}
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Separator className={`my-6 sm:my-8 transition-colors duration-300 ${isDark ? 'bg-slate-600' : 'bg-gray-300'
                }`} />

              {/* Call to Action */}
              <div className="text-center">
                <div className={`mb-4 text-base sm:text-lg transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Want your own anonymous message board?
                </div>
                <Link href={'/sign-up'}>
                  <Button className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 font-semibold px-6 py-3 text-base ${isDark
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
      </div>
    </div>
  );
}