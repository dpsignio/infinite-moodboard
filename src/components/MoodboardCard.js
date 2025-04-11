import React, { useState } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useMoodboard } from '../contexts/MoodboardContext';
import { format } from 'date-fns';

const MoodboardCard = ({ moodboard, onClick }) => {
  const { deleteMoodboard, updateMoodboard } = useMoodboard();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(moodboard.name);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${moodboard.name}"? This action cannot be undone.`)) {
      await deleteMoodboard(moodboard.id);
    }
    setShowMenu(false);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    if (editName.trim()) {
      await updateMoodboard(moodboard.id, { name: editName });
      setIsEditing(false);
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
    >
      {/* Thumbnail or placeholder */}
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {moodboard.thumbnail ? (
          <img 
            src={moodboard.thumbnail} 
            alt={moodboard.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-6xl text-gray-400 font-thin">
            {moodboard.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        {isEditing ? (
          <div onClick={handleInputClick}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  setEditName(moodboard.name);
                }}
                className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{moodboard.name}</h3>
            <button 
              onClick={handleMenuClick}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FiMoreVertical />
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(moodboard.createdAt), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Dropdown menu */}
      {showMenu && !isEditing && (
        <div 
          className="absolute right-2 top-12 w-36 bg-white shadow-lg rounded-md overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
          >
            <FiEdit2 className="mr-2" />
            Rename
          </button>
          <button 
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodboardCard;
