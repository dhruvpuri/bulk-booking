'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import { getProperties, enableBulkBooking } from '@/services/api';
import PropertyCard from './PropertyCard';
import styles from './PropertyListingPanel.module.css';

interface PropertyListingPanelProps {
  onConfigurePackage: (propertyId: number) => void;
}

const PropertyListingPanel: React.FC<PropertyListingPanelProps> = ({ onConfigurePackage }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties. Please try again.');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleToggleBulkBooking = async (propertyId: number, enabled: boolean) => {
    if (enabled) {
      try {
        await enableBulkBooking(propertyId);
        setProperties(prev => 
          prev.map(prop => 
            prop.id === propertyId 
              ? { ...prop, isBulkBookingEnabled: true }
              : prop
          )
        );
      } catch (err) {
        console.error('Error enabling bulk booking:', err);
        // Optionally show error message to user
      }
    } else {
      // For demo purposes, we'll allow disabling without API call
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId 
            ? { ...prop, isBulkBookingEnabled: false }
            : prop
        )
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const enabledCount = properties.filter(p => p.isBulkBookingEnabled).length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{properties.length}</span>
            <span className={styles.statLabel}>Total Properties</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{enabledCount}</span>
            <span className={styles.statLabel}>Bulk Booking Enabled</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {enabledCount > 0 ? Math.round((enabledCount / properties.length) * 100) : 0}%
            </span>
            <span className={styles.statLabel}>Participation Rate</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onToggleBulkBooking={handleToggleBulkBooking}
            onConfigurePackage={onConfigurePackage}
          />
        ))}
      </div>

      {properties.length === 0 && (
        <div className={styles.empty}>
          <h3>No Properties Found</h3>
          <p>Add your first property to get started with bulk booking.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListingPanel;
