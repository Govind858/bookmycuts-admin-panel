// src/pages/admin/ShopOwnersList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';           // ← add this
import { fetchAllShopOwners } from '../Apis/Admin-Api';
import { User, Phone, Mail, MapPin, Eye, ShieldCheck } from 'lucide-react';

// ────────────────────────────────────────────────
// Type definition
// ────────────────────────────────────────────────
interface ShopOwner {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  city: string;
  role?: string;
}

// ────────────────────────────────────────────────
// Reusable detail item (can stay if you want to reuse it later)
// ────────────────────────────────────────────────
const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-1">
    <Icon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-base text-gray-900 break-words">{value || '—'}</div>
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Main List Component
// ────────────────────────────────────────────────
const ShopOwnersList: React.FC = () => {
  const navigate = useNavigate();                        // ← add this
  const [owners, setOwners] = useState<ShopOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    const loadOwners = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAllShopOwners(page, limit);
        const data = response?.data || response; // adjust depending on your axios setup

        if (!data?.success) {
          throw new Error(data?.message || 'Failed to fetch owners');
        }

        const receivedOwners = data.shopOwners || data.data || [];

        setOwners(receivedOwners);

        // Simple last-page detection
        if (receivedOwners.length < limit) {
          setTotalPages(page);
        } else {
          setTotalPages(page + 1); // optimistic
        }

        // Better → if your backend sends total:
        // setTotalPages(data.totalPages || Math.ceil(data.totalCount / limit));
      } catch (err: any) {
        console.error('Error fetching shop owners:', err);
        setError(err.message || 'Failed to load shop owners.');
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
  }, [page]);

  const filteredOwners = owners.filter((owner) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const fullName = `${owner.firstName || ''} ${owner.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(term) ||
      (owner.email || '').toLowerCase().includes(term) ||
      (owner.mobileNo || '').includes(term) ||
      (owner.city || '').toLowerCase().includes(term)
    );
  });

  const handleView = (ownerId: string) => {
    navigate(`/admin/shop-owners/${ownerId}`);           // ← or /view-shop-owner/${ownerId}
    // Alternative paths you might prefer:
    // navigate(`/shop-owner/${ownerId}`);
    // navigate(`/admin/view-shop-owner/${ownerId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Shop Owners</h1>
            <p className="mt-1 text-gray-600">
              Manage all registered shop owners • {filteredOwners.length} shown
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Search by name, phone, email, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredOwners.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? "No matching owners found" : "No shop owners registered yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm ? "Try different keywords" : "New owners will appear here"}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredOwners.length > 0 && (
          <div className="bg-white shadow border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOwners.map((owner) => {
                    const fullName = `${owner.firstName?.trim() || ''} ${owner.lastName?.trim() || ''}`.trim();

                    return (
                      <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{fullName || '—'}</div>
                              <div className="text-xs text-gray-500">ID: {owner._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {owner.mobileNo || '—'}
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {owner.city?.trim() || '—'}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleView(owner._id)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 justify-end ml-auto"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        page === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 7 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        page === totalPages
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <div className="sm:hidden text-sm text-gray-700">
                Page {page} {totalPages > 1 ? `of ${totalPages}` : ''}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOwnersList;