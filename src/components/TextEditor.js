import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const TextEditor = ({ initialContent = '', onSave, closeModal }) => {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      closeModal();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Text Note</h2>
        <button 
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>
      
      <textarea
        className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your note here..."
        autoFocus
      ></textarea>
      
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
          disabled={!content.trim()}
        >
          <FiSave className="mr-2" />
          Save Note
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
