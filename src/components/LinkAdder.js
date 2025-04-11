import React, { useState } from 'react';
import { FiLink, FiX } from 'react-icons/fi';

const LinkAdder = ({ onSave, closeModal }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a full implementation, you might want to fetch the page title
      // from the URL or extract video thumbnail from YouTube URLs
      // For simplicity, we'll just use the URL as is
      
      const finalTitle = title.trim() || new URL(url).hostname;
      
      await onSave({
        type: 'link',
        content: finalTitle,
        src: url
      });
      
      closeModal();
    } catch (err) {
      console.error('Error adding link:', err);
      setError('Failed to add link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Link</h2>
        <button 
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          URL
        </label>
        <input
          type="url"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title (optional)
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Link title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-500">
          If left blank, we'll use the website domain as the title
        </p>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button 
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <FiLink className="mr-2" />
              Add Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkAdder;
