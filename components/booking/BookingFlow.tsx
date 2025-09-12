'use client';

import React, { useState } from 'react';
import { Package, User, Property } from '@/types';
import { Progress } from '@/components/ui/progress';
import GuestRegistration from './GuestRegistration';
import PackageSelection from './PackageSelection';
import PropertyBrowser from '@/components/guest/PropertyBrowser';
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
  selectedProperty?: Property;
  tentativeDates?: string[];
  paymentInfo?: Record<string, unknown>;
  bookingId?: string;
  totalAmount?: number;
}

interface StepData {
  user?: User;
  selectedPackage?: Package;
  selectedProperty?: Property;
  tentativeDates?: string[];
  paymentInfo?: Record<string, unknown>;
  bookingId?: string;
  totalAmount?: number;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ selectedPackageId, onComplete, onBack }) => {
  // Check if user is already logged in and skip registration
  const [currentStep, setCurrentStep] = useState(() => {
    const savedUser = localStorage.getItem('bulkstay_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.role === 'guest') {
          console.log('🎯 User already logged in, skipping registration step');
          return 2; // Skip to package selection
        }
      } catch (e) {
        console.log('Error parsing user in BookingFlow:', e);
      }
    }
    return 1; // Start with registration if no user
  });
  
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    // Pre-populate with user data if available
    const savedUser = localStorage.getItem('bulkstay_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.role === 'guest') {
          return { user };
        }
      } catch (e) {
        console.log('Error parsing user for booking data:', e);
      }
    }
    return {};
  });

  // Load the selected package when component mounts
  React.useEffect(() => {
    if (selectedPackageId && !bookingData.selectedPackage) {
      // Load packages and find the selected one
      import('@/services/api').then(({ getPackages }) => {
        getPackages().then(packages => {
          const selectedPkg = packages.find(p => p.id === selectedPackageId);
          if (selectedPkg) {
            console.log('📦 Loading selected package:', selectedPkg.name);
            setBookingData(prev => ({ ...prev, selectedPackage: selectedPkg }));
          }
        });
      });
    }
  }, [selectedPackageId, bookingData.selectedPackage]);

  const steps = [
    { number: 1, title: 'Guest Registration', component: 'registration' },
    { number: 2, title: 'Package Selection', component: 'selection' },
    { number: 3, title: 'Property Selection', component: 'property' },
    { number: 4, title: 'Payment', component: 'payment' },
    { number: 5, title: 'Confirmation', component: 'confirmation' }
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
    console.log('🔄 BookingFlow rendering step:', currentStep, 'with data:', bookingData);
    
    switch (currentStep) {
      case 1:
        console.log('📝 Rendering Guest Registration step');
        return (
          <GuestRegistration
            onComplete={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      case 2:
        console.log('📦 Rendering Package Selection step with packageId:', selectedPackageId);
        return (
          <PackageSelection
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            bookingData={bookingData}
          />
        );
      case 3:
        console.log('🏨 Rendering Property Selection step');
        return (
          <PropertyBrowser
            onSelectProperty={(property: Property) => {
              handleStepComplete({ selectedProperty: property });
            }}
            onBack={handleStepBack}
            selectedPackage={bookingData.selectedPackage}
          />
        );
      case 4:
        return (
          <PaymentScreen
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            bookingData={bookingData}
          />
        );
      case 5:
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
