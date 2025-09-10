'use client';

import React, { useState, useEffect } from 'react';
import { Property, Package } from '@/types';
import { getProperties } from '@/services/api';
import { Button } from '@/components/ui/button';
import styles from './PropertyBrowser.module.css';

interface PropertyBrowserProps {
  onSelectProperty: (property: Property) => void;
  onBack: () => void;
  selectedPackage?: Package;
}

const PropertyBrowser: React.FC<PropertyBrowserProps> = ({ 
  onSelectProperty, 
  onBack, 
  selectedPackage 
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Get all properties that have bulk booking enabled
      const allProperties = await getProperties();
      const enabledProperties = allProperties.filter(p => p.isBulkBookingEnabled);
      setProperties(enabledProperties);
    } catch {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const locations = [...new Set(properties.map(p => p.location))];
  
  const filteredProperties = properties.filter(property => {
    const locationMatch = selectedLocation === 'all' || property.location === selectedLocation;
    const priceMatch = priceRange === 'all' || 
      (priceRange === 'budget' && property.baseRate <= 3000) ||
      (priceRange === 'mid' && property.baseRate > 3000 && property.baseRate <= 6000) ||
      (priceRange === 'luxury' && property.baseRate > 6000);
    
    return locationMatch && priceMatch;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading available properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={loadProperties}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back
        </button>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Browse Properties</h2>
          <p className={styles.subtitle}>
            Choose where you&apos;d like to use your {selectedPackage?.name} package nights
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Location</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price Range</label>
          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget (₹0 - ₹3,000)</option>
            <option value="mid">Mid-range (₹3,001 - ₹6,000)</option>
            <option value="luxury">Luxury (₹6,000+)</option>
          </select>
        </div>
      </div>

      <div className={styles.resultsHeader}>
        <h3 className={styles.resultsTitle}>
          {filteredProperties.length} Properties Available
        </h3>
        <p className={styles.resultsSubtitle}>
          All properties support bulk booking packages
        </p>
      </div>

      <div className={styles.propertiesGrid}>
        {filteredProperties.map(property => (
          <div key={property.id} className={styles.propertyCard}>
            <div className={styles.propertyImage}>
              <img src={property.imageUrl} alt={property.name} />
              <div className={styles.propertyBadge}>
                Bulk Booking Available
              </div>
            </div>
            
            <div className={styles.propertyContent}>
              <h4 className={styles.propertyName}>{property.name}</h4>
              <p className={styles.propertyLocation}>📍 {property.location}</p>
              
              <div className={styles.propertyDetails}>
                <div className={styles.propertyPrice}>
                  <span className={styles.priceAmount}>₹{property.baseRate.toLocaleString()}</span>
                  <span className={styles.priceUnit}>per night</span>
                </div>
                
                <div className={styles.propertyAmenities}>
                  {property.amenities?.slice(0, 3).map((amenity, index) => (
                    <span key={index} className={styles.amenity}>
                      {amenity}
                    </span>
                  )) || (
                    <>
                      <span className={styles.amenity}>WiFi</span>
                      <span className={styles.amenity}>AC</span>
                      <span className={styles.amenity}>Parking</span>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.propertyActions}>
                <Button 
                  onClick={() => onSelectProperty(property)}
                  className={styles.selectButton}
                >
                  Select Property
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🏨</div>
          <h3>No Properties Found</h3>
          <p>Try adjusting your filters to see more options.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyBrowser;