'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import Hero from '@/components/guest/Hero';
import PackageExplorer from '@/components/guest/PackageExplorer';
import LoginSignup from '@/components/auth/LoginSignup';
import HostDashboard from '@/components/host/HostDashboard';
import BookingFlow from '@/components/booking/BookingFlow';

type AppView = 'home' | 'login' | 'host-dashboard' | 'booking';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | undefined>();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'host') {
      setCurrentView('host-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handlePackageReserve = (packageId: number) => {
    setSelectedPackageId(packageId);
    if (currentUser) {
      setCurrentView('booking');
    } else {
      setCurrentView('login');
    }
  };

  const handleBookingComplete = () => {
    setCurrentView('home');
    setSelectedPackageId(undefined);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPackageId(undefined);
  };

  // Render based on current view
  switch (currentView) {
    case 'login':
      return <LoginSignup onLogin={handleLogin} />;
    
    case 'host-dashboard':
      if (!currentUser || currentUser.role !== 'host') {
        setCurrentView('home');
        return null;
      }
      return (
        <HostDashboard 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      );
    
    case 'booking':
      if (!currentUser || currentUser.role !== 'guest') {
        setCurrentView('login');
        return null;
      }
      return (
        <BookingFlow
          selectedPackageId={selectedPackageId}
          onComplete={handleBookingComplete}
          onBack={handleBackToHome}
        />
      );
    
    case 'home':
    default:
      return (
        <div>
          {/* Navigation Bar */}
          <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b',
              letterSpacing: '-0.5px'
            }}>
              BulkStay
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {currentUser ? (
                <>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>
                    Welcome, {currentUser.email}
                  </span>
                  {currentUser.role === 'host' && (
                    <button
                      onClick={() => setCurrentView('host-dashboard')}
                      style={{
                        background: 'none',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: '1px solid #64748b',
                      color: '#64748b',
                      padding: '8px 16px',
                      borderRadius: '8px',
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
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <div style={{ paddingTop: '80px' }}>
            <Hero />
            <PackageExplorer onPackageReserve={handlePackageReserve} />
          </div>

          {/* Footer */}
          <footer style={{
            background: '#1e293b',
            color: 'white',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '32px',
                marginBottom: '32px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                    BulkStay
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
                    The smart way to book your travels. Save big with bulk booking packages.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    For Guests
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        Browse Packages
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        How It Works
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        Support
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    For Hosts
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        List Your Property
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        Host Resources
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                        Partner Program
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div style={{
                borderTop: '1px solid #334155',
                paddingTop: '24px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                © 2024 BulkStay. All rights reserved. | Privacy Policy | Terms of Service
              </div>
            </div>
          </footer>
        </div>
      );
  }
}
