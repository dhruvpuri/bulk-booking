'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser } from '@/services/api';
import styles from './GuestRegistration.module.css';

interface StepData {
  user?: any;
  selectedPackage?: any;
  tentativeDates?: string[];
  paymentInfo?: any;
  bookingId?: string;
  totalAmount?: number;
}

interface GuestRegistrationProps {
  onComplete: (data: StepData) => void;
  onBack: () => void;
}

const GuestRegistration: React.FC<GuestRegistrationProps> = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    travelFrequency: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.travelFrequency) {
      setError('Please select your travel frequency');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await registerUser(
        formData.email,
        formData.password,
        'guest',
        formData.travelFrequency
      );
      
      onComplete({ user });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create Your Guest Account</h2>
        <p className={styles.subtitle}>
          Join thousands of travelers who save big with bulk booking packages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <Label htmlFor="travelFrequency">How often do you travel?</Label>
          <Select onValueChange={(value) => handleInputChange('travelFrequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your travel frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly - I travel almost every week</SelectItem>
              <SelectItem value="monthly">Monthly - I travel 1-2 times per month</SelectItem>
              <SelectItem value="quarterly">Quarterly - I travel every few months</SelectItem>
              <SelectItem value="annually">Annually - I travel a few times per year</SelectItem>
            </SelectContent>
          </Select>
          <p className={styles.fieldHelp}>
            This helps us recommend the best package for your travel style.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>What you&apos;ll get:</h3>
          <ul className={styles.benefitsList}>
            <li>✓ Up to 30% savings on premium properties</li>
            <li>✓ Flexible booking with no blackout dates</li>
            <li>✓ 12-24 months to use your nights</li>
            <li>✓ Priority customer support</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GuestRegistration;
