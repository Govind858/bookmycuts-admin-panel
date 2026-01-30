// src/pages/admin/ShopOwnerDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
  Save,
  X,
  Store,
} from 'lucide-react';

import { fetchShopOwner, deleteShopOwner, updateShopOwner } from '../Apis/Admin-Api';

interface ShopOwner {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  city: string;
  role?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user: {
    owner: ShopOwner;
    shopId: string;
  };
}

const ShopOwnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [owner, setOwner] = useState<ShopOwner | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ShopOwner>>({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No shop owner ID provided');
      setLoading(false);
      return;
    }

    const loadOwner = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchShopOwner(id);
        const data: ApiResponse = response?.data || response;

        console.log('shop owner data in ShopOwnerDetail:', data);

        if (!data?.success || !data?.user?.owner) {
          throw new Error(data?.message || 'Failed to load shop owner details');
        }

        const ownerData = data.user.owner;

        setOwner(ownerData);
        setShopId(data.user.shopId || null);
        setFormData(ownerData); // initialize form with owner data
      } catch (err: any) {
        console.error('Error loading shop owner:', err);
        setError(err.message || 'Could not load shop owner information');
      } finally {
        setLoading(false);
      }
    };

    loadOwner();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this shop owner? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await deleteShopOwner(id!);
      const data = response?.data || response;

      if (data?.success) {
        alert('Shop owner deleted successfully');
        navigate('/admin/shop-owners');
      } else {
        alert(data?.message || 'Failed to delete shop owner');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting shop owner');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    setUpdating(true);
    setUpdateError(null);

    try {
      const updateData = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        mobileNo: formData.mobileNo?.trim(),
        email: formData.email?.trim(),
        city: formData.city?.trim(),
      };

      const response = await updateShopOwner(id, updateData);
      const data = response?.data || response;

      if (data?.success) {
        setOwner((prev) => ({ ...prev, ...updateData } as ShopOwner));
        setFormData(updateData);
        setIsEditing(false);
        alert('Shop owner updated successfully');
      } else {
        setUpdateError(data?.message || 'Failed to update shop owner');
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Error updating shop owner');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleViewShop = () => {
    if (shopId) {
      navigate(`/admin/shops/${shopId}`);
    } else {
      alert('No associated shop found for this owner.');
    }
  };

  const fullName = owner
    ? `${owner.firstName?.trim() || ''} ${owner.lastName?.trim() || ''}`.trim() || '—'
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading shop owner details...</p>
        </div>
      </div>
    );
  }

  if (error || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Trash2 className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Shop owner not found'}</p>
          <button
            onClick={() => navigate('/admin/shop-owners')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
               onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Shop Owner' : fullName}
              </h1>
              <p className="text-gray-600 mt-1">
                Shop Owner • ID: {owner._id?.slice(-8) || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {owner.role === 'shop' && (
              <div className="flex items-center gap-2 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-5 w-5 text-emerald-600" fill="currentColor" />
                <span className="font-medium text-emerald-800">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-10 sm:py-12 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{fullName}</h2>
                <p className="mt-2 text-indigo-100 opacity-90">{owner.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {isEditing ? (
              // Edit Form
              <form onSubmit={handleUpdate} className="space-y-6">
                {updateError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {updateError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNo"
                      value={formData.mobileNo || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
              // Display Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <User className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Full Name</div>
                        <div className="text-base text-gray-900 mt-0.5">{fullName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Email Address</div>
                        <div className="text-base text-gray-900 mt-0.5 break-all">{owner.email}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Mobile Number</div>
                        <div className="text-base text-gray-900 mt-0.5">{owner.mobileNo || '—'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">City / Location</div>
                        <div className="text-base text-gray-900 mt-0.5">{owner.city?.trim() || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Account Details
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <User className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">User ID</div>
                        <div className="text-base font-mono text-gray-800 mt-0.5 break-all">
                          {owner._id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Store className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Linked Shop ID</div>
                        <div className="text-base font-mono text-gray-800 mt-0.5 break-all">
                          {shopId || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <ShieldCheck className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Role</div>
                        <div className="text-base text-gray-900 mt-0.5 capitalize">
                          {owner.role || 'shop'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isEditing && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  Edit Details
                </button>

                <button
                  onClick={handleViewShop}
                  disabled={!shopId}
                  className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                    shopId
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Store className="h-5 w-5" />
                  {shopId ? 'View Shop' : 'No Shop Linked'}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 ${
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
                      Delete Account
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Danger Zone */}
            {!isEditing && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">
                    Deleting this shop owner will permanently remove their account and associated data.
                  </p>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      deleting ? 'cursor-wait' : ''
                    }`}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-5 w-5" />
                        Delete Shop Owner
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t px-6 py-5 flex justify-end">
            <button
              onClick={() => navigate(-1)}
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

export default ShopOwnerDetail;