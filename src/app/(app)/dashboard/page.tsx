'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link as LinkIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

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

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-50'
      }`}>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 rounded-lg shadow-lg w-full max-w-6xl transition-colors duration-300">
        <div className={`p-6 rounded-lg transition-colors duration-300 ${isDark ? 'bg-slate-700' : 'bg-white'
          }`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              User Dashboard
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Manage your anonymous Message messages
            </p>
          </div>

          {/* Profile URL Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <LinkIcon className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-blue-500'
                }`} />
              <h2 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Your Unique Link
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${isDark
                    ? 'bg-slate-600 border-slate-500 text-gray-300'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
              />
              <Button
                onClick={copyToClipboard}
                className={`px-4 py-3 font-semibold transition-colors duration-300 ${isDark
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className={`text-sm mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Share this link to receive anonymous messages
            </p>
          </div>

          {/* Accept Messages Toggle */}
          <div className="mb-8">
            <div className={`flex items-center space-x-3 p-4 rounded-lg transition-colors duration-300 ${isDark ? 'bg-slate-600/50' : 'bg-gray-50'
              }`}>
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className={`${isDark
                    ? 'data-[state=checked]:bg-amber-400'
                    : 'data-[state=checked]:bg-blue-500'
                  }`}
              />
              <div>
                <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {acceptMessages
                    ? 'You are currently accepting new messages'
                    : 'You are not accepting new messages'
                  }
                </p>
              </div>
            </div>
          </div>

          <Separator className={`${isDark ? 'bg-slate-600' : 'bg-gray-200'
            }`} />

          {/* Messages Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Your Messages
              </h2>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
                className={`transition-colors duration-300 ${isDark
                    ? 'border-slate-500 text-amber-400 hover:bg-slate-600 hover:text-amber-300'
                    : 'border-gray-300 text-blue-500 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCcw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <MessageCard
                    key={message._id.toString()}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <div className={`col-span-full text-center py-12 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <div className={`text-6xl mb-4 ${isDark ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                    📭
                  </div>
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">
                    Share your link to start receiving anonymous Message!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;