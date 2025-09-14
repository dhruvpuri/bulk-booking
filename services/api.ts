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
    baseRate: 18000, // ₹18,000
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    totalBookings: 47,
    occupancyRate: 85,
    isBulkBookingEnabled: true,
    description: 'Luxury oceanview villa with private beach access',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'AC', 'Parking'],
    roomTypes: ['Deluxe', 'Suite'],
    hostId: 1
  },
  {
    id: 2,
    name: 'Mountain Retreat',
    location: 'Manali, Himachal Pradesh',
    baseRate: 12000, // ₹12,000
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    totalBookings: 32,
    occupancyRate: 78,
    isBulkBookingEnabled: true,
    description: 'Cozy mountain retreat with stunning valley views',
    amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Parking'],
    roomTypes: ['Standard', 'Deluxe'],
    hostId: 1
  },
  {
    id: 3,
    name: 'City Loft',
    location: 'Mumbai, Maharashtra',
    baseRate: 15000, // ₹15,000
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    totalBookings: 63,
    occupancyRate: 92,
    isBulkBookingEnabled: true,
    description: 'Modern city loft in the heart of Mumbai',
    amenities: ['WiFi', 'AC', 'City View', 'Gym', 'Parking'],
    roomTypes: ['Studio', 'One Bedroom'],
    hostId: 1
  },
  {
    id: 4,
    name: 'Beachfront Condo',
    location: 'Kochi, Kerala',
    baseRate: 14500, // ₹14,500
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    totalBookings: 28,
    occupancyRate: 71,
    isBulkBookingEnabled: false,
    description: 'Beautiful beachfront condo with ocean views',
    amenities: ['WiFi', 'Beach Access', 'Pool', 'AC', 'Balcony'],
    roomTypes: ['One Bedroom', 'Two Bedroom'],
    hostId: 1
  },
  {
    id: 5,
    name: 'Heritage Haveli',
    location: 'Jaipur, Rajasthan',
    baseRate: 16500, // ₹16,500
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    totalBookings: 41,
    occupancyRate: 88,
    isBulkBookingEnabled: true,
    description: 'Traditional Rajasthani haveli with royal architecture',
    amenities: ['WiFi', 'Heritage Architecture', 'Courtyard', 'AC', 'Cultural Tours'],
    roomTypes: ['Royal Suite', 'Heritage Room'],
    hostId: 1
  },
  {
    id: 6,
    name: 'Backwater Resort',
    location: 'Alleppey, Kerala',
    baseRate: 13000, // ₹13,000
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    totalBookings: 35,
    occupancyRate: 82,
    isBulkBookingEnabled: true,
    description: 'Serene backwater resort with houseboat experience',
    amenities: ['WiFi', 'Backwater View', 'Boat Rides', 'AC', 'Ayurvedic Spa'],
    roomTypes: ['Water Villa', 'Garden View'],
    hostId: 1
  },
  // Guest properties for browsing
  {
    id: 7,
    name: 'Himalayan Lodge',
    location: 'Rishikesh, Uttarakhand',
    baseRate: 11000, // ₹11,000
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    totalBookings: 29,
    occupancyRate: 75,
    isBulkBookingEnabled: true,
    description: 'Peaceful lodge near the Ganges with yoga sessions',
    amenities: ['WiFi', 'Yoga Studio', 'River View', 'Meditation Hall', 'Organic Food'],
    roomTypes: ['Deluxe', 'Premium'],
    hostId: 2
  },
  {
    id: 8,
    name: 'Desert Camp',
    location: 'Jaisalmer, Rajasthan',
    baseRate: 9500, // ₹9,500
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    totalBookings: 22,
    occupancyRate: 68,
    isBulkBookingEnabled: true,
    description: 'Luxury desert camp with camel safari experiences',
    amenities: ['WiFi', 'Desert Safari', 'Cultural Shows', 'Bonfire', 'Star Gazing'],
    roomTypes: ['Luxury Tent', 'Royal Tent'],
    hostId: 2
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'guest@bulkstay.com',
    role: 'guest',
    travelFrequency: 'monthly'
  },
  {
    id: '2',
    email: 'host@bulkstay.com',
    role: 'host'
  }
];

let mockBookings: Booking[] = [
  {
    id: 'BK1704067200000',
    userId: '1',
    packageId: 2,
    tentativeDates: ['2024-12-15', '2024-12-16', '2024-12-17', '2025-01-10', '2025-01-11'],
    totalAmount: 74999,
    status: 'confirmed',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'BK1706745600000',
    userId: '1',
    packageId: 1,
    tentativeDates: ['2024-11-20', '2024-11-21', '2024-12-05', '2024-12-06'],
    totalAmount: 24999,
    status: 'confirmed',
    createdAt: '2024-02-01T00:00:00.000Z'
  }
];

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
  console.log('🔐 [TypeScript API] Authentication attempt:', { email, password });
  console.log('📋 [TypeScript API] Available mock users:', mockUsers);
  console.log('🔍 [TypeScript API] This is the TypeScript version of the API');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  console.log('👤 [TypeScript API] Found user:', user);
  
  if (!user) {
    console.log('❌ [TypeScript API] User not found for email:', email);
    throw new Error('Invalid credentials - user not found');
  }
  
  if (password !== 'password') {
    console.log('❌ [TypeScript API] Password mismatch. Expected: "password", Got:', password);
    throw new Error('Invalid credentials - wrong password');
  }
  
  console.log('✅ [TypeScript API] Authentication successful for user:', user);
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
    id: (mockUsers.length + 1).toString(),
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
    userId: (bookingData.userId || 1).toString(),
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
  
  property.isBulkBookingEnabled = enabled;
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
