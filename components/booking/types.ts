export interface StepData {
  user?: any;
  selectedPackage?: any;
  tentativeDates?: string[];
  paymentInfo?: any;
  bookingId?: string;
  totalAmount?: number;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  zipCode: string;
}
