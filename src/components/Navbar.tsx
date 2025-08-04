'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User, MessageSquare, Sun, Moon } from 'lucide-react';
import { User as NextAuthUser } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: NextAuthUser = session?.user;
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
  }, []);

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dispatch custom event to notify other components of theme change
    window.dispatchEvent(new CustomEvent('themeChange'));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <nav className={`${isDark
      ? 'bg-slate-800 border-amber-400 text-white'
      : 'bg-white border-blue-500 text-gray-900'
      } border-b-4 shadow-lg transition-colors duration-300`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <MessageSquare className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-blue-500'
              }`} />
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Mystery Messager
            </span>
          </Link>

          {/* User Section */}
          {session ? (
            <div className="flex items-center space-x-4">
              <span className={`hidden md:inline ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Hello, {user.username || user.email?.split('@')[0] || 'User'}
              </span>
              <div className={`md:hidden mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Hello, {user.username || user.email?.split('@')[0] || 'User'}
              </div>

              {/* Theme Toggle Button */}
              <Button
                onClick={toggleTheme}
                className={`${isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                  } border px-3 py-2 transition-colors duration-300 cursor-pointer`}
                variant="outline"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                onClick={() => signOut()}
                className={`${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } font-semibold px-4 py-2 transition-colors duration-300 cursor-pointer`}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Theme Toggle Button */}
              <Button
                onClick={toggleTheme}
                className={`${isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                  } border px-3 py-2 transition-colors duration-300 cursor-pointer`}
                variant="outline"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Link href="/sign-in">
                <Button className={`${isDark
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } font-semibold px-6 py-2 transition-colors duration-300 cursor-pointer`}>
                  Login
                </Button>
              </Link>

              <Link href="/sign-up" className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                } font-medium transition-colors duration-300 cursor-pointer`}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;