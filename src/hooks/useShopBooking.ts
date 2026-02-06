import { useEffect, useState } from "react";
import { fetchShopBookings } from "../Apis/Admin-Api";

// 1. If this hook is for a specific shop, it needs to accept shopId as a parameter
const useBookings = (shopId?: string) => {
  const [bookings, setBookings] = useState<any[]>([]); // Fix: prevent 'never' type error
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
    // 2. Safety check: don't call the API if shopId is missing
    if (!shopId) return;

    setLoading(true);
    try {
      // 3. FIXED: Arguments order must match Admin-Api.ts -> (shopId, filters)
      const data = await fetchShopBookings(shopId, filters);
      
      console.log("response in useBookings", data);
      
      // 4. Use optional chaining to prevent crashes if data is null
      setBookings(data?.bookings || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err: any) { // 5. FIXED: err: any prevents 'unknown' error
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters, shopId]); // Reload if filters or shopId changes

  return {
    bookings,
    loading,
    filters,
    setFilters,
    totalPages
  };
};

export default useBookings;