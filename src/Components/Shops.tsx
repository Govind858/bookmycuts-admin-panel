// src/pages/admin/ShopsList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ← added
import { fetchAdminShops, verifyShop } from "../Apis/Admin-Api";
import { Store, Crown, Eye, Search } from 'lucide-react';

// ────────────────────────────────────────────────
// Type definition for a shop
// ────────────────────────────────────────────────
interface Shop {
  _id: string;
  ShopName: string;
  City: string;
  ExactLocation: string;
  Mobile: string | number;
  Timing?: string;
  email?: string;
  isPremium?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ────────────────────────────────────────────────
// Main Shops List Component (with navigation to detail page)
// ────────────────────────────────────────────────
const ShopsList: React.FC = () => {
  const navigate = useNavigate(); // ← added for navigation
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchAdminShops();

        let shopsData: Shop[] = [];
        if (Array.isArray(response)) {
          shopsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          shopsData = response.data;
        } else if (response?.shops && Array.isArray(response.shops)) {
          shopsData = response.shops;
        } else if (response?.success && response?.shops) {
          shopsData = response.shops;
        }

        // Sort alphabetically by shop name
        const sorted = shopsData.sort((a, b) =>
          a.ShopName.localeCompare(b.ShopName)
        );

        setShops(sorted);
      } catch (err: any) {
        console.error("Error fetching shops:", err);
        setError("Failed to load shops. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  const handleToggleVerify = async (shopId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const response = await verifyShop(shopId, newStatus);
      if (response && response.success) {
        setShops((prevShops) =>
          prevShops.map((shop) =>
            shop._id === shopId ? { ...shop, isVerified: newStatus } : shop
          )
        );
      } else {
        alert(response?.message || "Failed to update shop verification status");
      }
    } catch (err: any) {
      console.error("Error toggling shop verification:", err);
      alert(err.message || "Failed to update verification status. Please try again.");
    }
  };

  // Filter shops based on search term
  const filteredShops = shops.filter((shop) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      shop.ShopName.toLowerCase().includes(term) ||
      shop.City?.toLowerCase().includes(term) ||
      shop.ExactLocation?.toLowerCase().includes(term) ||
      String(shop.Mobile).includes(term) ||
      shop.email?.toLowerCase().includes(term) ||
      shop.Timing?.toLowerCase().includes(term)
    );
  });

  const handleViewShop = (shopId: string) => {
    navigate(`/admin/shops/${shopId}`); // ← navigate to detail page
    // You can also use other paths like:
    // navigate(`/shop-detail/${shopId}`);
    // navigate(`/admin/view-shop/${shopId}`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Shops</h1>
            <p className="mt-1 text-gray-600">
              Manage all registered shops • {filteredShops.length} shown
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Search by name, city, location, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredShops.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? "No matching shops found" : "No shops registered yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm ? "Try different keywords" : "New shops will appear here"}
            </p>
          </div>
        )}

        {/* Shops Table */}
        {!loading && !error && filteredShops.length > 0 && (
          <div className="bg-white shadow border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShops.map((shop) => (
                    <tr key={shop._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Store className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{shop.ShopName}</div>
                            <div className="text-xs text-gray-500">ID: {shop._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {shop.City}
                          {shop.ExactLocation && (
                            <span className="text-gray-500 text-xs block">
                              {shop.ExactLocation}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {shop.Mobile || '—'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          {shop.isPremium ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 w-max">
                              <Crown size={14} className="mr-1" />
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-max">
                              Standard
                            </span>
                          )}
                          {shop.isVerified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-max">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 w-max">
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => handleToggleVerify(shop._id, shop.isVerified || false)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                              shop.isVerified
                                ? 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100'
                                : 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100'
                            }`}
                          >
                            {shop.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            onClick={() => handleViewShop(shop._id)}
                            className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsList;