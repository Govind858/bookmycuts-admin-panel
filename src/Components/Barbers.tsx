import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBarbersByShop } from "../Apis/Admin-Api";

const ShopBarbers = () => {
  const { shopId } = useParams();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBarbers = async () => {
      if (!shopId) {
        setError("Shop ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetchBarbersByShop(shopId);

        if (response?.success && Array.isArray(response.service)) {
          setBarbers(response.service);
        } else {
          setError(response?.message || "Failed to load barbers");
        }
      } catch (err) {
        setError("Failed to fetch barbers. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBarbers();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">
            Barbers
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Professional barbers working at this shop
          </p>
          {shopId && (
            <p className="mt-2 text-sm text-gray-500 font-mono">
              Shop ID: {shopId}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-blue-700 font-medium">Loading barbers...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-lg mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {barbers.length === 0 ? (
              <div className="bg-white shadow-lg rounded-xl p-12 text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  No barbers found
                </h3>
                <p className="text-gray-500">
                  This shop doesn't have any registered barbers yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {barbers.map((barber) => (
                  <div
                    key={barber._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    {/* Header strip */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        {barber.BarberName}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="space-y-5 flex-grow">
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            From
                          </p>
                          <p className="text-gray-900 font-medium text-lg mt-1">
                            {barber.From || "—"}
                          </p>
                        </div>

                        {/* You can add more fields here later (photo, contact, services, etc.) */}
                      </div>

                      {/* Footer info */}
                      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Added:</span>
                          <span>{new Date(barber.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Updated:</span>
                          <span>{new Date(barber.updatedAt).toLocaleDateString()}</span>
                        </div>
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

export default ShopBarbers;