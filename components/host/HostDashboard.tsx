'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Property } from '@/types';
import { getProperties, updatePropertyBulkBooking } from '@/services/api';
import PropertyCard from './PropertyCard';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import AddPropertyModal from './AddPropertyModal';
import styles from './HostDashboard.module.css';
import { } from 'lucide-react';

import { User } from '@/types';

interface HostDashboardProps {
  user: User;
  onLogout?: () => void;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ user, onLogout }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'properties' | 'analytics' | 'bookings' | 'settings' | 'add-property'>('properties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  // const [bookings, setBookings] = useState<Booking[]>([]); // TODO: Implement booking management

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProperties(parseInt(user.id));
      setProperties(data);
    } catch {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  

  const handleToggleBulkBooking = async (propertyId: number, enabled: boolean) => {
    try {
      const updatedProperty = await updatePropertyBulkBooking(propertyId, enabled);
      setProperties(prev => 
        prev.map(p => p.id === propertyId ? updatedProperty : p)
      );
    } catch {
      setError('Failed to update property');
    }
  };

  const handleConfigurePackages = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowBookingCalendar(true);
    }
  };

  const handleViewBookings = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowBookingCalendar(true);
    }
  };

  const handleCloseBookingCalendar = () => {
    setShowBookingCalendar(false);
    setSelectedProperty(null);
  };

  const handleAddProperty = () => {
    setShowAddPropertyModal(true);
  };

  const handleCloseAddPropertyModal = () => {
    setShowAddPropertyModal(false);
  };

  const handlePropertyAdded = (newProperty: Property) => {
    setProperties(prev => [...prev, newProperty]);
    setShowAddPropertyModal(false);
  };

  if (showBookingCalendar && selectedProperty) {
    return (
      <BookingCalendar
        propertyId={selectedProperty.id}
        propertyName={selectedProperty.name}
        onClose={handleCloseBookingCalendar}
      />
    );
  }

  const enabledProperties = properties.filter(p => p.isBulkBookingEnabled);
  const participationRate = properties.length > 0 ? Math.round((enabledProperties.length / properties.length) * 100) : 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoContent}>
            <div>
              <h1 className={styles.logoText}>BulkStay</h1>
              <p className={styles.logoSubtext}>Host Dashboard</p>
            </div>
            
          </div>
        </div>

        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${selectedView === 'properties' ? styles.active : ''}`}
            onClick={() => setSelectedView('properties')}
          >
            <span className={styles.navIcon}>🏠</span>
            <span className={styles.navText}>Properties</span>
          </button>
          <button 
            className={`${styles.navItem} ${selectedView === 'analytics' ? styles.active : ''}`}
            onClick={() => setSelectedView('analytics')}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Analytics</span>
          </button>
          <button 
            className={`${styles.navItem} ${selectedView === 'bookings' ? styles.active : ''}`}
            onClick={() => setSelectedView('bookings')}
          >
            <span className={styles.navIcon}>📅</span>
            <span className={styles.navText}>Bookings</span>
          </button>
          <button 
            className={`${styles.navItem} ${selectedView === 'settings' ? styles.active : ''}`}
            onClick={() => setSelectedView('settings')}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Settings</span>
          </button>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarText}>
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userEmail}>{user.email}</span>
              <span className={styles.userRole}>Host</span>
            </div>
          </div>
          <button className={styles.logoutButton} onClick={onLogout}>
            <span className={styles.logoutIcon}>🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.main}>
        {selectedView === 'properties' && (
          <>
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl text-white">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user.email.split('@')[0]}! 👋
              </h1>
              <p className="text-indigo-100 dark:text-purple-100">
                Manage your properties and track your bulk booking performance
              </p>
            </div>

            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div>
                  <h2 className={styles.title}>Property Management</h2>
                  <p className={styles.subtitle}>
                    Enable bulk booking for your properties to attract more guests and increase revenue.
                  </p>
                </div>
                <button className={styles.addPropertyButton} onClick={handleAddProperty}>
                  <span className={styles.addIcon}>+</span>
                  Add Property
                </button>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{properties.length}</span>
                <span className={styles.statLabel}>Total Properties</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{enabledProperties.length}</span>
                <span className={styles.statLabel}>Bulk Booking Enabled</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{participationRate}%</span>
                <span className={styles.statLabel}>Participation Rate</span>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading your properties...</p>
              </div>
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
                <button onClick={loadProperties}>Try Again</button>
              </div>
            ) : properties.length > 0 ? (
              <div className={styles.propertiesGrid}>
                {properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onToggleBulkBooking={handleToggleBulkBooking}
                    onConfigurePackages={handleConfigurePackages}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏨</div>
                <h3 className={styles.emptyTitle}>No Properties Yet</h3>
                <p className={styles.emptyDescription}>
                  Get started by adding your first property to enable bulk booking and attract more guests.
                </p>
                <button 
                  className={styles.emptyActionButton}
                  onClick={handleAddProperty}
                >
                  Add Your First Property
                </button>
              </div>
            )}
          </>
        )}

        {selectedView === 'bookings' && (
          <div className={styles.bookingsView}>
            <div className={styles.header}>
              <h2 className={styles.title}>Booking Management</h2>
              <p className={styles.subtitle}>
                View and manage bookings across all your properties.
              </p>
            </div>

            <div className={styles.propertiesBookingList}>
              {properties.map(property => (
                <div key={property.id} className={styles.propertyBookingCard}>
                  <div className={styles.propertyBookingInfo}>
                    <img 
                      src={property.imageUrl} 
                      alt={property.name}
                      className={styles.propertyBookingImage}
                    />
                    <div className={styles.propertyBookingDetails}>
                      <h3 className={styles.propertyBookingName}>{property.name}</h3>
                      <p className={styles.propertyBookingLocation}>{property.location}</p>
                      <div className={styles.propertyBookingStats}>
                        <span>{property.totalBookings || 0} bookings</span>
                        <span>•</span>
                        <span>{property.occupancyRate || 0}% occupancy</span>
                        <span>•</span>
                        <span className={property.isBulkBookingEnabled ? styles.enabled : styles.disabled}>
                          {property.isBulkBookingEnabled ? 'Bulk booking enabled' : 'Not enabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.viewBookingsButton}
                    onClick={() => handleViewBookings(property.id)}
                  >
                    View Calendar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className={styles.analyticsView}>
            <div className={styles.header}>
              <h2 className={styles.title}>Analytics Dashboard</h2>
              <p className={styles.subtitle}>
                Track your performance and revenue metrics.
              </p>
            </div>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>📊</div>
              <h3>Analytics Coming Soon</h3>
              <p>Detailed analytics and reporting features will be available soon.</p>
            </div>
          </div>
        )}

        {selectedView === 'settings' && (
          <div className={styles.settingsView}>
            <div className={styles.header}>
              <h2 className={styles.title}>Account Settings</h2>
              <p className={styles.subtitle}>
                Manage your account preferences and settings.
              </p>
            </div>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>⚙️</div>
              <h3>Settings Coming Soon</h3>
              <p>Account settings and preferences will be available soon.</p>
            </div>
          </div>
        )}
      </div>

      {showAddPropertyModal && (
        <AddPropertyModal
          onClose={handleCloseAddPropertyModal}
          onPropertyAdded={handlePropertyAdded}
        />
      )}
    </div>
  );
};

export default HostDashboard;
