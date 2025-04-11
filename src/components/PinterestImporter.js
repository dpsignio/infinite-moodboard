import React, { useState } from 'react';
import { RiPinterestLine } from 'react-icons/ri';
import { FiExternalLink, FiX } from 'react-icons/fi';
import { authenticatePinterest, fetchPinterestBoards, fetchPinsFromBoard } from '../utils/pinterestApi';

const PinterestImporter = ({ onImport, moodboardId, sectionId, closeModal }) => {
  const [status, setStatus] = useState('initial'); // 'initial', 'authenticating', 'authenticated', 'loading', 'error'
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPins, setSelectedPins] = useState([]);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setStatus('authenticating');
    setError(null);
    
    try {
      const authResult = await authenticatePinterest();
      
      if (authResult.success) {
        setStatus('authenticated');
        const boardsResult = await fetchPinterestBoards(authResult.accessToken);
        
        if (boardsResult.success) {
          setBoards(boardsResult.boards);
        } else {
          throw new Error(boardsResult.message);
        }
      } else {
        throw new Error(authResult.message);
      }
    } catch (err) {
      console.error('Pinterest connection error:', err);
      setError(err.message || 'Failed to connect to Pinterest');
      setStatus('error');
    }
  };

  const handleSelectBoard = async (board) => {
    setSelectedBoard(board);
    setStatus('loading');
    setError(null);
    
    try {
      const pinsResult = await fetchPinsFromBoard(null, board.id);
      
      if (pinsResult.success) {
        setPins(pinsResult.pins);
        setStatus('authenticated');
      } else {
        throw new Error(pinsResult.message);
      }
    } catch (err) {
      console.error('Error fetching pins:', err);
      setError(err.message || 'Failed to fetch pins');
      setStatus('error');
    }
  };

  const togglePinSelection = (pin) => {
    if (selectedPins.some(p => p.id === pin.id)) {
      setSelectedPins(selectedPins.filter(p => p.id !== pin.id));
    } else {
      setSelectedPins([...selectedPins, pin]);
    }
  };

  const handleImport = async () => {
    if (selectedPins.length === 0) return;
    
    setStatus('loading');
    setError(null);
    
    try {
      await onImport(moodboardId, sectionId, selectedPins);
      closeModal();
    } catch (err) {
      console.error('Error importing pins:', err);
      setError(err.message || 'Failed to import pins');
      setStatus('error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Import from Pinterest</h2>
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
      
      <div className="text-center py-6">
        <RiPinterestLine className="mx-auto text-red-600 mb-2" size={48} />
        <h3 className="text-lg font-semibold mb-2">Connect to Pinterest</h3>
        <p className="text-gray-600 mb-4">
          In this demo version, Pinterest integration is not fully implemented.
        </p>
        
        <button 
          onClick={handleConnect}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center mx-auto"
          disabled={status === 'authenticating' || status === 'loading'}
        >
          {status === 'authenticating' || status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <RiPinterestLine className="mr-2" />
              Connect to Pinterest
            </>
          )}
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            To implement Pinterest integration in a real app, you would need to:
          </p>
          <ol className="list-decimal list-inside text-left mt-2">
            <li>Register your app with Pinterest Developer Platform</li>
            <li>Implement OAuth flow for authentication</li>
            <li>Use the Pinterest API to fetch boards and pins</li>
          </ol>
          <p className="mt-2">
            <a 
              href="https://developers.pinterest.com/docs/getting-started/introduction/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center mt-2"
            >
              Pinterest Developer Documentation
              <FiExternalLink className="ml-1" size={14} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinterestImporter;
