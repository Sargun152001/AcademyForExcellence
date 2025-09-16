import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingBookings = ({ bookings, onCancelBooking, onReschedule }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-professional-gray bg-muted';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const bookingDate = new Date(dateString);
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  const canCancel = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const diffHours = (bookingDate - today) / (1000 * 60 * 60);
    return diffHours > 24 && booking?.status?.toLowerCase() === 'confirmed';
  };

  const canReschedule = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const diffHours = (bookingDate - today) / (1000 * 60 * 60);
    return diffHours > 48 && booking?.status?.toLowerCase() === 'confirmed';
  };

  if (!bookings || bookings?.length === 0) {
    return (
      <div className="bg-card rounded-xl construction-shadow-premium p-6 text-center">
        <Icon name="Calendar" size={48} className="text-professional-gray mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-2">
          No Upcoming Bookings
        </h3>
        <p className="text-professional-gray mb-4">
          You don't have any scheduled training sessions yet.
        </p>
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Book Your First Course
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl construction-shadow-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-authority-charcoal">
          Upcoming Bookings
        </h3>
        <span className="text-sm text-professional-gray">
          {bookings?.length} booking{bookings?.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-4">
        {bookings?.map((booking) => (
          <div
            key={booking?.id}
            className="border border-border rounded-lg p-4 construction-transition hover:construction-shadow"
          >
            {/* Booking Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-authority-charcoal mb-1 line-clamp-1">
                  {booking?.courseTitle}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-professional-gray">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(booking?.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{formatTime(booking?.time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{booking?.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                  {booking?.status}
                </span>
                <span className="text-xs text-professional-gray">
                  {getDaysUntil(booking?.date)}
                </span>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex items-center space-x-3 mb-3 p-2 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-desert-gold rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-authority-charcoal">
                  {booking?.instructor?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-authority-charcoal">
                  {booking?.instructor?.name}
                </p>
                <p className="text-xs text-professional-gray">
                  {booking?.instructor?.title}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-warning fill-current" />
                <span className="text-xs text-professional-gray">{booking?.rating}</span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-professional-gray">Duration:</span>
                <span className="ml-2 text-authority-charcoal font-medium">
                  {booking?.duration} hours
                </span>
              </div>
              <div>
                <span className="text-professional-gray">Booking ID:</span>
                <span className="ml-2 text-authority-charcoal font-medium font-mono">
                  {booking?.bookingId}
                </span>
              </div>
            </div>

            {/* Special Requirements */}
            {booking?.specialRequirements && (
              <div className="mb-4 p-2 bg-background rounded border-l-4 border-accent">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="AlertCircle" size={14} className="text-accent" />
                  <span className="text-xs font-medium text-authority-charcoal">Special Requirements</span>
                </div>
                <p className="text-xs text-professional-gray">{booking?.specialRequirements}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Download
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                {canReschedule(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReschedule(booking)}
                    iconName="Calendar"
                    iconPosition="left"
                  >
                    Reschedule
                  </Button>
                )}
                {canCancel(booking) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancelBooking(booking)}
                    iconName="X"
                    iconPosition="left"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      {bookings?.length > 3 && (
        <div className="mt-6 text-center">
          <Button variant="outline" iconName="ArrowRight" iconPosition="right">
            View All Bookings
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;