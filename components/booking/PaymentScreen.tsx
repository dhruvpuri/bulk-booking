'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createBooking, formatINR } from '@/services/api';
import { BookingData } from './BookingFlow';
import styles from './PaymentScreen.module.css';

import { StepData } from './types';

interface PaymentScreenProps {
  onComplete: (data: StepData) => void;
  onBack: () => void;
  bookingData: BookingData;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onComplete, onBack, bookingData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  const { selectedPackage } = bookingData;
  
  if (!selectedPackage) {
    return <div>Error: No package selected</div>;
  }

  const subtotal = selectedPackage.price;
  const taxes = Math.round(subtotal * 0.18); // 18% GST for India
  const total = subtotal + taxes;

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create booking
      const booking = await createBooking({
        userId: bookingData.user?.id ? parseInt(bookingData.user.id) : undefined,
        packageId: selectedPackage.id,
        tentativeDates: bookingData.tentativeDates,
        totalAmount: total
      });

      onComplete({
        paymentInfo: paymentData,
        bookingId: booking.id,
        totalAmount: total
      });
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Complete Your Payment</h2>
        <p className={styles.subtitle}>
          Secure your package with our encrypted payment system.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.paymentForm}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Information</h3>
              
              <div className={styles.field}>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Billing Address</h3>
              
              <div className={styles.field}>
                <Label htmlFor="billingAddress">Address</Label>
                <Input
                  id="billingAddress"
                  type="text"
                  value={paymentData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={paymentData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="zipCode">PIN Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={paymentData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.actions}>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing Payment...' : `Pay ${formatINR(total)}`}
              </Button>
            </div>
          </form>
        </div>

        <div className={styles.orderSummary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          
          <div className={styles.packageSummary}>
            <h4 className={styles.packageName}>{selectedPackage.name}</h4>
            <p className={styles.packageDescription}>{selectedPackage.description}</p>
            
            <div className={styles.packageDetails}>
              <div className={styles.detail}>
                <span>Nights:</span>
                <span>{selectedPackage.totalNights}</span>
              </div>
              <div className={styles.detail}>
                <span>Rate per night:</span>
                <span>{formatINR(selectedPackage.discountedNightlyRate)}</span>
              </div>
              <div className={styles.detail}>
                <span>Validity:</span>
                <span>{selectedPackage.validityMonths} months</span>
              </div>
            </div>
          </div>

          <Separator className={styles.separator} />

          <div className={styles.pricing}>
            <div className={styles.priceRow}>
              <span>Subtotal:</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>GST (18%):</span>
              <span>{formatINR(taxes)}</span>
            </div>
            <Separator className={styles.separator} />
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <div className={styles.savings}>
            <div className={styles.savingsAmount}>
              You save {formatINR((selectedPackage.originalNightlyRate - selectedPackage.discountedNightlyRate) * selectedPackage.totalNights)}
            </div>
            <div className={styles.savingsText}>
              vs. booking individually
            </div>
          </div>

          <div className={styles.security}>
            <div className={styles.securityIcon}>🔒</div>
            <div className={styles.securityText}>
              <strong>Secure Payment</strong>
              <p>Your payment information is encrypted and secure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
