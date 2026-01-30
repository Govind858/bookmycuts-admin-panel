interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) => {
  // Don't show pagination if there's only 1 page
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div
      className={`
        flex items-center justify-center gap-3 sm:gap-4 
        py-6 px-4 
        ${className}
      `}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => !isFirstPage && onPageChange(page - 1)}
        className={`
          inline-flex items-center justify-center 
          px-4 py-2.5 text-sm font-medium
          rounded-lg border border-gray-300
          transition-colors duration-150
          ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 active:bg-gray-100"
          }
        `}
        aria-label="Previous page"
      >
        <svg
          className="w-5 h-5 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Prev
      </button>

      {/* Current Page / Total Pages */}
      <div className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
        <span className="text-gray-900 font-semibold">{page}</span>
        <span className="text-gray-400 mx-1.5">/</span>
        <span>{totalPages}</span>
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => !isLastPage && onPageChange(page + 1)}
        className={`
          inline-flex items-center justify-center 
          px-4 py-2.5 text-sm font-medium
          rounded-lg border border-gray-300
          transition-colors duration-150
          ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 active:bg-gray-100"
          }
        `}
        aria-label="Next page"
      >
        Next
        <svg
          className="w-5 h-5 ml-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;