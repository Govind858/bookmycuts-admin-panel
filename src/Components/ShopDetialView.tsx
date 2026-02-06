// src/pages/admin/ShopDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Globe,
  Phone,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Star,
  Save,
  X,
  Calendar,
  Scissors,
  Users,
  BookOpen,
} from 'lucide-react';
import { fetchShop, deleteShop, updateShop } from '../Apis/Admin-Api'; // adjust path

interface Shop {
  _id: string;
  ShopName: string;
  City: string;
  ExactLocation: string;
  ExactLocationCoord?: {
    type: string;
    coordinates: [number, number];
  };
  Mobile: number | string;
  Timing: string;
  website?: string;
  ShopOwnerId: string;
  IsPremium: boolean;
  createdAt: string;
  updatedAt: string;
  ProfileImage?: string;
  media?: any[];
}

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Shop>>({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No shop ID provided');
      setLoading(false);
      return;
    }

    const loadShop = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchShop(id);
        const data = response?.data || response;

        if (!data?.success || !data?.shop) {
          throw new Error(data?.message || 'Failed to fetch shop details');
        }

        setShop(data.shop);
        setFormData(data.shop); // initialize form with current data
      } catch (err: any) {
        console.error('Error loading shop:', err);
        setError(err.message || 'Could not load shop information');
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this shop? This action cannot be undone.')) return;

    setDeleting(true);
    try {
      const response = await deleteShop(id!);
      const data = response?.data || response;
      if (data?.success) {
        alert('Shop deleted successfully');
        navigate('/shops');
      } else {
        alert(data?.message || 'Failed to delete shop');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting shop');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    setUpdating(true);
    setUpdateError(null);

    try {
      // Prepare data – you might want to omit fields that shouldn't be updated
      const updateData = {
        ShopName: formData.ShopName,
        City: formData.City,
        ExactLocation: formData.ExactLocation,
        Mobile: formData.Mobile,
        Timing: formData.Timing,
        website: formData.website,
        // Add other updatable fields as needed
        // IsPremium: formData.IsPremium, // example if you want to allow changing premium status
      };

      const response = await updateShop(id, updateData);
      const data = response?.data || response;

      if (data?.success) {
        setShop((prev) => ({ ...prev, ...updateData }) as Shop);
        setIsEditing(false);
        alert('Shop updated successfully');
      } else {
        setUpdateError(data?.message || 'Failed to update shop');
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Error updating shop');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Shop not found'}</p>
          <button
            onClick={() => navigate('/shops')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/shops')}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Shop' : shop.ShopName}
              </h1>
              <p className="text-gray-600 mt-1">
                {shop.City} • ID: {shop._id.slice(-8)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {shop.IsPremium && (
              <div className="flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-full">
                <Star className="h-5 w-5 text-amber-600" fill="currentColor" />
                <span className="font-medium text-amber-800">Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{shop.ShopName}</h2>
                <p className="mt-2 text-blue-100 opacity-90">
                  {shop.ExactLocation}, {shop.City}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {isEditing ? (
              // ── Edit Form ──
              <form onSubmit={handleUpdate} className="space-y-6">
                {updateError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {updateError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      name="ShopName"
                      value={formData.ShopName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="City"
                      value={formData.City || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exact Location
                    </label>
                    <input
                      type="text"
                      name="ExactLocation"
                      value={formData.ExactLocation || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="Mobile"
                      value={formData.Mobile || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      name="Timing"
                      value={formData.Timing || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. 9:00 AM - 9:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // ── Display Mode ──
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {/* Shop Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Shop Information
                    </h3>
                    <div className="space-y-5">
                      <DetailItem icon={Building2} label="Shop Name" value={shop.ShopName} />
                      <DetailItem icon={MapPin} label="Location" value={`${shop.ExactLocation}, ${shop.City}`} />
                      <DetailItem icon={Clock} label="Working Hours" value={shop.Timing} />
                      <DetailItem icon={Phone} label="Mobile" value={shop.Mobile} />
                      {shop.website && (
                        <DetailItem
                          icon={Globe}
                          label="Website"
                          value={
                            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                              {shop.website}
                            </a>
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Account & Meta */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Account & Metadata
                    </h3>
                    <div className="space-y-5">
                      <DetailItem icon={Building2} label="Shop ID" value={shop._id} />
                      <DetailItem icon={Users} label="Owner ID" value={shop.ShopOwnerId} />
                      <DetailItem icon={Star} label="Premium Status" value={shop.IsPremium ? 'Yes (Premium)' : 'No'} />
                      <DetailItem
                        icon={Calendar}
                        label="Created"
                        value={new Date(shop.createdAt).toLocaleString('en-IN')}
                      />
                      <DetailItem
                        icon={Calendar}
                        label="Last Updated"
                        value={new Date(shop.updatedAt).toLocaleString('en-IN')}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-5 w-5" />
                    Edit Shop
                  </button>

                  <button
                    onClick={() => navigate(`/shop-booking/${id}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    View Bookings
                  </button>

                  <button
                    onClick={() => navigate(`/shop-barbers/${id}`)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    View Barbers
                  </button>

                  <button
                    onClick={() => navigate(`/shop-service/${id}`)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Scissors className="h-5 w-5" />
                    View Services
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">
                      Deleting this shop will permanently remove it from the system.
                    </p>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 ${
                        deleting ? 'cursor-wait' : ''
                      }`}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5" />
                          Delete Shop
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t px-6 py-5 flex justify-end">
            <button
              onClick={() => navigate('/shops')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple reusable detail item for display mode
const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number | React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <Icon className="h-6 w-6 text-gray-500 mt-1" />
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-base text-gray-900 mt-0.5">{value || '—'}</div>
    </div>
  </div>
);

export default ShopDetail;