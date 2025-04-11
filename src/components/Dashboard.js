import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoodboard } from '../contexts/MoodboardContext';
import MoodboardCard from './MoodboardCard';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { moodboards, loading, error, createMoodboard } = useMoodboard();
  const navigate = useNavigate();
  const [showNewMoodboardModal, setShowNewMoodboardModal] = useState(false);
  const [newMoodboardName, setNewMoodboardName] = useState('');

  const handleCreateMoodboard = async () => {
    if (newMoodboardName.trim()) {
      const moodboardId = await createMoodboard(newMoodboardName);
      setShowNewMoodboardModal(false);
      setNewMoodboardName('');
      
      if (moodboardId) {
        navigate(`/moodboard/${moodboardId}`);
      }
    }
  };

  const handleMoodboardClick = (id) => {
    navigate(`/moodboard/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Moodboards</h1>
        <button 
          onClick={() => setShowNewMoodboardModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> New Moodboard
        </button>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {moodboards.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl text-gray-600 mb-4">You don't have any moodboards yet</h2>
          <button 
            onClick={() => setShowNewMoodboardModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
          >
            Create your first moodboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {moodboards.map((moodboard) => (
            <MoodboardCard 
              key={moodboard.id} 
              moodboard={moodboard} 
              onClick={() => handleMoodboardClick(moodboard.id)} 
            />
          ))}
        </div>
      )}

      {/* New Moodboard Modal */}
      {showNewMoodboardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Moodboard</h2>
            <input
              type="text"
              placeholder="Moodboard Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              value={newMoodboardName}
              onChange={(e) => setNewMoodboardName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setShowNewMoodboardModal(false);
                  setNewMoodboardName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateMoodboard}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                disabled={!newMoodboardName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
