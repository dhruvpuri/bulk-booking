import { User, Package, Property, Booking } from '@/types';

// Mock data with Indian Rupee pricing
const mockPackages: Package[] = [
  {
    id: 1,
    name: 'Weekend Explorer',
    description: 'Perfect for short getaways and weekend trips across India.',
    totalNights: 6,
    price: 24999, // ₹24,999
    originalNightlyRate: 5500, // ₹5,500
    discountedNightlyRate: 4166, // ₹4,166
    validityMonths: 12,
    features: ['Flexible dates', 'Premium properties', 'No blackout dates', '24/7 support']
  },
  {
    id: 2,
    name: 'Monthly Nomad',
    description: 'Ideal for digital nomads and frequent travelers exploring India.',
    totalNights: 15,
    price: 74999, // ₹74,999
    originalNightlyRate: 6000, // ₹6,000
    discountedNightlyRate: 5000, // ₹5,000
    validityMonths: 18,
    features: ['Extended validity', 'Premium locations', 'Concierge service', 'Free cancellation']
  },
  {
    id: 3,
    name: 'Annual Adventurer',
    description: 'Best value for travel enthusiasts planning multiple trips across India.',
    totalNights: 30,
    price: 124999, // ₹1,24,999
    originalNightlyRate: 5500, // ₹5,500
    discountedNightlyRate: 4166, // ₹4,166
    validityMonths: 24,
    features: ['Maximum savings', 'Luxury properties', 'Priority booking', 'Personal travel advisor']
  }
];

const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Oceanview Villa',
    location: 'Goa, India',
    pricePerNight: 37500, // ₹37,500
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalBookings: 24,
    occupancyRate: 92,
    bulkBookingEnabled: true,
    hostId: 1
  },
  {
    id: 2,
    name: 'Mountain Retreat',
    location: 'Manali, Himachal Pradesh',
    pricePerNight: 26700, // ₹26,700
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalBookings: 24,
    occupancyRate: 92,
    bulkBookingEnabled: false,
    hostId: 1
  },
  {
    id: 3,
    name: 'City Loft',
    location: 'Mumbai, Maharashtra',
    pricePerNight: 23300, // ₹23,300
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalBookings: 24,
    occupancyRate: 92,
    bulkBookingEnabled: true,
    hostId: 1
  },
  {
    id: 4,
    name: 'Beachfront Condo',
    location: 'Kochi, Kerala',
    pricePerNight: 31700, // ₹31,700
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalBookings: 24,
    occupancyRate: 92,
    bulkBookingEnabled: false,
    hostId: 1
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    email: 'guest@example.com',
    role: 'guest',
    travelFrequency: 'monthly'
  },
  {
    id: 2,
    email: 'host@example.com',
    role: 'host'
  }
];

let mockBookings: Booking[] = [];

// API functions
export const getPackages = async (): Promise<Package[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPackages;
};

export const getProperties = async (hostId?: number): Promise<Property[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return hostId ? mockProperties.filter(p => p.hostId === hostId) : mockProperties;
};

export const authenticateUser = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  if (!user || password !== 'password') {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

export const registerUser = async (
  email: string, 
  password: string, 
  role: 'guest' | 'host',
  travelFrequency?: string
): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: mockUsers.length + 1,
    email,
    role,
    travelFrequency
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const createBooking = async (bookingData: {
  userId?: number;
  packageId: number;
  tentativeDates?: string[];
  totalAmount: number;
}): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const booking: Booking = {
    id: `BK${Date.now()}`,
    userId: bookingData.userId || 1,
    packageId: bookingData.packageId,
    tentativeDates: bookingData.tentativeDates || [],
    totalAmount: bookingData.totalAmount,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  mockBookings.push(booking);
  return booking;
};

export const updatePropertyBulkBooking = async (
  propertyId: number, 
  enabled: boolean
): Promise<Property> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const property = mockProperties.find(p => p.id === propertyId);
  if (!property) {
    throw new Error('Property not found');
  }
  
  property.bulkBookingEnabled = enabled;
  return property;
};

// Currency formatting utility for Indian Rupees
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Convert amount to Indian number format (lakhs/crores)
export const formatINRCompact = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};
