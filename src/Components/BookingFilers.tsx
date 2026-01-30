const BookingFilters = ({ filters, setFilters }) => {
  // Helper to reset page to 1 and spread previous filters
  const updateFilters = (newValues) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
      page: 1,
    }));
  };

  const handlePeriodChange = (period) => {
    updateFilters({
      period,
      date: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleSingleDate = (date) => {
    updateFilters({
      date,
      period: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      {/* Quick period buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: "Today", value: "today" },
          { label: "Yesterday", value: "yesterday" },
          { label: "Last 7 days", value: "lastWeek" },
          { label: "Last 30 days", value: "lastMonth" },
          { label: "This Month", value: "thisMonth" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => handlePeriodChange(item.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all
              ${
                filters.period === item.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Booking Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Booking Status
          </label>
          <select
            value={filters.bookingStatus || ""}
            onChange={(e) =>
              updateFilters({ bookingStatus: e.target.value })
            }
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg 
                     shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     text-gray-700 text-sm transition-colors"
          >
            <option value="">All Booking Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || ""}
            onChange={(e) =>
              updateFilters({ paymentStatus: e.target.value })
            }
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg 
                     shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     text-gray-700 text-sm transition-colors"
          >
            <option value="">All Payment Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Single Date Picker */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Specific Date
          </label>
          <input
            type="date"
            value={filters.date || ""}
            onChange={(e) => handleSingleDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg 
                     shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     text-gray-700 text-sm"
          />
        </div>

        {/* Date Range - Start */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="From"
              value={filters.startDate || ""}
              onChange={(e) => updateFilters({ startDate: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg 
                       shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                       text-gray-700 text-sm"
            />
            <input
              type="date"
              placeholder="To"
              value={filters.endDate || ""}
              onChange={(e) => updateFilters({ endDate: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg 
                       shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                       text-gray-700 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Optional: Reset filters button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            setFilters({
              page: 1,
              period: "",
              date: "",
              startDate: "",
              endDate: "",
              bookingStatus: "",
              paymentStatus: "",
            })
          }
          className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 
                   hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default BookingFilters;