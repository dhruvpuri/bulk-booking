'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/services/api';
import { BookingData } from './BookingFlow';
import styles from './ConfirmationPage.module.css';

interface ConfirmationPageProps {
  onComplete: () => void;
  bookingData: BookingData;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onComplete, bookingData }) => {
  const { selectedPackage, bookingId, totalAmount, user } = bookingData;

  if (!selectedPackage || !bookingId) {
    return <div>Error: Missing booking information</div>;
  }

  const handleModifyDates = () => {
    // In a real app, this would navigate to a date modification flow
    alert('Date modification feature would be implemented here');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.title}>Booking Confirmed!</h2>
        <p className={styles.subtitle}>
          Your package has been successfully purchased and is ready to use.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.bookingDetails}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Booking Information</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detail}>
                <span className={styles.label}>Booking ID:</span>
                <span className={styles.value}>{bookingId}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Guest Email:</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Purchase Date:</span>
                <span className={styles.value}>{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Total Paid:</span>
                <span className={styles.value}>{formatINR(totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          <Separator className={styles.separator} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Package Details</h3>
            <div className={styles.packageCard}>
              <h4 className={styles.packageName}>{selectedPackage.name}</h4>
              <p className={styles.packageDescription}>{selectedPackage.description}</p>
              
              <div className={styles.packageStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{selectedPackage.totalNights}</span>
                  <span className={styles.statLabel}>Nights Available</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{formatINR(selectedPackage.discountedNightlyRate)}</span>
                  <span className={styles.statLabel}>Per Night Rate</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{selectedPackage.validityMonths}</span>
                  <span className={styles.statLabel}>Months Valid</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className={styles.separator} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Next Steps</h3>
            <div className={styles.nextSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Check Your Email</h4>
                  <p>We&apos;ve sent a confirmation email with your booking details and instructions.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Browse Properties</h4>
                  <p>Start exploring our partner properties across India and plan your stays.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Book Your Dates</h4>
                  <p>Use your nights anytime within the validity period - no blackout dates!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.quickActions}>
            <h3 className={styles.sidebarTitle}>Quick Actions</h3>
            <Button 
              onClick={handleModifyDates}
              variant="outline"
              className={styles.actionButton}
            >
              Modify Tentative Dates
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="outline"
              className={styles.actionButton}
            >
              Print Confirmation
            </Button>
            <Button 
              onClick={onComplete}
              className={styles.actionButton}
            >
              Continue to Dashboard
            </Button>
          </div>

          <div className={styles.support}>
            <h3 className={styles.sidebarTitle}>Need Help?</h3>
            <div className={styles.supportContent}>
              <p>Our customer support team is here to help you make the most of your package.</p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span>1800-BULK-STAY</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉️</span>
                  <span>support@bulkstay.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>💬</span>
                  <span>Live Chat Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.savings}>
            <h3 className={styles.sidebarTitle}>Your Savings</h3>
            <div className={styles.savingsAmount}>
              {formatINR((selectedPackage.originalNightlyRate - selectedPackage.discountedNightlyRate) * selectedPackage.totalNights)}
            </div>
            <div className={styles.savingsText}>
              saved vs. booking individually
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
