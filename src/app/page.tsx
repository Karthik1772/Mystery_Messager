'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Shield, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';

// Sample messages data
const messages = [
  {
    title: "Heartfelt Confession",
    content: "I wanted to tell you that your kindness last week meant everything to me. Thank you for being such an amazing person.",
    received: "2 hours ago"
  },
  {
    title: "Secret Admirer",
    content: "Your smile brightens up the entire room. I hope you know how special you are to everyone around you.",
    received: "5 hours ago"
  },
  {
    title: "Gratitude Note",
    content: "Thank you for always listening without judgment. Your friendship is a treasure I don't take for granted.",
    received: "1 day ago"
  },
  {
    title: "Honest Feedback",
    content: "Your presentation yesterday was incredible. The way you explained complex topics made everything so clear.",
    received: "2 days ago"
  },
  {
    title: "Encouragement",
    content: "I see how hard you're working toward your goals. Keep going - you're closer than you think!",
    received: "3 days ago"
  }
];

export default function Home() {
  const isDark = useTheme(); // Use the custom theme hook
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentMessageIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  // Navigation function for the Get Started button
  const handleGetStarted = () => {
    // Option 1: If using Next.js router
    // router.push('/sign-in');

    // Option 2: If using React Router
    // navigate('/sign-in');

    // Option 3: Simple window.location redirect
    window.location.href = '/sign-in';

    // Option 4: For demonstration - show alert (remove this in production)
    // alert('Redirecting to sign-in page...');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 transition-colors duration-300 relative overflow-hidden">

        {/* Animated background elements */}
        <div className={`absolute inset-0 opacity-10 ${isDark
          ? 'bg-gradient-to-br from-amber-400/10 via-transparent to-orange-400/10'
          : 'bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10'
          }`}></div>

        {/* Floating decorative elements */}
        <div className={`absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-amber-400/20' : 'bg-blue-400/20'
          }`}></div>
        <div className={`absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 rounded-full opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-orange-400/20' : 'bg-purple-400/20'
          }`}></div>

        <div className="relative z-10 w-full max-w-6xl">
          <section className="text-center mb-8 md:mb-12">
            {/* Hero icon */}
            <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-300 ${isDark
              ? 'bg-amber-400/20 text-amber-400'
              : 'bg-blue-500/20 text-blue-500'
              }`}>
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 transition-colors duration-300 ${isDark
              ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
              : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
              Dive into the World of Anonymous Messages
            </h1>

            <p className={`mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg px-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Mystery Messager - Where your identity remains a secret.
            </p>

            {/* Visual separator */}
            <div className={`h-px mx-auto w-24 sm:w-32 mt-4 sm:mt-6 mb-6 sm:mb-8 transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
              : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'
              }`}></div>

            {/* Feature highlights */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
              <div className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-300 ${isDark
                ? 'bg-slate-800/50 border-amber-400/30 text-amber-400'
                : 'bg-white/50 border-blue-300/50 text-blue-600'
                }`}>
                <Shield className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">100% Anonymous</span>
              </div>
              <div className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-300 ${isDark
                ? 'bg-slate-800/50 border-amber-400/30 text-amber-400'
                : 'bg-white/50 border-blue-300/50 text-blue-600'
                }`}>
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Secure & Private</span>
              </div>
            </div>
          </section>

          {/* Custom Carousel for Messages */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl relative">
              {/* Message Cards */}
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentMessageIndex * 100}%)` }}
                >
                  {messages.map((message, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4">
                      <Card className={`border-2 transition-colors duration-300 h-full ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-gray-200'
                        }`}>
                        <CardHeader className="pb-2 sm:pb-3">
                          <CardTitle className={`text-sm sm:text-base md:text-lg transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            {message.title}
                          </CardTitle>
                          <div className={`h-px transition-colors duration-300 ${isDark
                            ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'
                            : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
                            }`}></div>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
                          <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-full transition-colors duration-300 ${isDark
                            ? 'bg-amber-400/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-500'
                            }`}>
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className={`text-xs sm:text-sm md:text-base transition-colors duration-300 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              {message.content}
                            </p>
                            <div className="flex items-center mt-2 sm:mt-3">
                              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 transition-colors duration-300 ${isDark ? 'bg-amber-400' : 'bg-blue-500'
                                }`}></div>
                              <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                {message.received}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevMessage}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 sm:-translate-x-4 p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDark
                  ? 'bg-slate-800/80 text-amber-400 border border-amber-400/30 hover:bg-slate-700'
                  : 'bg-white/80 text-blue-500 border border-blue-300/50 hover:bg-gray-50'
                  }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={nextMessage}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 sm:translate-x-4 p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDark
                  ? 'bg-slate-800/80 text-amber-400 border border-amber-400/30 hover:bg-slate-700'
                  : 'bg-white/80 text-blue-500 border border-blue-300/50 hover:bg-gray-50'
                  }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dots indicator */}
              <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                {messages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMessageIndex(index)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentMessageIndex
                      ? isDark ? 'bg-amber-400' : 'bg-blue-500'
                      : isDark ? 'bg-slate-600' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center px-4">
            <Button
              onClick={handleGetStarted}
              className={`transition-all duration-300 hover:scale-105 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg ${isDark
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              Get Started Today
            </Button>
            <p className={`mt-3 sm:mt-4 text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Join thousands of users sharing honest messages
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center p-3 sm:p-4 md:p-6 transition-colors duration-300 border-t-2 ${isDark
        ? 'bg-slate-800 text-gray-300 border-amber-400'
        : 'bg-gray-100 text-gray-600 border-blue-500'
        }`}>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-amber-400' : 'text-blue-500'
              }`} />
            <span className="font-semibold text-sm sm:text-base">Mystery Messager</span>
          </div>
          <span className="text-xs sm:text-sm">
            © {new Date().getFullYear()} Mystery Messager. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}