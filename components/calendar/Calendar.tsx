'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import styles from './Calendar.module.css';

interface CalendarProps {
  selectedDates?: string[];
  onDateSelect?: (dates: string[]) => void;
  mode?: 'single' | 'multiple' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: string[];
  bookedDates?: string[];
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDates = [],
  onDateSelect,
  mode = 'multiple',
  minDate = new Date(),
  maxDate,
  disabledDates = [],
  bookedDates = [],
  className = ''
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDatesList, setSelectedDatesList] = useState<string[]>(selectedDates);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date);
    return (
      date < minDate ||
      (maxDate && date > maxDate) ||
      disabledDates.includes(dateStr)
    );
  };

  const isDateBooked = (date: Date) => {
    const dateStr = formatDate(date);
    return bookedDates.includes(dateStr);
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDatesList.includes(dateStr);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date) || isDateBooked(date)) return;

    const dateStr = formatDate(date);
    let newSelectedDates: string[];

    if (mode === 'single') {
      newSelectedDates = [dateStr];
    } else if (mode === 'multiple') {
      if (selectedDatesList.includes(dateStr)) {
        newSelectedDates = selectedDatesList.filter(d => d !== dateStr);
      } else {
        newSelectedDates = [...selectedDatesList, dateStr];
      }
    } else if (mode === 'range') {
      if (selectedDatesList.length === 0 || selectedDatesList.length === 2) {
        newSelectedDates = [dateStr];
      } else if (selectedDatesList.length === 1) {
        const startDate = new Date(selectedDatesList[0]);
        const endDate = date;
        
        if (endDate < startDate) {
          newSelectedDates = [dateStr];
        } else {
          // Generate all dates in range
          const rangeDates = [];
          const currentDate = new Date(startDate);
          
          while (currentDate <= endDate) {
            rangeDates.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          newSelectedDates = rangeDates;
        }
      } else {
        newSelectedDates = [dateStr];
      }
    } else {
      newSelectedDates = selectedDatesList;
    }

    setSelectedDatesList(newSelectedDates);
    onDateSelect?.(newSelectedDates);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`${styles.calendar} ${className}`}>
      <div className={styles.header}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className={styles.navButton}
        >
          ←
        </Button>
        <h3 className={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className={styles.navButton}
        >
          →
        </Button>
      </div>

      <div className={styles.dayNames}>
        {dayNames.map(day => (
          <div key={day} className={styles.dayName}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className={styles.emptyDay} />;
          }

          const isDisabled = isDateDisabled(day);
          const isBooked = isDateBooked(day);
          const isSelected = isDateSelected(day);
          const isToday = formatDate(day) === formatDate(new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled || isBooked}
              className={`
                ${styles.day}
                ${isSelected ? styles.selected : ''}
                ${isDisabled ? styles.disabled : ''}
                ${isBooked ? styles.booked : ''}
                ${isToday ? styles.today : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selectedColor}`} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.bookedColor}`} />
          <span>Booked</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.todayColor}`} />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
