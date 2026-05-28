import React, { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { addService } from '../Apis/Admin-Api';

interface AddServiceModalProps {
  shopId: string;
  onClose: () => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ shopId, onClose }) => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        shopId,
        ServiceName: serviceName,
        Rate: price, // schema expects String for Rate
        duration: Number(duration), // schema expects Number for duration
      };
      const response = await addService(payload);
      if (response?.success) {
        alert('Service added successfully');
        onClose();
      } else {
        setError(response?.message || 'Failed to add service');
      }
    } catch (err: any) {
      setError(err.message || 'Error adding service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 30 mins)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Service
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
