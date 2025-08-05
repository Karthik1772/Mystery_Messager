'use client'

import React from 'react';
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
import { useTheme } from '@/hooks/useTheme';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const isDark = useTheme(); // Use the custom hook instead of local state and effects

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
    <Card className={`w-full max-w-none transition-colors duration-300 border-2 hover:shadow-lg ${isDark
      ? 'bg-slate-600 border-slate-500 hover:border-amber-400/50 hover:shadow-amber-400/10'
      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
      }`}>
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 order-2 sm:order-1">
            <CardTitle className={`text-base sm:text-lg leading-relaxed break-words hyphens-auto transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {message.content}
            </CardTitle>
          </div>
          <div className="flex justify-end order-1 sm:order-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  size="sm"
                  className="shrink-0 hover:scale-110 transition-transform duration-200 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Delete message</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`mx-4 w-[calc(100vw-2rem)] max-w-lg transition-colors duration-300 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'
                }`}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={`text-lg sm:text-xl transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className={`text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    This action cannot be undone. This will permanently delete
                    this message from your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className={`w-full sm:w-auto transition-colors duration-300 ${isDark
                    ? 'bg-slate-600 hover:bg-slate-500 text-gray-200 border-slate-500'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                    }`}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete Message
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className={`text-xs sm:text-sm flex items-center gap-2 mt-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? 'bg-amber-400' : 'bg-blue-500'
            }`}></div>
          <span className="truncate">
            <span className="hidden sm:inline">
              {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </span>
            <span className="sm:hidden">
              {dayjs(message.createdAt).format('MMM D, YYYY')}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
        <div className={`h-px transition-colors duration-300 ${isDark ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
          }`}></div>
      </CardContent>
    </Card>
  );
}