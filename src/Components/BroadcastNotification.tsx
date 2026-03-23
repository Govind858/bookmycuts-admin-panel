import React, { useState, useEffect, useMemo } from 'react';
import { sendNotification, fetchAllUsers, fetchAllShopOwners } from '../Apis/Admin-Api';
import { Send, Bell, CheckCircle2, AlertCircle, Search, User as UserIcon } from 'lucide-react';

interface CombinedUser {
  _id: string;
  name: string;
  contact: string;
  role: string;
  type: 'User' | 'ShopOwner';
}

const BroadcastNotification: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<"ALL" | "ALL_USERS" | "ALL_SHOP_OWNERS" | "SPECIFIC">('ALL');
  
  const [allSelectableUsers, setAllSelectableUsers] = useState<CombinedUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch users and shop owners if SPECIFIC is selected
  useEffect(() => {
    if (audience === 'SPECIFIC' && allSelectableUsers.length === 0) {
      loadAllUsersAndOwners();
    }
  }, [audience]);

  const loadAllUsersAndOwners = async () => {
    setFetchingUsers(true);
    try {
      const usersData = await fetchAllUsers();
      const usersArray = Array.isArray(usersData) ? usersData : usersData?.users || usersData?.data || [];
      
      const mappedUsers: CombinedUser[] = usersArray.map((u: any) => ({
        _id: u._id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        contact: u.email || u.mobileNo || 'N/A',
        role: u.role || 'user',
        type: 'User'
      }));

      // For shop owners, let's fetch a large limit to allow selection
      const ownersResponse = await fetchAllShopOwners(1, 1000);
      const ownersData = ownersResponse?.data || ownersResponse;
      const ownersArray = ownersData.shopOwners || ownersData.data || [];
      
      const mappedOwners: CombinedUser[] = ownersArray.map((o: any) => ({
        _id: o._id,
        name: `${o.firstName || ''} ${o.lastName || ''}`.trim(),
        contact: o.email || o.mobileNo || 'N/A',
        role: o.role || 'shop owner',
        type: 'ShopOwner'
      }));

      const combined = [...mappedUsers, ...mappedOwners].sort((a, b) => a.name.localeCompare(b.name));
      setAllSelectableUsers(combined);
      
    } catch (err) {
      console.error("Failed to load users/owners for specific selection", err);
      setErrorMsg("Failed to load users for selection. Please try again.");
    } finally {
      setFetchingUsers(false);
    }
  };

  const filteredSelectableUsers = useMemo(() => {
    if (!searchTerm) return allSelectableUsers;
    const lower = searchTerm.toLowerCase();
    return allSelectableUsers.filter(u => 
      u.name.toLowerCase().includes(lower) || 
      u.contact.toLowerCase().includes(lower) ||
      u.role.toLowerCase().includes(lower)
    );
  }, [allSelectableUsers, searchTerm]);

  const toggleUserSelection = (id: string) => {
    const newPaths = new Set(selectedUserIds);
    if (newPaths.has(id)) {
      newPaths.delete(id);
    } else {
      newPaths.add(id);
    }
    setSelectedUserIds(newPaths);
  };

  const handleSelectAllFiltered = () => {
    const newPaths = new Set(selectedUserIds);
    filteredSelectableUsers.forEach(u => newPaths.add(u._id));
    setSelectedUserIds(newPaths);
  };

  const handleClearSelection = () => {
    setSelectedUserIds(new Set());
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!title.trim() || !message.trim()) {
      setErrorMsg("Title and Message are required.");
      return;
    }

    if (audience === 'SPECIFIC' && selectedUserIds.size === 0) {
      setErrorMsg("Please select at least one user for SPECIFIC audience.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: title.trim(),
        body: message.trim(),
        audience,
      };

      if (audience === 'SPECIFIC') {
        payload.userIds = Array.from(selectedUserIds);
      }

      const res = await sendNotification(payload);
      
      if (res.success || res.message) {
        setSuccessMsg(res.message || "Notification sent successfully.");
        // Reset form
        setTitle('');
        setMessage('');
        setSelectedUserIds(new Set());
        setSearchTerm('');
      } else {
        throw new Error(res.message || "Failed to send notification.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || err.message || "An error occurred while sending notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="text-indigo-600" size={32} />
            Broadcast Notifications
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Send push notifications and alerts to your users and shop owners.
          </p>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
            <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-green-800 font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-800 font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className={`col-span-1 ${audience === 'SPECIFIC' ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <form onSubmit={handleSend} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="space-y-6">
                
                {/* Audience Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Target Audience
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'ALL', label: 'Everyone', desc: 'All users & owners' },
                      { id: 'ALL_USERS', label: 'All Users', desc: 'Regular users only' },
                      { id: 'ALL_SHOP_OWNERS', label: 'All Shop Owners', desc: 'Shop admins only' },
                      { id: 'SPECIFIC', label: 'Specific', desc: 'Select manually' },
                    ].map(opt => (
                      <label 
                        key={opt.id}
                        className={`
                          relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200
                          ${audience === opt.id 
                            ? 'border-indigo-600 bg-indigo-50/50' 
                            : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input 
                          type="radio"
                          name="audience"
                          value={opt.id}
                          checked={audience === opt.id}
                          onChange={(e) => setAudience(e.target.value as any)}
                          className="sr-only"
                        />
                        <span className={`font-semibold text-sm ${audience === opt.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-xs mt-1 ${audience === opt.id ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {opt.desc}
                        </span>
                        {audience === opt.id && (
                          <div className="absolute top-4 right-4 text-indigo-600">
                            <CheckCircle2 size={16} className="fill-indigo-100" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Weekend Special Offer!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message Body
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Write your notification message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-y"
                  />
                  <p className="mt-2 text-xs text-gray-500 text-right">
                    {message.length} characters
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading || (audience === 'SPECIFIC' && selectedUserIds.size === 0)}
                    className={`
                      w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all
                      ${loading || (audience === 'SPECIFIC' && selectedUserIds.size === 0)
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Notification
                        {audience === 'SPECIFIC' && selectedUserIds.size > 0 && ` to ${selectedUserIds.size} users`}
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>
          </div>

          {/* Specific User Selection Sidebar */}
          {audience === 'SPECIFIC' && (
            <div className="col-span-1 lg:col-span-5 flex flex-col h-auto max-h-[800px]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <UserIcon size={18} className="text-gray-500" />
                      Select Recipients
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {selectedUserIds.size} Selected
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                  
                  <div className="flex justify-between mt-3 text-xs">
                    <button 
                      onClick={handleSelectAllFiltered}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Select All Visible
                    </button>
                    <button 
                      onClick={handleClearSelection}
                      type="button"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 bg-white">
                  {fetchingUsers ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : filteredSelectableUsers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">
                      No users found matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredSelectableUsers.map(user => {
                        const isSelected = selectedUserIds.has(user._id);
                        return (
                          <div 
                            key={user._id}
                            onClick={() => toggleUserSelection(user._id)}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border
                              ${isSelected 
                                ? 'bg-indigo-50 border-indigo-200' 
                                : 'border-transparent hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className="pt-0.5">
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // handled by div click
                                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate flex items-center justify-between">
                                <span>{user.contact}</span>
                                <span className={`uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded-sm ${user.type === 'ShopOwner' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {user.type === 'ShopOwner' ? 'Owner' : 'User'}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastNotification;
