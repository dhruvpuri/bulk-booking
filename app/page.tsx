'use client';

import React, { useState, useEffect } from 'react';
import { User, Package } from '@/types';
import { getPackages } from '@/services/api';
import Hero from '@/components/guest/Hero';
import PackageExplorer from '@/components/guest/PackageExplorer';
import LoginSignup from '@/components/auth/LoginSignup';
import HostDashboard from '@/components/host/HostDashboard';
import BookingFlow from '@/components/booking/BookingFlow';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'host-dashboard' | 'booking'>('home');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
    // Check for existing user session
    const savedUser = localStorage.getItem('bulkstay_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'host') {
          setCurrentView('host-dashboard');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('bulkstay_user');
      }
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
    setUser(loggedInUser);
    localStorage.setItem('bulkstay_user', JSON.stringify(loggedInUser));
    
    if (loggedInUser.role === 'host') {
      setCurrentView('host-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bulkstay_user');
    setCurrentView('home');
    setSelectedPackage(null);
  };

  const handleReservePackage = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    if (!user) {
      // If user is not logged in, redirect to login
      setSelectedPackage(pkg);
      setCurrentView('login');
    } else if (user.role === 'guest') {
      // If user is logged in as guest, start booking flow
      setSelectedPackage(pkg);
      setCurrentView('booking');
    } else {
      // Host users shouldn't be able to book packages
      alert('Hosts cannot book packages. Please log in as a guest.');
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

  // Navigation header
  const renderHeader = () => (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div 
        onClick={handleBackToHome}
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#3b82f6',
          cursor: 'pointer'
        }}
      >
        BulkStay
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Welcome, {user.email}
            </span>
            {user.role === 'host' && currentView !== 'host-dashboard' && (
              <button
                onClick={() => setCurrentView('host-dashboard')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setCurrentView('login')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );

  // Render different views based on current state
  if (currentView === 'login') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <HostDashboard user={user} />
      </div>
    );
  }

  if (currentView === 'booking' && user?.role === 'guest' && selectedPackage) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {renderHeader()}
        <BookingFlow
          user={user}
          selectedPackage={selectedPackage}
          onComplete={handleBookingComplete}
          onCancel={handleBackToHome}
        />
      </div>
    );
  }

  // Default home view
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {renderHeader()}
      <Hero />
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <div>Loading packages...</div>
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
