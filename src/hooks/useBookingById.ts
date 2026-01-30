import { useEffect, useState } from "react";
import { fetchBookingById } from "../Apis/Admin-Api";

const useBookingById = (bookingId) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await fetchBookingById(bookingId);
      console.log(" booking in useBookingById ",data)
      setBooking(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  return {
    booking,
    loading,
    error,
    refetch: loadBooking
  };
};

export default useBookingById;
