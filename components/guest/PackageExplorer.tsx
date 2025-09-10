'use client';

import React from 'react';
import { Package } from '@/types';
import PackageCard from './PackageCard';
import styles from './PackageExplorer.module.css';

interface PackageExplorerProps {
  packages: Package[];
  onReserve: (packageId: number) => void;
}

const PackageExplorer: React.FC<PackageExplorerProps> = ({ packages, onReserve }) => {
  const handleReserve = (packageId: number) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage && onReserve) {
      onReserve(packageId);
    }
  };

  return (
    <section id="packages" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Choose Your Perfect{' '}
            <span className={styles.titleGradient}>Package</span>
          </h2>
          <p className={styles.subtitle}>
            Select the package that matches your travel style and save big on premium accommodations. 
            Each package is designed to give you maximum flexibility and incredible value.
          </p>
        </div>

        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onReserve={handleReserve}
            />
          ))}
        </div>

        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>Why Choose Bulk Booking?</h3>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔒</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>Lock in Today's Rates</h4>
                <p className={styles.benefitDescription}>
                  Protect yourself from future price increases
                </p>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📱</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>Easy Booking</h4>
                <p className={styles.benefitDescription}>
                  Reserve your dates with just a few clicks
                </p>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>No Blackout Dates</h4>
                <p className={styles.benefitDescription}>
                  Use your nights whenever you want to travel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageExplorer;
