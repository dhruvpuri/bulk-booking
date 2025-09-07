'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Calendar from './Calendar';
import styles from './AvailabilityCalendar.module.css';

interface AvailabilityCalendarProps {
  selectedDates: string[];
  onDateSelect: (dates: string[]) => void;
  maxNights: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDates,
  onDateSelect,
  maxNights,
  onConfirm,
  onCancel
}) => {
  const [mode, setMode] = useState<'single' | 'multiple' | 'range'>('multiple');

  // Mock booked dates (in a real app, this would come from API)
  const bookedDates = [
    '2025-09-15',
    '2025-09-16',
    '2025-09-25',
    '2025-10-05',
    '2025-10-06',
    '2025-10-07'
  ];

  const handleDateSelect = (dates: string[]) => {
    if (dates.length <= maxNights) {
      onDateSelect(dates);
    }
  };

  const remainingNights = maxNights - selectedDates.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Select Your Travel Dates</h3>
        <p className={styles.subtitle}>
          Choose up to {maxNights} nights from your package. You can always modify these dates later.
        </p>
      </div>

      <div className={styles.modeSelector}>
        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeButton} ${mode === 'multiple' ? styles.active : ''}`}
            onClick={() => setMode('multiple')}
          >
            Individual Dates
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'range' ? styles.active : ''}`}
            onClick={() => setMode('range')}
          >
            Date Range
          </button>
        </div>
        <div className={styles.nightsCounter}>
          <span className={styles.selected}>{selectedDates.length}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.total}>{maxNights}</span>
          <span className={styles.label}>nights selected</span>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        <Calendar
          selectedDates={selectedDates}
          onDateSelect={handleDateSelect}
          mode={mode}
          bookedDates={bookedDates}
          className={styles.calendar}
        />
      </div>

      {selectedDates.length > 0 && (
        <div className={styles.selectedDatesInfo}>
          <h4 className={styles.selectedTitle}>Selected Dates:</h4>
          <div className={styles.selectedDatesList}>
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
          {remainingNights > 0 && (
            <p className={styles.remainingText}>
              You can select {remainingNights} more night{remainingNights !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={selectedDates.length === 0}
        >
          Continue with {selectedDates.length} night{selectedDates.length !== 1 ? 's' : ''}
        </Button>
      </div>

      <div className={styles.tips}>
        <h4 className={styles.tipsTitle}>💡 Tips:</h4>
        <ul className={styles.tipsList}>
          <li>These are tentative dates - you can modify them anytime</li>
          <li>Avoid peak seasons for better availability</li>
          <li>Book early for popular destinations</li>
          <li>Your package is valid for {maxNights === 6 ? '12' : maxNights === 15 ? '18' : '24'} months</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
