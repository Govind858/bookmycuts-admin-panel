// src/Components/PremiumShopsList.tsx
import React, { useState, useEffect } from 'react';
import { fetchAllPremiumShops } from "../Apis/Admin-Api";
import { Crown, Store } from 'lucide-react';

interface PremiumShop {
  _id: string;
  ShopName: string;
  City: string;
  ExactLocation?: string;
  Mobile: string | number;
  Timing?: string;
  website?: string;
  IsPremium: boolean;
  PremiumStartDate?: string;
  PremiumEndDate?: string;
  createdAt?: string;
  ShopOwnerId?: string;
}

const PremiumShopsList: React.FC = () => {
  const [shops, setShops] = useState<PremiumShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPremiumShops = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchAllPremiumShops();
        console.log('Premium shops response:', response);

        // Extract the correct array based on your API response
        const premiumShopsData = response?.premiumShops || [];

        if (!Array.isArray(premiumShopsData)) {
          throw new Error('premiumShops is not an array');
        }

        const sorted = [...premiumShopsData].sort((a, b) =>
          a.ShopName.localeCompare(b.ShopName)
        );

        setShops(sorted);
      } catch (err: any) {
        console.error('Failed to load premium shops:', err);
        setError('Failed to load premium shops');
      } finally {
        setLoading(false);
      }
    };

    loadPremiumShops();
  }, []);

  const filteredShops = shops.filter(shop => {
    const term = searchTerm.toLowerCase();
    return (
      shop.ShopName.toLowerCase().includes(term) ||
      shop.City?.toLowerCase().includes(term) ||
      shop.ExactLocation?.toLowerCase().includes(term) ||
      String(shop.Mobile).includes(term) ||
      shop.website?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
              <Crown className="h-7 w-7 text-amber-600" />
              Premium Shops
            </h1>
            <p className="mt-1 text-gray-600">
              Exclusive premium partners • {shops.length} total
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <input
              type="text"
              placeholder="Search by name, city, location, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty / No match */}
        {!loading && !error && filteredShops.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? "No matching premium shops found" : "No premium shops yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm ? "Try adjusting your search" : "Premium shops will appear here"}
            </p>
          </div>
        )}

        {/* Table */}
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
                      Timing
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premium Until
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredShops.map((shop) => (
                    <tr key={shop._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <Store className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {shop.ShopName}
                              <Crown size={14} className="text-amber-600" />
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {shop._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {shop.City}
                          {shop.ExactLocation && (
                            <span className="block text-xs text-gray-500">
                              {shop.ExactLocation}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {shop.Mobile || '—'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {shop.Timing || '—'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {shop.website ? (
                          <a
                            href={shop.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:underline"
                          >
                            Visit
                          </a>
                        ) : '—'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shop.PremiumEndDate
                          ? new Date(shop.PremiumEndDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '—'}
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

export default PremiumShopsList;