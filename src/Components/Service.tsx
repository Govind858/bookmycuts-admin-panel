import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchServiceByShop, editService, deleteService } from "../Apis/Admin-Api";
import AddServiceModal from './AddServiceModal';
import { Plus, Edit, Trash2, X, Loader2, ArrowLeft } from 'lucide-react';

const ShopServices = () => {
  const { shopId } = useParams<{ shopId?: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Visibility State
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  useEffect(() => {
    loadServices();
  }, [shopId]);

  useEffect(() => {
    if (editingService) {
      setEditName(editingService.ServiceName || '');
      setEditRate(editingService.Rate || '');
      setEditDuration(editingService.duration ? String(editingService.duration) : '');
      setEditError(null);
    }
  }, [editingService]);

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;
    try {
      const response = await deleteService(id);
      if (response?.success) {
        alert("Service deleted successfully");
        loadServices();
      } else {
        alert(response?.message || "Failed to delete service");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting service");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const response = await editService(editingService._id, {
        ServiceName: editName,
        Rate: editRate,
        duration: Number(editDuration),
      });
      if (response?.success) {
        alert("Service updated successfully");
        setEditingService(null);
        loadServices();
      } else {
        setEditError(response?.message || "Failed to update service");
      }
    } catch (err: any) {
      setEditError(err.message || "Error updating service");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-3">
            {shopId && (
              <button
                onClick={() => navigate(`/admin/shops/${shopId}`)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Back to Shop Detail"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Available Services
              </h1>
              <p className="text-gray-600 mt-1">
                Manage shop's professional services
              </p>
            </div>
          </div>
          {shopId && (
            <button
              onClick={() => setShowAddService(true)}
              className="self-start md:self-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Service
            </button>
          )}
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
                  Add some professional services to show here
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300 flex flex-col justify-between"
                  >
                    <div className="p-6 text-center flex-grow">
                      {/* Service Name */}
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {service.ServiceName || "Service"}
                        </h3>
                        {service.duration && (
                          <span className="inline-block mt-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                            {service.duration} mins
                          </span>
                        )}
                      </div>

                      {/* Rate */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{service.Rate}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 border-t border-gray-100 p-4 flex gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddService && shopId && (
        <AddServiceModal shopId={shopId} onClose={() => {
          setShowAddService(false);
          loadServices();
        }} />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (Price)</label>
                <input
                  type="number"
                  value={editRate}
                  onChange={e => setEditRate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={e => setEditDuration(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingEdit}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopServices;