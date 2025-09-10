'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import styles from './PackageConfigModal.module.css';

interface PackageConfigModalProps {
  propertyId: number;
  onClose: () => void;
}

const PackageConfigModal: React.FC<PackageConfigModalProps> = ({ propertyId, onClose }) => {
  const [config, setConfig] = useState({
    minNights: 3,
    maxNights: 30,
    discountPercentage: 20,
    validityMonths: 12,
    blackoutDates: '',
    weekendPremium: true,
    seasonalPricing: false,
    cancellationPolicy: 'flexible'
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving package configuration:', { propertyId, config });
    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle className={styles.title}>
            Configure Bulk Booking Package
          </DialogTitle>
        </DialogHeader>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Package Rules</h3>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <Label htmlFor="minNights">Minimum Nights</Label>
                <Input
                  id="minNights"
                  type="number"
                  value={config.minNights}
                  onChange={(e) => handleInputChange('minNights', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className={styles.field}>
                <Label htmlFor="maxNights">Maximum Nights</Label>
                <Input
                  id="maxNights"
                  type="number"
                  value={config.maxNights}
                  onChange={(e) => handleInputChange('maxNights', parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  value={config.discountPercentage}
                  onChange={(e) => handleInputChange('discountPercentage', parseInt(e.target.value))}
                  min="5"
                  max="50"
                />
              </div>
              
              <div className={styles.field}>
                <Label htmlFor="validity">Validity (Months)</Label>
                <Input
                  id="validity"
                  type="number"
                  value={config.validityMonths}
                  onChange={(e) => handleInputChange('validityMonths', parseInt(e.target.value))}
                  min="6"
                  max="24"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Restrictions</h3>
            
            <div className={styles.field}>
              <Label htmlFor="blackout">Blackout Dates (Optional)</Label>
              <Textarea
                id="blackout"
                placeholder="Enter specific dates or date ranges (e.g., Dec 24-26, Jan 1)"
                value={config.blackoutDates}
                onChange={(e) => handleInputChange('blackoutDates', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Pricing Options</h3>
            
            <div className={styles.switchField}>
              <div className={styles.switchLabel}>
                <Label>Weekend Premium</Label>
                <p className={styles.switchDescription}>
                  Apply 20% premium for Friday-Sunday bookings
                </p>
              </div>
              <Switch
                checked={config.weekendPremium}
                onCheckedChange={(checked) => handleInputChange('weekendPremium', checked)}
              />
            </div>
            
            <div className={styles.switchField}>
              <div className={styles.switchLabel}>
                <Label>Seasonal Pricing</Label>
                <p className={styles.switchDescription}>
                  Enable different rates for peak/off-peak seasons
                </p>
              </div>
              <Switch
                checked={config.seasonalPricing}
                onCheckedChange={(checked) => handleInputChange('seasonalPricing', checked)}
              />
            </div>
          </div>
          
          <div className={styles.preview}>
            <h3 className={styles.sectionTitle}>Package Preview</h3>
            <div className={styles.previewCard}>
              <div className={styles.previewRow}>
                <span>Base Rate:</span>
                <span>$350/night</span>
              </div>
              <div className={styles.previewRow}>
                <span>Bulk Discount:</span>
                <span>-{config.discountPercentage}%</span>
              </div>
              <div className={styles.previewRow}>
                <span>Discounted Rate:</span>
                <span className={styles.discountedRate}>
                  ${Math.round(350 * (1 - config.discountPercentage / 100))}/night
                </span>
              </div>
              <div className={styles.previewRow}>
                <span>Package Size:</span>
                <span>{config.minNights}-{config.maxNights} nights</span>
              </div>
              <div className={styles.previewRow}>
                <span>Validity:</span>
                <span>{config.validityMonths} months</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageConfigModal;
