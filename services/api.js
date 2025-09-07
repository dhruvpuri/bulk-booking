import { User, Package, Property, Booking } from '../types';

// Mock data arrays
const mockProperties = [
  {
    id: 1,
    name: "Oceanview Villa",
    location: "Malibu, CA",
    baseRate: 450,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    isBulkBookingEnabled: true
  },
  {
    id: 2,
    name: "Mountain Retreat",
    location: "Aspen, CO",
    baseRate: 320,
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    isBulkBookingEnabled: false
  },
  {
    id: 3,
    name: "City Loft",
    location: "New York, NY",
    baseRate: 280,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    isBulkBookingEnabled: true
  },
  {
    id: 4,
    name: "Beachfront Condo",
    location: "Miami, FL",
    baseRate: 380,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    isBulkBookingEnabled: false
  }
];

const mockPackages = [
  {
    id: 1,
    name: "Weekend Explorer",
    description: "Perfect for frequent weekend getaways. Use your nights flexibly across participating properties.",
    totalNights: 6,
    price: 1680,
    originalNightlyRate: 350,
    discountedNightlyRate: 280,
    validityMonths: 12
  },
  {
    id: 2,
    name: "Monthly Nomad",
    description: "Ideal for digital nomads and extended stays. Maximum flexibility with premium properties.",
    totalNights: 15,
    price: 3900,
    originalNightlyRate: 350,
    discountedNightlyRate: 260,
    validityMonths: 18
  },
  {
    id: 3,
    name: "Vacation Master",
    description: "The ultimate package for vacation enthusiasts. Best value for extended travel.",
    totalNights: 30,
    price: 7200,
    originalNightlyRate: 350,
    discountedNightlyRate: 240,
    validityMonths: 24
  }
];

const mockUsers = [
  {
    id: "user-1",
    email: "guest@example.com",
    role: "guest",
    travelFrequency: "monthly"
  },
  {
    id: "host-1",
    email: "host@example.com",
    role: "host"
  }
];

let mockBookings = [];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getProperties = async () => {
  await delay(500);
  return Promise.resolve(mockProperties);
};

export const enableBulkBooking = async (propertyId) => {
  await delay(300);
  const property = mockProperties.find(p => p.id === propertyId);
  if (property) {
    property.isBulkBookingEnabled = true;
    return Promise.resolve(property);
  }
  return Promise.reject(new Error('Property not found'));
};

export const getPackages = async () => {
  await delay(400);
  return Promise.resolve(mockPackages);
};

export const createBooking = async (payload) => {
  await delay(600);
  const newBooking = {
    id: `booking-${Date.now()}`,
    userId: payload.userId,
    packageId: payload.packageId,
    propertyId: payload.propertyId,
    status: 'pending',
    tentativeDates: payload.tentativeDates,
    totalAmount: payload.totalAmount,
    createdAt: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return Promise.resolve(newBooking);
};

export const confirmBookingDates = async (bookingId, dates) => {
  await delay(400);
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.confirmedDates = dates;
    booking.status = 'confirmed';
    return Promise.resolve(booking);
  }
  return Promise.reject(new Error('Booking not found'));
};

export const cancelBooking = async (bookingId) => {
  await delay(300);
  const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex].status = 'cancelled';
    return Promise.resolve(mockBookings[bookingIndex]);
  }
  return Promise.reject(new Error('Booking not found'));
};

export const authenticateUser = async (email, password) => {
  await delay(500);
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    return Promise.resolve(user);
  }
  return Promise.reject(new Error('Invalid credentials'));
};

export const registerUser = async (email, password, role, travelFrequency) => {
  await delay(600);
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    role,
    travelFrequency: role === 'guest' ? travelFrequency : undefined
  };
  mockUsers.push(newUser);
  return Promise.resolve(newUser);
};
