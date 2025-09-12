'use client';

import React from 'react';
import { Package, Property } from '@/types';
import PackageCard from './PackageCard';
import styles from './PackageExplorer.module.css';

interface PackageExplorerProps {
  packages: Package[];
  onReserve: (packageId: number) => void;
  selectedProperty?: Property | null;
  onBackToProperties?: () => void;
}

const PackageExplorer: React.FC<PackageExplorerProps> = ({ packages, onReserve, selectedProperty, onBackToProperties }) => {
  const handleReserve = (packageId: number) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage && onReserve) {
      onReserve(packageId);
    }
  };

  return (
    <section id="packages" className={styles.section}>
      <div className={styles.container}>
        {selectedProperty && onBackToProperties && (
          <div className="mb-8">
            <button
              onClick={onBackToProperties}
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              ← Back to all properties
            </button>
          </div>
        )}
        
        <div className={styles.header}>
          {selectedProperty ? (
            <>
              <h2 className={styles.title}>
                Bulk Packages for{' '}
                <span className={styles.titleGradient}>{selectedProperty.name}</span>
              </h2>
              <p className={styles.subtitle}>
                Choose your preferred bulk booking package for {selectedProperty.name} in {selectedProperty.location}. 
                Save up to 30% compared to regular nightly rates of ₹{selectedProperty.baseRate.toLocaleString()}.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.title}>
                Choose Your Perfect{' '}
                <span className={styles.titleGradient}>Package</span>
              </h2>
              <p className={styles.subtitle}>
                Select the package that matches your travel style and save big on premium accommodations. 
                Each package is designed to give you maximum flexibility and incredible value.
              </p>
            </>
          )}
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
          <h3 className={styles.benefitsTitle}>
            {selectedProperty ? `Why Book ${selectedProperty.name} in Bulk?` : 'Why Choose Bulk Booking?'}
          </h3>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔒</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>Lock in Today&apos;s Rates</h4>
                <p className={styles.benefitDescription}>
                  {selectedProperty 
                    ? `Secure ₹${selectedProperty.baseRate.toLocaleString()}/night rate for future stays`
                    : 'Protect yourself from future price increases'
                  }
                </p>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📱</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>Easy Booking</h4>
                <p className={styles.benefitDescription}>
                  {selectedProperty 
                    ? `Reserve your dates at ${selectedProperty.name} with just a few clicks`
                    : 'Reserve your dates with just a few clicks'
                  }
                </p>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <div className={styles.benefitContent}>
                <h4 className={styles.benefitTitle}>No Blackout Dates</h4>
                <p className={styles.benefitDescription}>
                  {selectedProperty 
                    ? `Use your nights at ${selectedProperty.name} whenever you want to travel`
                    : 'Use your nights whenever you want to travel'
                  }
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
