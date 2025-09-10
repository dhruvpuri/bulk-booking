'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Book Your Dream Stays in{' '}
            <span className={styles.titleGradient}>Bulk</span>, Save Big
          </h1>
          <p className={styles.subtitle}>
            Purchase nights upfront at discounted rates. Use them flexibly across premium properties whenever you want to travel. Experience luxury accommodation at unbeatable prices.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <span>Save up to 30% on nightly rates</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📅</span>
              <span>Use nights flexibly over 12-24 months</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏨</span>
              <span>Access to premium properties nationwide</span>
            </div>
          </div>
          <button 
            onClick={scrollToPackages}
            className={styles.ctaButton}
          >
            Explore Packages
            <span style={{ marginLeft: '8px' }}>→</span>
          </button>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format" 
            alt="Luxury vacation rental with modern amenities"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
