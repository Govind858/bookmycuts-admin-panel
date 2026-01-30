// src/pages/admin/ShopBookings.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { fetchShopBookings } from '../Apis/Admin-Api'; // ← adjust path

const ShopBookings = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const limit = 10;

  const loadBookings = async (page = 1) => {
    if (!shopId) {
      setError("No shop ID found in the URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page,
        limit,
      };

      if (selectedDate) {
        queryParams.date = selectedDate.toISOString().split('T')[0];
      }
      if (statusFilter) {
        queryParams.bookingStatus = statusFilter;
      }

      const data = await fetchShopBookings(shopId, queryParams);

      if (data?.success) {
        setBookings(data.bookings || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(data?.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      loadBookings(1);
    }
  }, [shopId, selectedDate, statusFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadBookings(newPage);
    }
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setStatusFilter('');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusDisplay = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return 'Confirmed';
    if (s === 'pending')   return 'Pending';
    if (s === 'cancelled') return 'Cancelled';
    if (s === 'completed') return 'Completed';
    return status || 'Unknown';
  };

  if (!shopId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <p className="text-xl font-semibold text-gray-800 mb-4">Shop not selected</p>
          <p className="text-gray-600 mb-6">Please select a shop first.</p>
          <a
            href="/admin/shops"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Shops
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-56">
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="dd MMM yyyy"
                placeholderText="Filter by date"
                isClearable
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {(selectedDate || statusFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">
            <p className="text-xl font-medium mb-2">No bookings found</p>
            <p>Try adjusting the filters or check back later.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {bookings.map((booking) => {
                      const date = new Date(booking.bookingDate);
                      return (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {date.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(booking.timeSlot?.startingTime)} –{' '}
                              {formatTime(booking.timeSlot?.endingTime)}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              {getStatusDisplay(booking.bookingStatus)}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                            {booking.services?.length > 0
                              ? booking.services.map(s => s.name).join(', ')
                              : '—'}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium text-gray-900">
                              ₹{booking.totalPrice || 0}
                            </div>
                            {booking.remainingAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Due: ₹{booking.remainingAmount}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/bookings/${booking._id}`)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopBookings;