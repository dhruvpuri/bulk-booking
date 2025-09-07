'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/services/api';
import AvailabilityCalendar from '@/components/calendar/AvailabilityCalendar';
import { BookingData } from './BookingFlow';
import styles from './PackageSelection.module.css';

interface StepData {
  selectedPackage?: any;
  tentativeDates?: string[];
}

interface PackageSelectionProps {
  onComplete: (data: StepData) => void;
  onBack: () => void;
  bookingData: BookingData;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({ onComplete, onBack, bookingData }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const { selectedPackage } = bookingData;

  if (!selectedPackage) {
    return <div>Error: No package selected</div>;
  }

  const handleDateSelect = (dates: string[]) => {
    setSelectedDates(dates);
  };

  const handleCalendarConfirm = () => {
    setShowCalendar(false);
    onComplete({
      selectedPackage,
      tentativeDates: selectedDates
    });
  };

  const handleCalendarCancel = () => {
    setShowCalendar(false);
  };

  const handleSkipDates = () => {
    onComplete({
      selectedPackage,
      tentativeDates: []
    });
  };

  if (showCalendar) {
    return (
      <AvailabilityCalendar
        selectedDates={selectedDates}
        onDateSelect={handleDateSelect}
        maxNights={selectedPackage.totalNights}
        onConfirm={handleCalendarConfirm}
        onCancel={handleCalendarCancel}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Confirm Your Package Selection</h2>
        <p className={styles.subtitle}>
          Review your chosen package and optionally select tentative travel dates.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.packageSummary}>
          <div className={styles.packageCard}>
            <div className={styles.packageHeader}>
              <h3 className={styles.packageName}>{selectedPackage.name}</h3>
              <div className={styles.packagePrice}>
                <span className={styles.price}>{formatINR(selectedPackage.price)}</span>
                <span className={styles.validity}>{selectedPackage.validityMonths} months validity</span>
              </div>
            </div>

            <p className={styles.packageDescription}>{selectedPackage.description}</p>

            <div className={styles.packageDetails}>
              <div className={styles.detail}>
                <div className={styles.detailIcon}>🏨</div>
                <div className={styles.detailContent}>
                  <span className={styles.detailTitle}>Total Nights</span>
                  <span className={styles.detailValue}>{selectedPackage.totalNights} nights</span>
                </div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailIcon}>💰</div>
                <div className={styles.detailContent}>
                  <span className={styles.detailTitle}>Rate per Night</span>
                  <span className={styles.detailValue}>{formatINR(selectedPackage.discountedNightlyRate)}</span>
                </div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailIcon}>📅</div>
                <div className={styles.detailContent}>
                  <span className={styles.detailTitle}>Validity Period</span>
                  <span className={styles.detailValue}>{selectedPackage.validityMonths} months</span>
                </div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailIcon}>💎</div>
                <div className={styles.detailContent}>
                  <span className={styles.detailTitle}>Total Savings</span>
                  <span className={styles.detailValue}>
                    {formatINR((selectedPackage.originalNightlyRate - selectedPackage.discountedNightlyRate) * selectedPackage.totalNights)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.features}>
              <h4 className={styles.featuresTitle}>Package Includes:</h4>
              <ul className={styles.featuresList}>
                {selectedPackage.features.map((feature: string, index: number) => (
                  <li key={index} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.dateSelection}>
          <div className={styles.dateCard}>
            <h3 className={styles.dateTitle}>Select Travel Dates (Optional)</h3>
            <p className={styles.dateDescription}>
              Choose tentative dates for your trips. You can always modify these later or book additional dates.
            </p>

            {selectedDates.length > 0 ? (
              <div className={styles.selectedDates}>
                <h4 className={styles.selectedTitle}>Selected Dates:</h4>
                <div className={styles.datesList}>
                  {selectedDates.sort().map((date, index) => (
                    <span key={index} className={styles.selectedDate}>
                      {new Date(date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  ))}
                </div>
                <p className={styles.datesNote}>
                  {selectedDates.length} of {selectedPackage.totalNights} nights selected
                </p>
              </div>
            ) : (
              <div className={styles.noDates}>
                <div className={styles.calendarIcon}>📅</div>
                <p className={styles.noDatesText}>
                  No dates selected yet. You can choose them now or later.
                </p>
              </div>
            )}

            <div className={styles.dateActions}>
              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(true)}
                className={styles.selectDatesButton}
              >
                {selectedDates.length > 0 ? 'Modify Dates' : 'Select Dates'}
              </Button>
              {selectedDates.length > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedDates([])}
                  className={styles.clearDatesButton}
                >
                  Clear Dates
                </Button>
              )}
            </div>
          </div>

          <div className={styles.benefits}>
            <h4 className={styles.benefitsTitle}>Why Select Dates Now?</h4>
            <ul className={styles.benefitsList}>
              <li>🎯 Better planning and preparation</li>
              <li>📧 Receive availability alerts</li>
              <li>⚡ Faster booking process later</li>
              <li>🏆 Priority access to popular dates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className={styles.primaryActions}>
          <Button variant="ghost" onClick={handleSkipDates}>
            Skip Dates
          </Button>
          <Button onClick={() => setShowCalendar(true)}>
            {selectedDates.length > 0 ? 'Continue to Payment' : 'Select Dates & Continue'}
          </Button>
        </div>
      </div>

      <div className={styles.guarantee}>
        <div className={styles.guaranteeIcon}>🛡️</div>
        <div className={styles.guaranteeContent}>
          <h4 className={styles.guaranteeTitle}>100% Flexible Booking</h4>
          <p className={styles.guaranteeText}>
            Change your dates anytime within the validity period. No penalties, no hassles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageSelection;
