import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchServiceByShop } from "../Apis/Admin-Api";

const ShopServices = () => {
  const { shopId } = useParams();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadServices = async () => {
      if (!shopId) {
        setError("Shop ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchServiceByShop(shopId);
        
        if (response.success && Array.isArray(response.service)) {
          setServices(response.service);
        } else {
          setError(response.message || "Failed to load services");
        }
      } catch (err) {
        setError("Something went wrong while fetching services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-3">
            Available Services
          </h1>
          <p className="text-lg text-gray-600">
            Choose from our professional barber services
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-red-800 mb-1">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Services List */}
        {!loading && !error && (
          <>
            {services.length === 0 ? (
              <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 text-lg font-medium">
                  No services available yet
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Check back soon for available services
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
                  >
                    <div className="p-8 text-center">
                      {/* Service Name */}
                      <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {service.ServiceName || "Service"}
                        </h3>
                      </div>

                      {/* Rate */}
                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-3xl font-bold text-blue-600">
                          ₹{service.Rate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopServices;