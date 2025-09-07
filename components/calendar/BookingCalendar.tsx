'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Calendar from './Calendar';
import { formatINR } from '@/services/api';
import styles from './BookingCalendar.module.css';

interface BookingInfo {
  id: string;
  guestName: string;
  guestEmail: string;
  packageType: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface BookingCalendarProps {
  propertyId: number;
  propertyName: string;
  onClose: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  propertyId,
  propertyName,
  onClose
}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock booking data (in a real app, this would come from API)
  useEffect(() => {
    const mockBookings: BookingInfo[] = [
      {
        id: 'BK001',
        guestName: 'Rajesh Kumar',
        guestEmail: 'rajesh@example.com',
        packageType: 'Monthly Nomad',
        checkIn: '2025-09-15',
        checkOut: '2025-09-17',
        totalAmount: 89997,
        status: 'confirmed'
      },
      {
        id: 'BK002',
        guestName: 'Priya Sharma',
        guestEmail: 'priya@example.com',
        packageType: 'Weekend Explorer',
        checkIn: '2025-09-25',
        checkOut: '2025-09-26',
        totalAmount: 29499,
        status: 'confirmed'
      },
      {
        id: 'BK003',
        guestName: 'Amit Patel',
        guestEmail: 'amit@example.com',
        packageType: 'Annual Adventurer',
        checkIn: '2025-10-05',
        checkOut: '2025-10-08',
        totalAmount: 147499,
        status: 'pending'
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, [propertyId]);

  // Generate booked dates from bookings
  const bookedDates = bookings.reduce((dates: string[], booking) => {
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);

  const handleDateSelect = (dates: string[]) => {
    setSelectedDates(dates);
  };

  const getBookingForDate = (date: string): BookingInfo | undefined => {
    return bookings.find(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      const checkDate = new Date(date);
      return checkDate >= start && checkDate <= end;
    });
  };

  const selectedBooking = selectedDates.length === 1 ? getBookingForDate(selectedDates[0]) : null;

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const occupancyRate = Math.round((bookedDates.length / 30) * 100); // Assuming 30-day view

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Booking Calendar</h2>
          <p className={styles.subtitle}>{propertyName}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{bookings.length}</span>
          <span className={styles.statLabel}>Total Bookings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatINR(totalRevenue)}</span>
          <span className={styles.statLabel}>Revenue</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{occupancyRate}%</span>
          <span className={styles.statLabel}>Occupancy</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.sectionTitle}>Calendar View</h3>
            <p className={styles.sectionSubtitle}>
              Click on booked dates to view booking details
            </p>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading bookings...</p>
            </div>
          ) : (
            <Calendar
              selectedDates={selectedDates}
              onDateSelect={handleDateSelect}
              mode="single"
              bookedDates={bookedDates}
              className={styles.calendar}
            />
          )}
        </div>

        <div className={styles.detailsSection}>
          {selectedBooking ? (
            <div className={styles.bookingDetails}>
              <h3 className={styles.detailsTitle}>Booking Details</h3>
              
              <div className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <span className={styles.bookingId}>#{selectedBooking.id}</span>
                  <span className={`${styles.status} ${styles[selectedBooking.status]}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>

                <div className={styles.guestInfo}>
                  <h4 className={styles.guestName}>{selectedBooking.guestName}</h4>
                  <p className={styles.guestEmail}>{selectedBooking.guestEmail}</p>
                </div>

                <div className={styles.bookingInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Package:</span>
                    <span className={styles.infoValue}>{selectedBooking.packageType}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Check-in:</span>
                    <span className={styles.infoValue}>
                      {new Date(selectedBooking.checkIn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Check-out:</span>
                    <span className={styles.infoValue}>
                      {new Date(selectedBooking.checkOut).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Total Amount:</span>
                    <span className={styles.infoValue}>{formatINR(selectedBooking.totalAmount)}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button variant="outline" size="sm">
                    Contact Guest
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <div className={styles.noSelectionIcon}>📅</div>
              <h3 className={styles.noSelectionTitle}>Select a Date</h3>
              <p className={styles.noSelectionText}>
                Click on a booked date in the calendar to view booking details
              </p>
            </div>
          )}

          <div className={styles.upcomingBookings}>
            <h3 className={styles.upcomingTitle}>Upcoming Bookings</h3>
            <div className={styles.bookingsList}>
              {bookings
                .filter(booking => new Date(booking.checkIn) >= new Date())
                .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                .slice(0, 3)
                .map(booking => (
                  <div key={booking.id} className={styles.upcomingBooking}>
                    <div className={styles.upcomingInfo}>
                      <span className={styles.upcomingGuest}>{booking.guestName}</span>
                      <span className={styles.upcomingDates}>
                        {new Date(booking.checkIn).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {new Date(booking.checkOut).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <span className={styles.upcomingAmount}>
                      {formatINR(booking.totalAmount)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
