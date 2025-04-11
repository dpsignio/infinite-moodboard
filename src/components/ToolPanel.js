import React from 'react';
import { FiMinus, FiPlus, FiMaximize, FiCamera } from 'react-icons/fi';

const ToolPanel = ({ scale, setScale, resetPosition, generateThumbnail }) => {
  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.1));
  };

  const handleReset = () => {
    setScale(1);
    resetPosition();
  };

  const handleSaveThumbnail = () => {
    generateThumbnail();
  };

  return (
    <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-2 flex flex-col">
      <button 
        onClick={handleZoomIn}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Zoom In"
      >
        <FiPlus size={20} />
      </button>
      
      <div className="text-center py-1 text-sm text-gray-600">
        {Math.round(scale * 100)}%
      </div>
      
      <button 
        onClick={handleZoomOut}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Zoom Out"
      >
        <FiMinus size={20} />
      </button>
      
      <div className="my-1 border-t border-gray-200"></div>
      
      <button 
        onClick={handleReset}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Reset View"
      >
        <FiMaximize size={20} />
      </button>
      
      <div className="my-1 border-t border-gray-200"></div>
      
      <button 
        onClick={handleSaveThumbnail}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Save as Thumbnail"
      >
        <FiCamera size={20} />
      </button>
    </div>
  );
};

export default ToolPanel;
