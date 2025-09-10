'use client';

import React from 'react';
import { Property } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/services/api';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
  onToggleBulkBooking: (propertyId: number, enabled: boolean) => void;
  onConfigurePackages: (propertyId: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onToggleBulkBooking, 
  onConfigurePackages 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={property.imageUrl} 
          alt={property.name}
          className={styles.image}
        />
        <div className={styles.badge}>
          {property.isBulkBookingEnabled ? 'Bulk Booking Enabled' : 'Not Enabled'}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{property.name}</h3>
          <p className={styles.location}>{property.location}</p>
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>{formatINR(property.baseRate)}</span>
          <span className={styles.period}>per night</span>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{property.totalBookings || 0}</span>
            <span className={styles.statLabel}>Bookings</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>4.5</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{property.occupancyRate || 0}%</span>
            <span className={styles.statLabel}>Occupancy</span>
          </div>
        </div>

        <div className={styles.actions}>
          {property.isBulkBookingEnabled ? (
            <Button 
              onClick={() => onConfigurePackages(property.id)}
              variant="outline"
              className={styles.configureButton}
            >
              Configure Packages
            </Button>
          ) : (
            <div className={styles.enableSection}>
              <div className={styles.enableBenefits}>
                <h4>Enable bulk booking to:</h4>
                <ul>
                  <li>Increase booking volume by 40%</li>
                  <li>Attract longer-stay guests</li>
                  <li>Reduce vacancy periods</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className={styles.toggle}>
          <Switch
            checked={property.isBulkBookingEnabled}
            onCheckedChange={(checked) => onToggleBulkBooking(property.id, checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
