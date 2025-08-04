'use client'

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
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

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={`transition-colors duration-300 border-2 hover:shadow-lg ${isDark
        ? 'bg-slate-600 border-slate-500 hover:border-amber-400/50 hover:shadow-amber-400/10'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
      }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className={`text-lg leading-relaxed break-words transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {message.content}
            </CardTitle>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                size="sm"
                className="shrink-0 hover:scale-110 transition-transform duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={`transition-colors duration-300 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'
              }`}>
              <AlertDialogHeader>
                <AlertDialogTitle className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  This action cannot be undone. This will permanently delete
                  this message from your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={`transition-colors duration-300 ${isDark
                    ? 'bg-slate-600 hover:bg-slate-500 text-gray-200 border-slate-500'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete Message
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className={`text-sm flex items-center gap-2 mt-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-blue-500'
            }`}></div>
          <span>
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`h-px transition-colors duration-300 ${isDark ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
          }`}></div>
      </CardContent>
    </Card>
  );
}