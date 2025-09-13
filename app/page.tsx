'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { User, Package, Property } from '@/types';
import { getPackages, getProperties } from '@/services/api';
import Hero from '@/components/guest/Hero';
import PackageExplorer from '@/components/guest/PackageExplorer';
import PropertyBrowser from '@/components/guest/PropertyBrowser';
import LoginSignup from '@/components/auth/LoginSignup';
import HostDashboard from '@/components/host/HostDashboard';
import BookingFlow from '@/components/booking/BookingFlow';
import { Moon, Sun, User as UserIcon, Search, MapPin, Star } from 'lucide-react';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'host-dashboard' | 'booking' | 'properties'>('home');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showPackagesForProperty, setShowPackagesForProperty] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div 
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              BulkStay
            </span>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
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
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
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
        <HostDashboard user={user} onLogout={handleLogout} />
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

  if (currentView === 'properties') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-500">
        {renderHeader()}
        <PropertyBrowser
          onSelectProperty={handleSelectProperty}
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

      {/* Property Search Section */}
      <PropertySearchSection 
        onSelectProperty={handleSelectProperty} 
        selectedProperty={selectedProperty}
        onBackToProperties={handleBackToProperties}
      />
      
      {/* Packages Section - Only show when property is selected */}
      {showPackagesForProperty && selectedProperty && (
        <div id="packages">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Loading packages for {selectedProperty.name}...</p>
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
    </div>
  );
}

// Property Search Section Component
const PropertySearchSection: React.FC<{ 
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property | null;
  onBackToProperties: () => void;
}> = ({ onSelectProperty, selectedProperty, onBackToProperties }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const allProperties = await getProperties();
      // Only show properties with bulk booking enabled
      const enabledProperties = allProperties.filter(p => p.isBulkBookingEnabled);
      setProperties(enabledProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const locations = [...new Set(properties.map(p => p.location))];
  
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || property.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <section id="properties" className="py-24 px-8 lg:px-16 bg-white dark:bg-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          {selectedProperty ? (
            <div>
              <button
                onClick={onBackToProperties}
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-6"
              >
                ← Back to all properties
              </button>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {selectedProperty.name}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Selected property • Now choose your bulk booking package below
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Premium Properties
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Find your perfect stay from our curated collection of luxury accommodations
              </p>
            </>
          )}
        </div>

        {/* Search Bar - Only show when no property is selected */}
        {!selectedProperty && (
          <div className="mb-20 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-base font-medium"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-14 pr-12 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 min-w-[240px] appearance-none cursor-pointer text-base font-medium"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid - Only show when no property is selected */}
        {!selectedProperty && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Loading properties...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12 text-center">
                  <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
                    {filteredProperties.length} properties available
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {filteredProperties.map(property => (
                    <div
                      key={property.id}
                      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700"
                    >
                      <div className="relative h-56 overflow-hidden">
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

                      <div className="p-7">
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 line-clamp-1">
                          {property.name}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2 text-base">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </p>

                        <div className="mb-6">
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            ₹{property.baseRate.toLocaleString()}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-base ml-1">/night</span>
                        </div>

                        <button
                          onClick={() => onSelectProperty(property)}
                          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                        >
                          View Packages
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Properties Found</h3>
                    <p className="text-slate-600 dark:text-slate-300">Try adjusting your search or location filters</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Selected Property Details - Show when property is selected */}
        {selectedProperty && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
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
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Choose Your Package</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-base">
                    Select from flexible bulk booking packages below to save up to 30% on your stays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Footer - Only show when no property is selected */}
        {!selectedProperty && (
          <footer className="mt-16 bg-slate-800 dark:bg-slate-900">
            <div className="px-6 lg:px-12">
              <div className="py-8">
                {/* Copyright and Links */}
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-400 mb-4">
                    © 2024 BulkStay. All rights reserved.
                  </p>
                  <div className="flex justify-center gap-8 text-sm text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Support</a>
                  </div>
                </div>
                
                {/* Partner Logos */}
                <div className="flex justify-center items-center gap-8 opacity-60">
                  <div className="text-slate-400 text-xs font-medium">Trusted by leading travel platforms</div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
};
