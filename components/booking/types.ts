import { User, Package, Property } from '@/types';

export interface StepData {
  user?: User;
  selectedPackage?: Package;
  selectedProperty?: Property;
  tentativeDates?: string[];
  paymentInfo?: PaymentInfo;
  bookingId?: string;
  totalAmount?: number;
}

export interface PaymentInfo extends Record<string, unknown> {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  zipCode: string;
}
