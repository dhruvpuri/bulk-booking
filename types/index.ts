export interface User {
  id: string;
  email: string;
  role: 'guest' | 'host';
  travelFrequency?: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  totalNights: number;
  price: number;
  originalNightlyRate: number;
  discountedNightlyRate: number;
  validityMonths: number;
}

export interface Property {
  id: number;
  name: string;
  location: string;
  baseRate: number;
  imageUrl: string;
  isBulkBookingEnabled: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: number;
  propertyId?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  tentativeDates?: string[];
  confirmedDates?: string[];
  totalAmount: number;
  createdAt: string;
}
