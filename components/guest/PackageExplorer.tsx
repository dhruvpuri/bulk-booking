'use client';

import React, { useState, useEffect } from 'react';
import { Package } from '@/types';
import { getPackages } from '@/services/api';
import PackageCard from './PackageCard';
import styles from './PackageExplorer.module.css';

interface PackageExplorerProps {
  onPackageReserve: (packageId: number) => void;
}

const PackageExplorer: React.FC<PackageExplorerProps> = ({ onPackageReserve }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getPackages();
        setPackages(data);
      } catch (err) {
        setError('Failed to load packages. Please try again.');
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section id="packages" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Choose Your Perfect Package</h2>
            <p className={styles.subtitle}>
              Select the package that matches your travel style and save big on premium accommodations.
            </p>
          </div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading packages...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="packages" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose Your Perfect Package</h2>
          <p className={styles.subtitle}>
            Select the package that matches your travel style and save big on premium accommodations.
          </p>
        </div>
        
        <div className={styles.grid}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onReserve={onPackageReserve}
            />
          ))}
        </div>
        
        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>Why Choose Bulk Booking?</h3>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>🔒</span>
              <div>
                <h4>Lock in Today's Rates</h4>
                <p>Protect yourself from future price increases</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>📱</span>
              <div>
                <h4>Easy Booking</h4>
                <p>Reserve your dates with just a few clicks</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>🎯</span>
              <div>
                <h4>No Blackout Dates</h4>
                <p>Use your nights whenever you want to travel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageExplorer;
