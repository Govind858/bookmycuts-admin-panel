import { useEffect, useState } from "react";
import { fetchBookings } from "../Apis/Admin-Api";

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    period: "",
    date: "",
    startDate: "",
    endDate: "",
    bookingStatus: "",
    paymentStatus: ""
  });

  const [totalPages, setTotalPages] = useState(1);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchBookings(filters);
      console.log("response in useBookings",data)
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters]);

  return {
    bookings,
    loading,
    filters,
    setFilters,
    totalPages
  };
};

export default useBookings;
