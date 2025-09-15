import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ selectedDate, onDateSelect, availableSlots, onSlotSelect, selectedSlot }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date) => {
    return new Date(date?.getFullYear(), date?.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date?.getFullYear(), date?.getMonth(), 1)?.getDay();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today?.getDate() && 
           currentMonth?.getMonth() === today?.getMonth() && 
           currentMonth?.getFullYear() === today?.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate?.getDate() && 
           currentMonth?.getMonth() === selectedDate?.getMonth() && 
           currentMonth?.getFullYear() === selectedDate?.getFullYear();
  };

  const hasAvailableSlots = (day) => {
    const dateStr = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return availableSlots?.some(slot => slot?.date === dateStr);
  };

  const isPastDate = (day) => {
    const currentDate = new Date(currentMonth?.getFullYear(), currentMonth?.getMonth(), day);
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    currentDate?.setHours(0, 0, 0, 0);
    return currentDate < today;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days?.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const hasSlots = hasAvailableSlots(day);
      const isClickable = !isPast && hasSlots;
      
      days?.push(
        <button
          key={day}
          onClick={() => {
            if (isClickable) {
              const newDate = new Date(currentMonth?.getFullYear(), currentMonth?.getMonth(), day);
              onDateSelect(newDate);
            }
          }}
          disabled={!isClickable}
          className={`h-12 w-12 rounded-lg text-sm font-medium construction-transition relative flex items-center justify-center ${
            isSelected(day)
              ? 'bg-primary text-primary-foreground construction-shadow'
              : isToday(day)
              ? 'bg-accent text-accent-foreground border-2 border-primary'
              : isClickable
              ? 'hover:bg-muted text-authority-charcoal hover:construction-shadow'
              : isPast
              ? 'text-muted-foreground cursor-not-allowed opacity-50'
              : 'text-professional-gray cursor-not-allowed'
          }`}
        >
          {day}
          {hasSlots && !isPast && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-success rounded-full"></div>
          )}
          {isToday(day) && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const getSelectedDateSlots = () => {
    if (!selectedDate) return [];
    const dateStr = `${selectedDate?.getFullYear()}-${String(selectedDate?.getMonth() + 1)?.padStart(2, '0')}-${String(selectedDate?.getDate())?.padStart(2, '0')}`;
    return availableSlots?.filter(slot => slot?.date === dateStr) || [];
  };

  const formatSelectedDate = (date) => {
    if (!date) return '';
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today?.getFullYear(), today?.getMonth(), 1));
    
    // If today has available slots, select it
    const todayStr = `${today?.getFullYear()}-${String(today?.getMonth() + 1)?.padStart(2, '0')}-${String(today?.getDate())?.padStart(2, '0')}`;
    const todayHasSlots = availableSlots?.some(slot => slot?.date === todayStr);
    if (todayHasSlots) {
      onDateSelect(today);
    }
  };

  return (
    <div className="bg-card rounded-xl construction-shadow-premium p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-authority-charcoal">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </h3>
          <p className="text-sm text-professional-gray mt-1">
            Select a date to view available time slots
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            disabled={currentMonth?.getMonth() === new Date()?.getMonth() && 
                     currentMonth?.getFullYear() === new Date()?.getFullYear()}
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-professional-gray uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-professional-gray">Available Slots</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full border-2 border-primary"></div>
          <span className="text-professional-gray">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-professional-gray">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-muted-foreground rounded-full opacity-50"></div>
          <span className="text-professional-gray">Past Dates</span>
        </div>
      </div>

      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-authority-charcoal">
              Available Times
            </h4>
            <span className="text-sm text-professional-gray">
              {formatSelectedDate(selectedDate)}
            </span>
          </div>
          
          {getSelectedDateSlots()?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {getSelectedDateSlots()?.map((slot) => (
                <button
                  key={slot?.id}
                  onClick={() => onSlotSelect(slot)}
                  className={`p-4 rounded-lg text-sm font-medium construction-transition border text-left ${
                    selectedSlot?.id === slot?.id
                      ? 'bg-primary text-primary-foreground border-primary construction-shadow'
                      : 'bg-background text-authority-charcoal border-border hover:bg-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{slot?.time}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {slot?.availableSpots} {slot?.availableSpots === 1 ? 'spot' : 'spots'} available
                      </div>
                    </div>
                    <div className="ml-2">
                      <Icon 
                        name={selectedSlot?.id === slot?.id ? "Check" : "Clock"} 
                        size={16} 
                        className="opacity-75" 
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-professional-gray mx-auto mb-4 opacity-50" />
              <p className="text-professional-gray text-sm">
                No available time slots for this date
              </p>
              <p className="text-professional-gray text-xs mt-2">
                Try selecting a different date or check back later
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {!selectedDate && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-professional-gray mx-auto mb-4 opacity-50" />
          <h4 className="text-sm font-semibold text-authority-charcoal mb-2">
            Select a Date
          </h4>
          <p className="text-professional-gray text-sm mb-4">
            Click on any highlighted date to view available time slots
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Go to Today
          </Button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;