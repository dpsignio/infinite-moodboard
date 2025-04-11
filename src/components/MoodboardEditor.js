import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMoodboard } from '../contexts/MoodboardContext';
import { Stage, Layer, Group } from 'react-konva';
import { FiArrowLeft, FiPlus, FiImage, FiFileText, FiLink, FiLayout } from 'react-icons/fi';
import { RiPinterestLine } from 'react-icons/ri';
import SectionContainer from './SectionContainer';
import ToolPanel from './ToolPanel';
import { fileToDataURL, createThumbnail } from '../utils/fileUtils';

const MoodboardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getMoodboard, 
    updateMoodboard, 
    createSection, 
    getSections,
    getMediaItems,
    importFromPinterest
  } = useMoodboard();
  
  const [moodboard, setMoodboard] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showPinterestModal, setShowPinterestModal] = useState(false);
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  // Load moodboard data
  useEffect(() => {
    const loadMoodboardData = async () => {
      try {
        const moodboardData = await getMoodboard(id);
        if (moodboardData) {
          setMoodboard(moodboardData);
          
          // Load sections
          const sectionsData = await getSections(id);
          
          // Load media items for each section
          const sectionsWithMedia = await Promise.all(
            sectionsData.map(async (section) => {
              const mediaItems = await getMediaItems(section.id);
              return { ...section, mediaItems };
            })
          );
          
          setSections(sectionsWithMedia);
        } else {
          setError('Moodboard not found');
        }
      } catch (err) {
        console.error('Error loading moodboard:', err);
        setError('Failed to load moodboard');
      } finally {
        setLoading(false);
      }
    };

    loadMoodboardData();
  }, [id, getMoodboard, getSections, getMediaItems]);

  // Handle zoom and pan
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    const oldScale = scale;
    
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };
    
    // Handle zoom
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.max(0.1, Math.min(newScale, 5)); // Limit scale between 0.1 and 5
    
    setScale(limitedScale);
    
    // Calculate new position
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };
    
    setPosition(newPos);
  };

  // Create a new section
  const handleCreateSection = async () => {
    if (newSectionTitle.trim()) {
      // Find a good position for the new section
      // Simple algorithm: place new sections in a grid-like pattern
      const sectionWidth = 400;
      const sectionHeight = 300;
      const gridColumns = 3;
      
      const sectionCount = sections.length;
      const row = Math.floor(sectionCount / gridColumns);
      const column = sectionCount % gridColumns;
      
      const position = {
        x: column * (sectionWidth + 30),
        y: row * (sectionHeight + 30)
      };
      
      const sectionId = await createSection(id, newSectionTitle, position);
      
      if (sectionId) {
        setSections([...sections, {
          id: sectionId,
          moodboardId: id,
          title: newSectionTitle,
          position,
          mediaItems: []
        }]);
      }
      
      setShowAddSectionModal(false);
      setNewSectionTitle('');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e, sectionId) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process files and add them as media items
      // This would be implemented in your context
    }
  };

  // Update section positions after drag
  const handleSectionDragEnd = (sectionId, newPosition) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, position: newPosition } : section
    ));
    
    // Save the new position to the database in the real implementation
  };

  // Generate a thumbnail for the moodboard
  const generateThumbnail = async () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const thumbnail = await createThumbnail(dataURL);
      await updateMoodboard(id, { thumbnail });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{moodboard?.name || 'Untitled'}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowAddSectionModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FiLayout className="mr-2" /> Add Section
          </button>
          <button 
            onClick={() => setShowPinterestModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <RiPinterestLine className="mr-2" /> Import from Pinterest
          </button>
        </div>
      </div>

      {/* Main canvas area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 64} // Subtract header height
          onWheel={handleWheel}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDragMove={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
        >
          <Layer>
            {sections.map((section) => (
              <Group key={section.id}>
                <SectionContainer
                  section={section}
                  onDragEnd={handleSectionDragEnd}
                />
              </Group>
            ))}
          </Layer>
        </Stage>

        {/* Tools panel */}
        <ToolPanel 
          scale={scale} 
          setScale={setScale} 
          resetPosition={() => setPosition({ x: 0, y: 0 })}
          generateThumbnail={generateThumbnail}
        />
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Section</h2>
            <input
              type="text"
              placeholder="Section Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setShowAddSectionModal(false);
                  setNewSectionTitle('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSection}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                disabled={!newSectionTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pinterest Modal */}
      {showPinterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import from Pinterest</h2>
            <p className="mb-4 text-gray-600">
              Pinterest integration is not implemented in this demo version.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowPinterestModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
        multiple
      />
      <input 
        type="file" 
        ref={textInputRef} 
        style={{ display: 'none' }} 
        accept=".txt,.md,.pdf"
        onChange={(e) => handleFileUpload(e)}
        multiple
      />
    </div>
  );
};

export default MoodboardEditor;
