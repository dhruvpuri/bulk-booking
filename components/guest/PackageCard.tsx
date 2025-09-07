'use client';

import React from 'react';
import { Package } from '@/types';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/services/api';
import styles from './PackageCard.module.css';

interface PackageCardProps {
  package: Package;
  onReserve: (packageId: number) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onReserve }) => {
  const savings = (pkg.originalNightlyRate - pkg.discountedNightlyRate) * pkg.totalNights;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badge}>
          {pkg.validityMonths} months validity
        </div>
        <h3 className={styles.title}>{pkg.name}</h3>
        <p className={styles.description}>{pkg.description}</p>
      </div>

      <div className={styles.pricing}>
        <div className={styles.mainPrice}>
          <span className={styles.price}>{formatINR(pkg.price)}</span>
          <span className={styles.nights}>{pkg.totalNights} nights</span>
        </div>
        <div className={styles.perNight}>
          <span className={styles.discountedRate}>{formatINR(pkg.discountedNightlyRate)}/night</span>
          <span className={styles.originalRate}>{formatINR(pkg.originalNightlyRate)}/night</span>
        </div>
      </div>

      <div className={styles.savings}>
        <span className={styles.savingsLabel}>You save</span>
        <span className={styles.savingsAmount}>{formatINR(savings)}</span>
      </div>

      <div className={styles.features}>
        {pkg.features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <span className={styles.checkmark}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className={styles.imageContainer}>
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" 
          alt="Luxury accommodation"
          className={styles.image}
        />
      </div>

      <Button 
        onClick={() => onReserve(pkg.id)}
        className={styles.reserveButton}
      >
        Reserve Your Package
      </Button>
    </div>
  );
};

export default PackageCard;
