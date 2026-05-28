import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllBarber, fetchBarbersByShop, updateBarber, deleteBarber } from '../Apis/Admin-Api';
import AddBarberModal from './AddBarberModal';
import { Plus, Edit, Trash2, X, Loader2, ArrowLeft } from 'lucide-react';

interface Barber {
  _id: string;
  BarberName: string;
  From: string;
  shopId: string;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBarbers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

const BarberList = () => {
  const { shopId } = useParams<{ shopId?: string }>();
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalBarbers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 10
  });

  // Modal Visibility State
  const [showAddBarber, setShowAddBarber] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editFrom, setEditFrom] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    loadBarbers(pagination.currentPage);
  }, [pagination.currentPage, shopId]);

  useEffect(() => {
    if (editingBarber) {
      setEditName(editingBarber.BarberName);
      setEditFrom(editingBarber.From);
      setEditError(null);
    }
  }, [editingBarber]);

  const loadBarbers = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let response: any;
      if (shopId) {
        response = await fetchBarbersByShop(shopId);
        if (response.success) {
          const barberList = response.service || [];
          setBarbers(barberList);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalBarbers: barberList.length,
            hasNextPage: false,
            hasPreviousPage: false,
            limit: pagination.limit
          });
        } else {
          setError(response.message || 'Failed to load shop barbers.');
        }
      } else {
        response = await fetchAllBarber(page, pagination.limit);
        if (response.success) {
          setBarbers(response.data.barbers);
          setPagination(response.data.pagination);
        } else {
          setError(response.message || 'Failed to load all barbers.');
        }
      }
    } catch (err) {
      setError('Failed to load barbers. Please try again.');
      console.error('Error loading barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleDeleteBarber = async (id: string, barberShopId: string) => {
    if (!window.confirm('Are you sure you want to delete this barber? This action cannot be undone.')) return;
    try {
      const response = await deleteBarber(id, barberShopId);
      if (response?.success) {
        alert('Barber deleted successfully');
        loadBarbers(pagination.currentPage);
      } else {
        alert(response?.message || 'Failed to delete barber');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting barber');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBarber) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const response = await updateBarber(editingBarber._id, {
        BarberName: editName,
        From: editFrom,
      });
      if (response?.success) {
        alert('Barber updated successfully');
        setEditingBarber(null);
        loadBarbers(pagination.currentPage);
      } else {
        setEditError(response?.message || 'Failed to update barber');
      }
    } catch (err: any) {
      setEditError(err.message || 'Error updating barber');
    } finally {
      setSavingEdit(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && barbers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
        <button
          onClick={() => loadBarbers(pagination.currentPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
          <h1 className="text-2xl font-bold text-gray-800">
            {shopId ? 'Shop Barbers' : 'Barbers Management'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total Barbers: <span className="font-semibold">{pagination.totalBarbers}</span>
          </div>
          {shopId && (
            <button
              onClick={() => setShowAddBarber(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Barber
            </button>
          )}
        </div>
      </div>

      {/* Barbers Grid */}
      {barbers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No barbers found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <div
                key={barber._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  {/* Barber Avatar/Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {barber.BarberName}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {barber._id.slice(-6)}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Barber Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm">{barber.From}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="text-sm">Shop ID: {barber.shopId.slice(-6)}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Joined: {formatDate(barber.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={() => setEditingBarber(barber)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber._id, barber.shopId)}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className={`px-4 py-2 rounded-lg ${
                  pagination.hasPreviousPage
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.currentPage - 1 &&
                      pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg ${
                          pagination.currentPage === pageNumber
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  if (
                    pageNumber === pagination.currentPage - 2 ||
                    pageNumber === pagination.currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg ${
                  pagination.hasNextPage
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Barber Modal */}
      {showAddBarber && shopId && (
        <AddBarberModal shopId={shopId} onClose={() => {
          setShowAddBarber(false);
          loadBarbers(pagination.currentPage);
        }} />
      )}

      {/* Edit Barber Modal */}
      {editingBarber && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditingBarber(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Barber</h2>
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barber Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From (Location/City/Address)</label>
                <input
                  type="text"
                  value={editFrom}
                  onChange={e => setEditFrom(e.target.value)}
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

export default BarberList;