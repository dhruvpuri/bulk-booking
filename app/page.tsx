'use client';

import React, { useState, useEffect } from 'react';
import { User, Package } from '@/types';
import { getPackages } from '@/services/api';
import Hero from '@/components/guest/Hero';
import PackageExplorer from '@/components/guest/PackageExplorer';
import LoginSignup from '@/components/auth/LoginSignup';
import HostDashboard from '@/components/host/HostDashboard';
import BookingFlow from '@/components/booking/BookingFlow';
import { Moon, Sun, User as UserIcon } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'host-dashboard' | 'booking'>('home');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadPackages();
    // Check for existing user session
    const savedUser = localStorage.getItem('bulkstay_user');
    console.log('Checking localStorage for user:', savedUser);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Parsed user from localStorage:', parsedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'host') {
          setCurrentView('host-dashboard');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('bulkstay_user');
      }
    } else {
      console.log('No saved user found in localStorage');
    }
    
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('bulkstay_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const loadPackages = async () => {
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    console.log('Login successful:', loggedInUser);
    console.log('Selected package at login:', selectedPackage);
    setUser(loggedInUser);
    localStorage.setItem('bulkstay_user', JSON.stringify(loggedInUser));
    
    if (loggedInUser.role === 'host') {
      setCurrentView('host-dashboard');
    } else {
      // If there was a selected package, go to booking flow
      if (selectedPackage && loggedInUser.role === 'guest') {
        console.log('Redirecting to booking flow after login with package:', selectedPackage.name);
        setCurrentView('booking');
      } else {
        console.log('No selected package, going to home');
        setCurrentView('home');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bulkstay_user');
    setCurrentView('home');
    setSelectedPackage(null);
  };

  const handleReservePackage = (packageId: number) => {
    console.log('=== PACKAGE RESERVATION DEBUG ===');
    console.log('Package ID:', packageId);
    console.log('Current user state:', user);
    console.log('Current view:', currentView);
    
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) {
      console.log('❌ Package not found:', packageId);
      return;
    }
    console.log('✅ Package found:', pkg.name);

    // Double-check user state from localStorage
    const savedUser = localStorage.getItem('bulkstay_user');
    let currentUser = null;
    try {
      currentUser = savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.log('❌ Error parsing saved user:', e);
    }

    console.log('User from localStorage:', currentUser);

    // Use the user from state, but fallback to localStorage if needed
    const activeUser = user || currentUser;
    console.log('Active user (final):', activeUser);

    if (!activeUser) {
      // If user is not logged in, redirect to login
      console.log('🔄 No user found, redirecting to login');
      setSelectedPackage(pkg);
      setCurrentView('login');
    } else if (activeUser.role === 'guest') {
      // If user is logged in as guest, start booking flow
      console.log('🎯 User is guest, starting booking flow');
      // Make sure user state is synced
      if (!user && currentUser) {
        console.log('🔄 Syncing user state');
        setUser(currentUser);
      }
      setSelectedPackage(pkg);
      setCurrentView('booking');
    } else {
      // Host users shouldn't be able to book packages
      console.log('⚠️ User is host, showing alert');
      alert('Hosts cannot book packages. Please log in as a guest.');
    }
    console.log('=== END DEBUG ===');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bulkstay_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bulkstay_theme', 'light');
    }
  };

  const handleBookingComplete = () => {
    setCurrentView('home');
    setSelectedPackage(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPackage(null);
  };

  // Professional Navigation header
  const renderHeader = () => (
    <header className="sticky top-0 z-50 backdrop-blur-3xl bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/20 dark:border-slate-700/20 shadow-lg shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section */}
          <div 
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                BulkStay
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Premium Bulk Booking
              </span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-105"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Moon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {user.email.split('@')[0]}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 capitalize font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dashboard Button for Hosts */}
                {user.role === 'host' && currentView !== 'host-dashboard' && (
                  <button
                    onClick={() => setCurrentView('host-dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Dashboard
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Render different views based on current state
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-500">
        {renderHeader()}
        <LoginSignup 
          onLogin={handleLogin}
          selectedPackage={selectedPackage}
        />
      </div>
    );
  }

  if (currentView === 'host-dashboard' && user?.role === 'host') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-500">
        <HostDashboard user={user} />
      </div>
    );
  }

  if (currentView === 'booking' && user?.role === 'guest' && selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-500">
        {renderHeader()}
        <BookingFlow
          selectedPackageId={selectedPackage.id}
          onComplete={handleBookingComplete}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  // Default home view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-500">
      <div className="floating-shapes"></div>
      {renderHeader()}
      <Hero />


      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Loading amazing packages...</p>
          </div>
        </div>
      ) : (
        <PackageExplorer 
          packages={packages}
          onReserve={handleReservePackage}
        />
      )}
    </div>
  );
}
