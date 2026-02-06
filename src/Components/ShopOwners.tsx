// src/pages/admin/ShopOwnersList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllShopOwners } from '../Apis/Admin-Api';
import { User, Eye } from 'lucide-react'; // Removed unused ShieldCheck, Mail, etc.

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
// Main List Component
// ────────────────────────────────────────────────
const ShopOwnersList: React.FC = () => {
  const navigate = useNavigate();
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
        // Accessing .data to avoid the AxiosResponse type error
        const data = response?.data || response;

        if (!data?.success) {
          throw new Error(data?.message || 'Failed to fetch owners');
        }

        const receivedOwners = data.shopOwners || data.data || [];
        setOwners(receivedOwners);

        // Simple last-page detection
        if (receivedOwners.length < limit) {
          setTotalPages(page);
        } else {
          setTotalPages(page + 1);
        }
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

    const firstName = owner.firstName || '';
    const lastName = owner.lastName || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    return (
      fullName.includes(term) ||
      (owner.email || '').toLowerCase().includes(term) ||
      (owner.mobileNo || '').includes(term) ||
      (owner.city || '').toLowerCase().includes(term)
    );
  });

  const handleView = (ownerId: string) => {
    navigate(`/admin/shop-owners/${ownerId}`);
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

        {/* Loading / Error / No Results States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filteredOwners.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? "No matching owners found" : "No shop owners registered yet"}
            </h3>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredOwners.length > 0 && (
          <div className="bg-white shadow border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOwners.map((owner) => (
                    <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {`${owner.firstName || ''} ${owner.lastName || ''}`.trim() || '—'}
                            </div>
                            <div className="text-xs text-gray-500">ID: {owner._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{owner.mobileNo || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{owner.city || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(owner._id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 justify-end ml-auto"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
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
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
                Page {page} of {totalPages}
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