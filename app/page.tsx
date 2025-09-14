'use client';

import React, { useState, useEffect } from 'react';
import { User, Package, Property } from '@/types';
import { getPackages, getProperties } from '@/services/api';
import PackageExplorer from '@/components/guest/PackageExplorer';
import LoginSignup from '@/components/auth/LoginSignup';
import HostDashboard from '@/components/host/HostDashboard';
import BookingFlow from '@/components/booking/BookingFlow';
import AvailabilityCalendar from '@/components/calendar/AvailabilityCalendar';
import { User as UserIcon, Search, MapPin, Star, X, Calendar, Users, Shield } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'host-dashboard' | 'booking' | 'properties'>('home');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackagesForProperty, setShowPackagesForProperty] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [calendarDateRange, setCalendarDateRange] = useState<string>('');
  const [passengers, setPassengers] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

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
    console.log('🎉 handleLogin called in main page');
    console.log('👤 Logged in user:', loggedInUser);
    console.log('📦 Selected package at login:', selectedPackage);
    console.log('🔄 Current view before login:', currentView);
    
    setUser(loggedInUser);
    localStorage.setItem('bulkstay_user', JSON.stringify(loggedInUser));
    console.log('💾 User saved to localStorage');
    
    if (loggedInUser.role === 'host') {
      console.log('🏠 User is host, redirecting to dashboard');
      setCurrentView('host-dashboard');
    } else {
      // If there was a selected package, go to booking flow
      if (selectedPackage && loggedInUser.role === 'guest') {
        console.log('📦 Redirecting to booking flow after login with package:', selectedPackage.name);
        setCurrentView('booking');
      } else {
        console.log('🏠 No selected package, going to home');
        setCurrentView('home');
      }
    }
    console.log('🔄 Current view after login:', currentView);
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

  

  const handleBookingComplete = () => {
    setCurrentView('home');
    setSelectedPackage(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPackage(null);
    setSelectedProperty(null);
    setShowPackagesForProperty(false);
  };

  const handleCalendarDateSelect = (dates: string[]) => {
    setSelectedDates(dates);
    if (dates.length > 0) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[dates.length - 1]);
      const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setCalendarDateRange(dates.length === 1 ? startStr : `${startStr} — ${endStr}`);
    } else {
      setCalendarDateRange('');
    }
  };

  const handleCalendarConfirm = () => {
    setShowCalendar(false);
    // You can add additional logic here if needed
  };

  const handleCalendarCancel = () => {
    setShowCalendar(false);
    setSelectedDates([]);
    setCalendarDateRange('');
  };

  const handlePassengerDropdownToggle = () => {
    setShowPassengerDropdown(!showPassengerDropdown);
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'rooms', increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : prev[type] - 1
    }));
  };

  // Close passenger dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPassengerDropdown && !target.closest('.passenger-dropdown')) {
        setShowPassengerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPassengerDropdown]);



  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPackagesForProperty(true);
    // Scroll to packages section
    setTimeout(() => {
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToProperties = () => {
    setSelectedProperty(null);
    setShowPackagesForProperty(false);
    setSelectedPackage(null);
  };

  // Clean Navigation header
  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      <div className="px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 group">
          {/* Logo Section */}
          <div 
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900">
              BulkStay
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-slate-600">
            <button 
              onClick={handleBackToHome}
              className="relative hover:text-slate-900 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }} 
              className="relative hover:text-slate-900 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all duration-300"
            >
              How it works
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('search');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }} 
              className="relative hover:text-slate-900 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all duration-300"
            >
              Explore
            </button>
            <button className="relative hover:text-slate-900 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all" onClick={() => setCurrentView(user?.role === 'host' ? 'host-dashboard' : 'login')}>
              For Hosts
            </button>
          </nav>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {user.email.split('@')[0]}
                  </span>
                </div>

                {/* Dashboard Button for Hosts */}
                {user.role === 'host' && currentView !== 'host-dashboard' && (
                  <button
                    onClick={() => setCurrentView('host-dashboard')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <HostDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  if (currentView === 'booking' && user?.role === 'guest' && selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {renderHeader()}
        <BookingFlow
          selectedPackageId={selectedPackage.id}
          selectedProperty={selectedProperty}
          onComplete={handleBookingComplete}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  if (currentView === 'properties') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {renderHeader()}
        <MainHero 
          onExploreClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
          searchTerm={globalSearchTerm}
          onSearchChange={setGlobalSearchTerm}
          onCalendarOpen={() => setShowCalendar(true)}
          calendarDateRange={calendarDateRange}
          passengers={passengers}
          showPassengerDropdown={showPassengerDropdown}
          onPassengerDropdownToggle={handlePassengerDropdownToggle}
          onPassengerChange={handlePassengerChange}
        />
        <PropertySearchAndCatalog
          onSelectProperty={handleSelectProperty}
          selectedProperty={selectedProperty}
          onBackToProperties={handleBackToProperties}
          globalSearchTerm={globalSearchTerm}
        />
        <SiteFooter />
      </div>
    );
  }

  // Default home view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="floating-shapes"></div>
      {renderHeader()}
      {/* Hero can remain full-width */}
      <MainHero 
        onExploreClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
        searchTerm={globalSearchTerm}
        onSearchChange={setGlobalSearchTerm}
        onCalendarOpen={() => setShowCalendar(true)}
        calendarDateRange={calendarDateRange}
        passengers={passengers}
        showPassengerDropdown={showPassengerDropdown}
        onPassengerDropdownToggle={handlePassengerDropdownToggle}
        onPassengerChange={handlePassengerChange}
      />

      {/* Wrap your main page content in a single container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12">
        <HowItWorksSection />

        <PropertySearchAndCatalog 
        onSelectProperty={handleSelectProperty} 
        selectedProperty={selectedProperty}
        onBackToProperties={handleBackToProperties}
          globalSearchTerm={globalSearchTerm}
      />
      
      {/* Packages Section - Only show when property is selected */}
      {showPackagesForProperty && selectedProperty && (
          <div id="packages" className="scroll-mt-24">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-700 font-medium">Loading packages for {selectedProperty.name}...</p>
              </div>
            </div>
          ) : (
            <PackageExplorer 
              packages={packages}
              onReserve={handleReservePackage}
              selectedProperty={selectedProperty}
              onBackToProperties={handleBackToProperties}
            />
          )}
        </div>
      )}
      </main>

      {/* Footer can also remain full-width, as it has its own internal container */}
      <SiteFooter />

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Select Your Travel Dates</h2>
                  <p className="text-gray-600 mt-1">Choose your preferred dates for your stay</p>
                </div>
                <button
                  onClick={handleCalendarCancel}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close calendar"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <AvailabilityCalendar
                maxNights={15}
                onDateSelect={handleCalendarDateSelect}
                onConfirm={handleCalendarConfirm}
                onCancel={handleCalendarCancel}
                selectedDates={selectedDates}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modern Hero
