import { useEffect, useState } from "react";
import { fetchBookingById } from "../Apis/Admin-Api";

// 1. Fix: Add type to bookingId (string)
const useBookingById = (bookingId: string | undefined) => {
  // 2. Fix: Add types to useState so they aren't 'null' forever
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooking = async () => {
    try {
      setLoading(true);
      // Ensure we have an ID before calling
      if (!bookingId) return;

      const data = await fetchBookingById(bookingId);
      console.log(" booking in useBookingById ", data);
      
      // Accessing data carefully
      setBooking(data?.data?.bookings || data?.bookings || data);
    } catch (err: any) { 
      // 3. Fix: Cast 'err' to 'any' to access .response properties
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