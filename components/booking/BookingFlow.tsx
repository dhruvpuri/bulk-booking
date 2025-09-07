'use client';

import React, { useState } from 'react';
import { Package, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GuestRegistration from './GuestRegistration';
import PackageSelection from './PackageSelection';
import PaymentScreen from './PaymentScreen';
import ConfirmationPage from './ConfirmationPage';
import styles from './BookingFlow.module.css';

interface BookingFlowProps {
  selectedPackageId?: number;
  onComplete: () => void;
  onBack: () => void;
}

export interface BookingData {
  user?: User;
  selectedPackage?: Package;
  tentativeDates?: string[];
  paymentInfo?: Record<string, any>;
  bookingId?: string;
}

interface StepData {
  user?: User;
  selectedPackage?: Package;
  tentativeDates?: string[];
  paymentInfo?: Record<string, any>;
  bookingId?: string;
  totalAmount?: number;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ selectedPackageId, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});

  const steps = [
    { number: 1, title: 'Guest Registration', component: 'registration' },
    { number: 2, title: 'Package Selection', component: 'selection' },
    { number: 3, title: 'Payment', component: 'payment' },
    { number: 4, title: 'Confirmation', component: 'confirmation' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleStepComplete = (stepData: StepData) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GuestRegistration
            onComplete={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      case 2:
        return (
          <PackageSelection
            selectedPackageId={selectedPackageId}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            bookingData={bookingData}
          />
        );
      case 3:
        return (
          <PaymentScreen
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            bookingData={bookingData}
          />
        );
      case 4:
        return (
          <ConfirmationPage
            onComplete={onComplete}
            bookingData={bookingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Home
        </button>
        <h1 className={styles.title}>Complete Your Booking</h1>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <Progress value={progress} className={styles.progress} />
        </div>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div
              key={step.number}
              className={`${styles.step} ${
                step.number === currentStep ? styles.active :
                step.number < currentStep ? styles.completed : styles.upcoming
              }`}
            >
              <div className={styles.stepNumber}>
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default BookingFlow;
