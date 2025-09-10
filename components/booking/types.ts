import { User, Package } from '@/types';

export interface StepData {
  user?: User;
  selectedPackage?: Package;
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
