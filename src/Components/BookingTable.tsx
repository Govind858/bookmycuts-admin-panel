import { Eye } from 'lucide-react'; // or use heroicons / any icon library
import { Link } from 'react-router-dom';

interface Booking {
  _id: string;
  bookingId?: string;
  bookingDate: string | Date;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  amountPaid: number;
  // ... other fields
}

interface BookingTableProps {
  bookings: Booking[];
}

const BookingTable = ({ bookings }: BookingTableProps) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="text-lg">No bookings found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const getBookingStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 sm:pl-6"
            >
              #
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Booking ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Booking Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Payment
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Amount
            </th>
            <th
              scope="col"
              className="relative px-4 py-3.5 text-right text-sm font-semibold text-gray-700 sm:pr-6"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {bookings.map((booking, index) => (
            <tr
              key={booking._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 font-medium">
                {booking.bookingId || booking._id.slice(-8).toUpperCase() || 'N/A'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getBookingStatusStyle(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusStyle(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                ₹{booking.amountPaid?.toLocaleString('en-IN') || '0'}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Link
                  to={`/admin/bookings/${booking._id}`}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={16} />
                  <span>View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;