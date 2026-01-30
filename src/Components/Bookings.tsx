import useBookings from "../hooks/useBookings";
import BookingFilters from "./BookingFilers";
import BookingTable from "./BookingTable";
import Pagination from "./Pagination";

const Bookings = () => {
  const {
    bookings,
    loading,
    filters,
    setFilters,
    totalPages
  } = useBookings();

  return (
    <>
      <BookingFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <BookingTable bookings={bookings} />
      )}

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) =>
          setFilters(f => ({ ...f, page }))
        }
      />
    </>
  );
};

export default Bookings;
