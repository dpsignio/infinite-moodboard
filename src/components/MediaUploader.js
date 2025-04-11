import React, { useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { fileToDataURL, validateFileType } from '../utils/fileUtils';

const MediaUploader = ({ onUpload, sectionId, closeModal }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFiles(newFiles);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      handleFiles(newFiles);
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      validateFileType(file, [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/webp',
        'text/plain',
        'text/markdown',
        'application/pdf'
      ])
    );
    
    if (validFiles.length !== newFiles.length) {
      setError('Some files were not added due to unsupported file types');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Process each file and add it to the section
      for (const file of files) {
        const dataUrl = await fileToDataURL(file);
        
        let type = 'text';
        let content = '';
        
        if (file.type.startsWith('image/')) {
          type = 'image';
          content = file.name;
        } else {
          // For text files, read the content
          const text = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsText(file);
          });
          content = text;
        }
        
        await onUpload({
          sectionId,
          type,
          content,
          src: dataUrl,
          position: { x: 0, y: 0 } // Initial position, will be laid out by the section
        });
      }
      
      closeModal();
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upload Media</h2>
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
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept="image/*, .txt, .md, .pdf"
          className="hidden"
        />
        
        <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="mb-2 text-gray-600">
          Drag and drop files here, or
          <button 
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-purple-600 hover:text-purple-800 ml-1"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Supported formats: JPEG, PNG, GIF, WEBP, TXT, MD, PDF
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Selected Files ({files.length})
          </h3>
          
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  {file.type.startsWith('image/') ? (
                    <div className="w-8 h-8 bg-gray-100 mr-2 flex items-center justify-center text-gray-400">
                      🖼️
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 mr-2 flex items-center justify-center text-gray-400">
                      📄
                    </div>
                  )}
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <button 
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          onClick={handleUpload}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          disabled={uploading || files.length === 0}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            'Upload Files'
          )}
        </button>
      </div>
    </div>
  );
};

export default MediaUploader;
