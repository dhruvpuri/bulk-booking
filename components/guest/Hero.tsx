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
            Book Your Dream Stays in Bulk, Save Big
          </h1>
          <p className={styles.subtitle}>
            Purchase nights upfront at discounted rates. Use them flexibly across premium properties whenever you want to travel.
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
              <span>Access to premium properties</span>
            </div>
          </div>
          <Button 
            onClick={scrollToPackages}
            className={styles.ctaButton}
            size="lg"
          >
            Explore Packages
          </Button>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" 
            alt="Luxury vacation rental"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
