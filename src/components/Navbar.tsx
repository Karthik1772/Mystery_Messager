'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User, MessageSquare, Sun, Moon, Menu, X } from 'lucide-react';
import { User as NextAuthUser } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: NextAuthUser = session?.user;
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    return user?.username || user?.email?.split('@')[0] || 'User';
  };

  return (
    <nav className={`${isDark
      ? 'bg-slate-800 border-amber-400 text-white'
      : 'bg-white border-blue-500 text-gray-900'
      } border-b-4 shadow-lg transition-all duration-300 sticky top-0 z-50`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={closeMobileMenu}
          >
            <MessageSquare className={`w-6 h-6 sm:w-7 sm:h-7 ${isDark ? 'text-amber-400' : 'text-blue-500'
              }`} />
            <span className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
              } hidden xs:block`}>
              Mystery Messager
            </span>
            <span className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
              } xs:hidden`}>
              MM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {session ? (
              <>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'
                  } text-sm xl:text-base`}>
                  Hello, <span className="font-medium">{getUserDisplayName()}</span>
                </span>

                {/* Theme Toggle Button */}
                <Button
                  onClick={toggleTheme}
                  className={`${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                    } border w-10 h-10 p-0 transition-colors duration-300`}
                  variant="outline"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={() => signOut()}
                  className={`${isDark
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } font-semibold px-4 py-2 transition-colors duration-300`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Theme Toggle Button */}
                <Button
                  onClick={toggleTheme}
                  className={`${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                    } border w-10 h-10 p-0 transition-colors duration-300`}
                  variant="outline"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <Link href="/sign-in">
                  <Button className={`${isDark
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } font-semibold px-4 py-2 transition-colors duration-300`}>
                    Login
                  </Button>
                </Link>

                <Link href="/sign-up" className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                  } font-medium transition-colors duration-300 px-2 py-1`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <Button
              onClick={toggleTheme}
              className={`${isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-amber-400/30'
                : 'bg-gray-100 hover:bg-gray-200 text-blue-500 border-blue-200'
                } border w-9 h-9 p-0 transition-colors duration-300`}
              variant="outline"
              size="sm"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              onClick={toggleMobileMenu}
              className={`${isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } w-9 h-9 p-0 transition-colors duration-300`}
              variant="outline"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'max-h-screen opacity-100 pb-4'
            : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className={`border-t ${isDark ? 'border-slate-600' : 'border-gray-200'} pt-4 space-y-4`}>
            {session ? (
              <>
                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'
                  } text-sm px-2`}>
                  Hello, <span className="font-medium">{getUserDisplayName()}</span>
                </div>

                <div className="flex flex-col space-y-3 px-2">
                  <Button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className={`${isDark
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } font-semibold w-full justify-center transition-colors duration-300`}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 px-2">
                <Link href="/sign-in" onClick={closeMobileMenu}>
                  <Button className={`${isDark
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } font-semibold w-full justify-center transition-colors duration-300`}>
                    Login
                  </Button>
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMobileMenu}
                  className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-500 hover:text-blue-600'
                    } font-medium transition-colors duration-300 text-center py-2 border rounded-md ${isDark ? 'border-amber-400/30 hover:border-amber-300/50' : 'border-blue-200 hover:border-blue-300'
                    }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;