'use client';

import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const scrollToProperties = () => {
    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Find Your Perfect{' '}
            <span className={styles.titleGradient}>Hotel</span>, Choose Your Plan
          </h1>
          <p className={styles.subtitle}>
            Discover premium hotels across India, then select flexible bulk booking packages that save you up to 30%. Book nights upfront and use them whenever you travel.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏨</span>
              <span>Premium hotels nationwide</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <span>Bulk packages save up to 30%</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📅</span>
              <span>Flexible usage over 12-24 months</span>
            </div>
          </div>
          <button 
            onClick={scrollToProperties}
            className={styles.ctaButton}
          >
            Browse Hotels
            <span style={{ marginLeft: '8px' }}>→</span>
          </button>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&auto=format" 
            alt="Luxury vacation rental with modern amenities"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