const MainHero: React.FC<{ 
  onExploreClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCalendarOpen: () => void;
  calendarDateRange: string;
  passengers: { adults: number; children: number; rooms: number };
  showPassengerDropdown: boolean;
  onPassengerDropdownToggle: () => void;
  onPassengerChange: (type: 'adults' | 'children' | 'rooms', increment: boolean) => void;
}> = ({ onExploreClick, searchTerm, onSearchChange, onCalendarOpen, calendarDateRange, passengers, showPassengerDropdown, onPassengerDropdownToggle, onPassengerChange }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&auto=format"
          alt="Luxury hotel background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="relative z-10 px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            Find deals for any season
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-blue-50 font-medium drop-shadow-md">
            From cozy country homes to funky city apartments
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-500 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Check-in — Check-out"
                    value={calendarDateRange}
                    className="w-full lg:w-48 h-11 pl-9 pr-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-500 text-sm focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                    onClick={onCalendarOpen}
                    readOnly
                  />
                </div>
                
                <div className="relative passenger-dropdown">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={`${passengers.adults} adult${passengers.adults !== 1 ? 's' : ''} · ${passengers.children} child${passengers.children !== 1 ? 'ren' : ''} · ${passengers.rooms} room${passengers.rooms !== 1 ? 's' : ''}`}
                    className="w-full lg:w-52 h-11 pl-9 pr-3 border border-gray-200 rounded text-gray-900 placeholder:text-gray-500 text-sm focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                    onClick={onPassengerDropdownToggle}
                    readOnly
                  />
                  {showPassengerDropdown && (
                    <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-sm">Adults</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onPassengerChange('adults', false)}
                              disabled={passengers.adults <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 text-sm">{passengers.adults}</span>
                            <button
                              type="button"
                              onClick={() => onPassengerChange('adults', true)}
                              disabled={passengers.adults >= 8}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-sm">Children</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onPassengerChange('children', false)}
                              disabled={passengers.children <= 0}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 text-sm">{passengers.children}</span>
                            <button
                              type="button"
                              onClick={() => onPassengerChange('children', true)}
                              disabled={passengers.children >= 6}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium text-sm">Rooms</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onPassengerChange('rooms', false)}
                              disabled={passengers.rooms <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 text-sm">{passengers.rooms}</span>
                            <button
                              type="button"
                              onClick={() => onPassengerChange('rooms', true)}
                              disabled={passengers.rooms >= 4}
                              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button onClick={onExploreClick} className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors flex-shrink-0 text-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-white text-base font-medium">
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span>No booking fees</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span>Save up to 30%</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span>12–24 months validity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Search + Catalog
const PropertySearchAndCatalog: React.FC<{
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property | null;
  onBackToProperties: () => void;
  globalSearchTerm: string;
}> = ({ onSelectProperty, selectedProperty, onBackToProperties, globalSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm);
  const [selectedLocation] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  // Sync local search term with global search term
  useEffect(() => {
    setSearchTerm(globalSearchTerm);
  }, [globalSearchTerm]);

  const loadProperties = async () => {
    try {
      const allProperties = await getProperties();
      const enabledProperties = allProperties.filter(p => p.isBulkBookingEnabled);
      setProperties(enabledProperties);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || property.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <section id="search" className="py-16 bg-white scroll-mt-20">
        <div className="mb-6">
          {selectedProperty ? (
            <div>
              <button
                onClick={onBackToProperties}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                ← Back to all hotels
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h2>
              <p className="text-gray-600">
                Selected property • Now choose your bulk booking package below
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">India: {filteredProperties.length} properties found</h2>
                <p className="text-gray-700 text-lg">Search results updated</p>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option>Our top picks</option>
                  <option>Price (lowest first)</option>
                  <option>Property rating (high to low)</option>
                  <option>Distance from city center</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {!selectedProperty && (
          <div className="mb-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="px-3 py-1.5 border border-gray-300 rounded-full text-xs hover:border-gray-400 transition-colors bg-white">
                Price
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-full text-xs hover:border-gray-400 transition-colors bg-white">
                Property type
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-full text-xs hover:border-gray-400 transition-colors bg-white">
                Review score
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-full text-xs hover:border-gray-400 transition-colors bg-white">
                Facilities
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-full text-xs hover:border-gray-400 transition-colors bg-white">
                Neighborhood
                </button>
            </div>
          </div>
        )}

        {!selectedProperty && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-700 font-medium">Loading hotels...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <p className="text-gray-600 text-base">
                    {filteredProperties.length} hotels available
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-8">
                  {(() => {
                    const base = filteredProperties;
                    const need = Math.max(0, 12 - base.length);
                    const extra = need > 0 && base.length > 0
                      ? Array.from({ length: need }, (_, i) => base[i % base.length])
                      : [];
                    const display = base.concat(extra);
                    return display.map((property, idx) => (
                    <div
                      key={`${property.id}-${idx}`}
                      className="col-span-12 sm:col-span-6 lg:col-span-4 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 flex flex-col h-full"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={property.imageUrl}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Available
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 5}</span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                          {property.name}
                        </h4>
                        <p className="text-slate-600 mb-4 flex items-center gap-2 text-base">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </p>

                        <div className="mb-5">
                          <span className="text-2xl font-bold text-slate-900">
                            ₹{property.baseRate.toLocaleString()}
                          </span>
                          <span className="text-slate-500 text-base ml-1">/night</span>
                        </div>

                        <button
                          onClick={() => onSelectProperty(property)}
                          className="mt-auto w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200"
                        >
                          View Packages
                        </button>
                      </div>
                    </div>
                    ));
                  })()}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Hotels Found</h3>
                    <p className="text-slate-600">Try adjusting your search or location filters</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedProperty && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.{Math.floor(Math.random() * 5) + 5}</span>
                    </div>
                    <div>
                      ₹{selectedProperty.baseRate.toLocaleString()}/night
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Choose Your Package</h4>
                  <p className="text-slate-600 text-base">
                    Select from flexible bulk booking packages below to save up to 30% on your stays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  );
};

// How It Works Section
const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50 -mx-6 lg:-mx-12 px-6 lg:px-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Quick and easy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  1. Search
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Compare prices on hotels from hundreds of travel sites
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2. Compare
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Find the perfect hotel with smart filters and reviews
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  3. Book
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Book with confidence and get 24/7 support
                </p>
      </div>
            </div>
          </div>
        </div>
    </section>
  );
};

// Footer
const SiteFooter: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-slate-900">About</a></li>
              <li><a href="#" className="hover:text-slate-900">Careers</a></li>
              <li><a href="#" className="hover:text-slate-900">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#search" className="hover:text-slate-900">Hotels</a></li>
              <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
              <li><a href="#" className="hover:text-slate-900">Packages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Support</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Help Center</a></li>
              <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              <li><a href="#" className="hover:text-slate-900">Cancellations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-900">Terms</a></li>
              <li><a href="#" className="hover:text-slate-900">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600">
          <div className="text-sm">© {new Date().getFullYear()} BulkStay. All rights reserved.</div>
          <div className="text-sm">
            Prices in INR. Dates must be confirmed at least 15 days in advance.
          </div>
        </div>
      </div>
    </footer>
  );
};
