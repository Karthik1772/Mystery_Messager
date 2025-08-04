'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
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

  return (
    <>
      {/* Main content */}
      <main className={`flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 transition-colors duration-300 relative overflow-hidden ${isDark
          ? 'bg-slate-900 text-white'
          : 'bg-gray-50 text-gray-900'
        }`}>

        {/* Animated background elements */}
        <div className={`absolute inset-0 opacity-10 ${isDark
            ? 'bg-gradient-to-br from-amber-400/10 via-transparent to-orange-400/10'
            : 'bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10'
          }`}></div>

        {/* Floating decorative elements */}
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-amber-400/20' : 'bg-blue-400/20'
          }`}></div>
        <div className={`absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-orange-400/20' : 'bg-purple-400/20'
          }`}></div>

        <div className="relative z-10">
          <section className="text-center mb-8 md:mb-12">
            {/* Hero icon */}
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${isDark
                ? 'bg-amber-400/20 text-amber-400'
                : 'bg-blue-500/20 text-blue-500'
              }`}>
              <MessageSquare className="w-10 h-10" />
            </div>

            <h1 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${isDark
                ? 'text-white bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
                : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
              Dive into the World of Anonymous Feedback
            </h1>

            <p className={`mt-3 md:mt-4 text-base md:text-lg transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              True Feedback - Where your identity remains a secret.
            </p>

            {/* Visual separator */}
            <div className={`h-px mx-auto w-32 mt-6 mb-8 transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
                : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'
              }`}></div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-300 ${isDark
                  ? 'bg-slate-800/50 border-amber-400/30 text-amber-400'
                  : 'bg-white/50 border-blue-300/50 text-blue-600'
                }`}>
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">100% Anonymous</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-300 ${isDark
                  ? 'bg-slate-800/50 border-amber-400/30 text-amber-400'
                  : 'bg-white/50 border-blue-300/50 text-blue-600'
                }`}>
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
            </div>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className={`border-2 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${isDark
                      ? 'bg-slate-800 border-slate-700 hover:border-amber-400/50 hover:shadow-amber-400/10'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
                    }`}>
                    <CardHeader className="pb-3">
                      <CardTitle className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        {message.title}
                      </CardTitle>
                      <div className={`h-px transition-colors duration-300 ${isDark
                          ? 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-blue-300/50 to-transparent'
                        }`}></div>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <div className={`flex-shrink-0 p-2 rounded-full transition-colors duration-300 ${isDark
                          ? 'bg-amber-400/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-500'
                        }`}>
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-grow">
                        <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          {message.content}
                        </p>
                        <div className="flex items-center mt-3">
                          <div className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${isDark ? 'bg-amber-400' : 'bg-blue-500'
                            }`}></div>
                          <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom carousel navigation */}
            <CarouselPrevious className={`transition-colors duration-300 ${isDark
                ? 'bg-slate-700 hover:bg-slate-600 border-amber-400/30 text-amber-400'
                : 'bg-white hover:bg-gray-100 border-blue-300 text-blue-500'
              }`} />
            <CarouselNext className={`transition-colors duration-300 ${isDark
                ? 'bg-slate-700 hover:bg-slate-600 border-amber-400/30 text-amber-400'
                : 'bg-white hover:bg-gray-100 border-blue-300 text-blue-500'
              }`} />
          </Carousel>

          {/* Call to action */}
          <div className="text-center mt-12">
            <Link href="/sign-up">
              <Button className={`transition-all duration-300 hover:scale-105 font-semibold px-8 py-3 text-lg ${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}>
                Get Started Today
              </Button>
            </Link>
            <p className={`mt-4 text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Join thousands of users sharing honest feedback
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center p-4 md:p-6 transition-colors duration-300 border-t-2 ${isDark
          ? 'bg-slate-800 text-gray-300 border-amber-400'
          : 'bg-gray-100 text-gray-600 border-blue-500'
        }`}>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <MessageSquare className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-blue-500'
            }`} />
          <span className="font-semibold">True Feedback</span>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} True Feedback. All rights reserved.
        </p>
      </footer>
    </>
  );
}