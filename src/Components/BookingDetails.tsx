import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, Scissors, DollarSign, User, Store, 
  ArrowLeft, AlertTriangle 
} from 'lucide-react';
import useBookingById from '../hooks/useBookingById'; 

// 1. Define the Interface so TypeScript knows exactly what a "Booking" is
interface Booking {
  _id: string;
  bookingStatus: string;
  paymentStatus: string;
  bookingDate: string;
  bookingTimestamp: string;
  totalDuration: number;
  totalPrice: number;
  amountPaid: number;
  amountToPay: number;
  remainingAmount: number;
  paymentType: string;
  timeSlot: {
    startingTime: string;
    endingTime: string;
  };
  services: Array<{
    _id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  shopId: {
    ShopName: string;
  };
  barberId: {
    BarberName: string;
  };
}

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // 2. We cast "booking" as the Booking interface to stop the "never" errors
  const { booking, loading, error, refetch } = useBookingById(id) as {
    booking: Booking | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load booking</h2>
          <p className="text-gray-600 mb-6">{error || "Booking not found"}</p>
          <button
            onClick={refetch}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const getStatusBadge = (status: string, type: 'booking' | 'payment') => {
    const isPositive = 
      (type === 'booking' && ['confirmed', 'completed'].includes(status)) ||
      (type === 'payment' && ['paid'].includes(status));

    const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border';

    if (isPositive) {
      return <span className={`${base} bg-blue-100 text-blue-800 border-blue-200`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>;
    }

    // FIX for the indexing error (TS7053)
    const styles: { 
      booking: Record<string, string>; 
      payment: Record<string, string> 
    } = {
      booking: {
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
      },
      payment: {
        partial: 'bg-blue-100 text-blue-800 border-blue-200',
        unpaid: 'bg-red-100 text-red-800 border-red-200',
        refunded: 'bg-purple-100 text-purple-800 border-purple-200',
      },
    };

    const variant = type === 'booking' 
      ? styles.booking[status] || 'bg-gray-100 text-gray-700 border-gray-200'
      : styles.payment[status] || 'bg-gray-100 text-gray-700 border-gray-200';

    return <span className={`${base} ${variant}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Bookings</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-1.5">
            Booking ID: <span className="font-mono text-gray-800 font-medium">
              {booking._id.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {getStatusBadge(booking.bookingStatus, 'booking')}
          {getStatusBadge(booking.paymentStatus, 'payment')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2.5">
                <Calendar size={20} className="text-blue-600" /> Appointment
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date</div>
                    <div className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Time Slot</div>
                    <div className="font-medium text-gray-900">
                      {formatTime(booking.timeSlot.startingTime)} – {formatTime(booking.timeSlot.endingTime)}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Booked On</div>
                    <div className="font-medium text-gray-900">{formatDate(booking.bookingTimestamp)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                    <div className="font-medium text-gray-900">{booking.totalDuration} minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2.5">
                <Scissors size={20} className="text-blue-600" /> Services
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {booking.services.map((service: any) => (
                  <li key={service._id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {service.duration} min • ₹{service.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      ₹{service.price.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-700">
                  ₹{booking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2.5">
                <User size={20} className="text-blue-600" /> Customer
              </h2>
            </div>
            <div className="p-6">
              <div className="font-medium text-gray-900 text-lg">
                {booking.userId.firstName} {booking.userId.lastName}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                ID: {booking.userId._id.slice(-8)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2.5">
                <Store size={20} className="text-blue-600" /> Location & Barber
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Shop</div>
                <div className="font-medium text-gray-900">{booking.shopId.ShopName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Barber</div>
                <div className="font-medium text-gray-900">{booking.barberId.BarberName}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2.5">
                <DollarSign size={20} className="text-blue-600" /> Payment
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(booking.paymentStatus, 'payment')}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-gray-900">₹{booking.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Due</span>
                <span className="font-semibold text-gray-900">₹{booking.amountToPay.toLocaleString()}</span>
              </div>
              {booking.remainingAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Remaining</span>
                  <span>₹{booking.remainingAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t text-sm text-gray-600">
                Type: <span className="font-medium capitalize text-gray-800">{booking.paymentType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;