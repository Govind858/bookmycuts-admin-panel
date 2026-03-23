import React, { useState, useEffect } from 'react';
import { Palette, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fetchCustomization, updateCustomization } from '../Apis/Admin-Api';

const Customization = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Form State
  const [textColor, setTextColor] = useState('#ffffff');
  const [subTextColor, setSubTextColor] = useState('#9ca3af');
  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  
  // Image State
  const [backgroundImageStr, setBackgroundImageStr] = useState(''); // existing image url
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadCustomization();
  }, []);

  const loadCustomization = async () => {
    try {
      setLoading(true);
      const res = await fetchCustomization();
      // Assuming response.data or response directly has the fields
      const data = res?.customization || res?.data?.customization || res?.data || res;
      if (data) {
        if (data.textColor) setTextColor(data.textColor);
        if (data.subTextColor) setSubTextColor(data.subTextColor);
        if (data.backgroundColor) setBackgroundColor(data.backgroundColor);
        if (data.backgroundImage) setBackgroundImageStr(data.backgroundImage);
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
      setMessage({ text: 'Failed to load customization settings.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setBackgroundImageStr(''); // Reset existing string since we have a new file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', isError: false });

    try {
      const formData = new FormData();
      formData.append('textColor', textColor);
      formData.append('subTextColor', subTextColor);
      formData.append('backgroundColor', backgroundColor);
      
      if (imageFile) {
        formData.append('backgroundImage', imageFile);
      }

      await updateCustomization(formData);
      setMessage({ text: 'Customization settings saved successfully!', isError: false });
      
      // Clear file selection after successful upload as URL should be available later
      // The backend should ideally return the updated URL, but we can just reload
      setTimeout(() => {
        loadCustomization();
        setImageFile(null);
        setImagePreview(null);
        setMessage({ text: '', isError: false });
      }, 2000);

    } catch (error) {
      console.error('Error saving customization:', error);
      setMessage({ text: 'Failed to save customization settings.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <Palette size={32} className="text-blue-500" />
          Theme Customization
        </h1>
        <p className="text-slate-500 mt-2">
          Personalize the look and feel of the platform by adjusting colors and background images.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Colors Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Text Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 uppercase"
                  />
                </div>
              </div>

              {/* Sub Text Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Subtext Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={subTextColor}
                    onChange={(e) => setSubTextColor(e.target.value)}
                    className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={subTextColor}
                    onChange={(e) => setSubTextColor(e.target.value)}
                    className="flex-1 rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 uppercase"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Image Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">Background Image</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
                  {(imagePreview || backgroundImageStr) ? (
                    <img 
                      src={imagePreview || backgroundImageStr} 
                      alt="Background Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              
              {(imagePreview || backgroundImageStr) && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setBackgroundImageStr('');
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={loadCustomization}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset to current
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      {/* Live Preview (Optional, just to show how colors look) */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hidden md:block">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Live Component Preview</h3>
        </div>
        <div 
          className="p-6 flex justify-center items-center rounded-b-2xl" 
          style={{ 
            backgroundColor: backgroundColor, 
            ...(imagePreview || backgroundImageStr ? { backgroundImage: `url(${imagePreview || backgroundImageStr})` } : {}),
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            minHeight: '200px' 
          }}
        >
          <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <h4 className="text-xl font-bold mb-1" style={{ color: textColor }}>BookMyCuts Platform</h4>
            <p style={{ color: subTextColor }}>Experience the best grooming service</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Customization;
