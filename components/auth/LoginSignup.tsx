'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticateUser, registerUser } from '@/services/api';
import { User, Package } from '@/types';
import styles from './LoginSignup.module.css';

interface LoginSignupProps {
  onLogin: (user: User) => void;
  selectedPackage?: Package | null;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ onLogin, selectedPackage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'guest' as 'guest' | 'host',
    travelFrequency: 'monthly'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login flow
        const user = await authenticateUser(formData.email, formData.password);
        
        // If user is trying to book a package but logged in as host, show error
        if (selectedPackage && user.role === 'host') {
          setError('Hosts cannot book packages. Please log in as a guest or create a guest account.');
          setLoading(false);
          return;
        }
        
        onLogin(user);
      } else {
        // Registration flow
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const user = await registerUser(
          formData.email,
          formData.password,
          formData.role,
          formData.role === 'guest' ? formData.travelFrequency : undefined
        );
        
        onLogin(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className={styles.subtitle}>
            {selectedPackage 
              ? `Sign in to book the ${selectedPackage.name} package`
              : isLogin 
                ? 'Sign in to your BulkStay account' 
                : 'Join BulkStay and start saving on your travels'
            }
          </p>
        </div>

        {selectedPackage && (
          <div className={styles.packageReminder}>
            <div className={styles.packageIcon}>📦</div>
            <div className={styles.packageInfo}>
              <h4 className={styles.packageName}>{selectedPackage.name}</h4>
              <p className={styles.packagePrice}>₹{selectedPackage.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <>
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

              <div className={styles.field}>
                <Label htmlFor="role">Account Type</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={styles.select}
                >
                  <option value="guest">Guest - Book accommodations</option>
                  <option value="host">Host - List properties</option>
                </select>
              </div>

              {formData.role === 'guest' && (
                <div className={styles.field}>
                  <Label htmlFor="travelFrequency">How often do you travel?</Label>
                  <select
                    id="travelFrequency"
                    value={formData.travelFrequency}
                    onChange={(e) => handleInputChange('travelFrequency', e.target.value)}
                    className={styles.select}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}
            </>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className={styles.switchMode}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFormData(prev => ({
                  ...prev,
                  password: '',
                  confirmPassword: ''
                }));
              }}
              className={styles.switchButton}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className={styles.demoCredentials}>
            <h4 className={styles.demoTitle}>Demo Credentials:</h4>
            <div className={styles.demoOptions}>
              <div className={styles.demoOption}>
                <strong>Guest:</strong> guest@example.com / password
              </div>
              <div className={styles.demoOption}>
                <strong>Host:</strong> host@example.com / password
              </div>
            </div>
          </div>
        )}

        {!isLogin && formData.role === 'guest' && (
          <div className={styles.benefits}>
            <h4 className={styles.benefitsTitle}>Guest Benefits:</h4>
            <ul className={styles.benefitsList}>
              <li>Save up to 30% on premium accommodations</li>
              <li>Flexible booking with no blackout dates</li>
              <li>Access to exclusive properties</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        )}

        {!isLogin && formData.role === 'host' && (
          <div className={styles.benefits}>
            <h4 className={styles.benefitsTitle}>Host Benefits:</h4>
            <ul className={styles.benefitsList}>
              <li>Increase booking volume by 40%</li>
              <li>Attract longer-stay guests</li>
              <li>Reduce vacancy periods</li>
              <li>Higher revenue per booking</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
