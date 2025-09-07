'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authenticateUser, registerUser } from '@/services/api';
import styles from './LoginSignup.module.css';

interface LoginSignupProps {
  onLogin: (user: User) => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    travelFrequency: ''
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
      if (isSignup) {
        const user = await registerUser(
          formData.email,
          formData.password,
          isHost ? 'host' : 'guest',
          !isHost ? formData.travelFrequency : undefined
        );
        onLogin(user);
      } else {
        const user = await authenticateUser(formData.email, formData.password);
        onLogin(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError(null);
    setFormData({ email: '', password: '', travelFrequency: '' });
  };

  const toggleRole = () => {
    setIsHost(!isHost);
    setFormData(prev => ({ ...prev, travelFrequency: '' }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className={styles.subtitle}>
            {isSignup 
              ? 'Join BulkStay to start saving on your travels'
              : 'Sign in to your BulkStay account'
            }
          </p>
        </div>

        {isSignup && (
          <div className={styles.roleToggle}>
            <div className={styles.roleOptions}>
              <button
                type="button"
                className={`${styles.roleOption} ${!isHost ? styles.active : ''}`}
                onClick={() => setIsHost(false)}
              >
                <span className={styles.roleIcon}>🧳</span>
                <span>II'm a Guestapos;m a Guest</span>
              </button>
              <button
                type="button"
                className={`${styles.roleOption} ${isHost ? styles.active : ''}`}
                onClick={toggleRole}
              >
                <span className={styles.roleIcon}>🏠</span>
                <span>II'm a Hostapos;m a Host</span>
              </button>
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

          {isSignup && !isHost && (
            <div className={styles.field}>
              <Label htmlFor="travelFrequency">How often do you travel?</Label>
              <Select onValueChange={(value) => handleInputChange('travelFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              onClick={toggleMode}
              className={styles.toggleButton}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className={styles.demoCredentials}>
          <h4>Demo Credentials:</h4>
          <p><strong>Guest:</strong> guest@example.com / password</p>
          <p><strong>Host:</strong> host@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
