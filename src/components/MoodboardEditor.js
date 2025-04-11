import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMoodboard } from '../contexts/MoodboardContext';
import { Stage, Layer, Group } from 'react-konva';
import { FiArrowLeft, FiLayout } from 'react-icons/fi';
import { RiPinterestLine } from 'react-icons/ri';
import SectionContainer from './SectionContainer';
import ToolPanel from './ToolPanel';
import MediaUploader from './MediaUploader';
import TextEditor from './TextEditor';
import LinkAdder from './LinkAdder';
import PinterestImporter from './PinterestImporter';
import { createThumbnail } from '../utils/fileUtils';

const MoodboardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getMoodboard, 
    updateMoodboard, 
    createSection,
    updateSection, 
    getSections,
    getMediaItems,
    addMediaItem
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
  const [activeSection, setActiveSection] = useState(null);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showLinkAdder, setShowLinkAdder] = useState(false);
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);

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

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        stageRef.current.width(window.innerWidth);
        stageRef.current.height(window.innerHeight - 64); // Subtract header height
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Handle media upload
  const handleMediaUpload = async (mediaData) => {
    if (!activeSection) return;
    
    const mediaId = await addMediaItem(
      activeSection.id,
      mediaData.type,
      mediaData.content,
      mediaData.src,
      mediaData.position
    );
    
    if (mediaId) {
      // Update the sections state with the new media item
      setSections(sections.map(section => {
        if (section.id === activeSection.id) {
          return {
            ...section,
            mediaItems: [
              ...section.mediaItems,
              {
                id: mediaId,
                sectionId: activeSection.id,
                type: mediaData.type,
                content: mediaData.content,
                src: mediaData.src,
                position: mediaData.position
              }
            ]
          };
        }
        return section;
      }));
    }
  };

  // Handle text note addition
  const handleAddTextNote = async (content) => {
    if (!activeSection) return;
    
    await handleMediaUpload({
      type: 'text',
      content,
      src: null,
      position: { x: 0, y: 0 }
    });
  };

  // Handle link addition
  const handleAddLink = async (linkData) => {
    if (!activeSection) return;
    
    await handleMediaUpload({
      type: 'link',
      content: linkData.content,
      src: linkData.src,
      position: { x: 0, y: 0 }
    });
  };

  // Open media uploader for a specific section
  const openMediaUploader = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setActiveSection(section);
      setShowMediaUploader(true);
    }
  };

  // Open text editor for a specific section
  const openTextEditor = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setActiveSection(section);
      setShowTextEditor(true);
    }
  };

  // Open link adder for a specific section
  const openLinkAdder = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setActiveSection(section);
      setShowLinkAdder(true);
    }
  };

  // Update section positions after drag
  const handleSectionDragEnd = (sectionId, newPosition) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, position: newPosition } : section
    ));
    
    // Save the new position to the database
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      updateSection(sectionId, { position: newPosition });
    }
  };

  // Handle section deletion (callback for SectionContainer)
  const handleSectionDeleted = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  // Generate a thumbnail for the moodboard
  const generateThumbnail = async () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const thumbnail = await createThumbnail(dataURL);
      await updateMoodboard(id, { thumbnail });
      
      // Update the local state as well
      setMoodboard({
        ...moodboard,
        thumbnail
      });
    }
  };

  // Handle Pinterest import
  const handlePinterestImport = async (moodboardId, sectionId, pins) => {
    try {
      // In a real app, this would process the pins and add them as media items
      // For now, we'll just show an error
      setError('Pinterest integration is not fully implemented in this demo');
    } catch (err) {
      console.error('Error importing from Pinterest:', err);
      setError('Failed to import from Pinterest');
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
                  onDeleted={handleSectionDeleted}
                  onAddImage={() => openMediaUploader(section.id)}
                  onAddText={() => openTextEditor(section.id)}
                  onAddLink={() => openLinkAdder(section.id)}
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

      {/* Media Uploader Modal */}
      {showMediaUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <MediaUploader 
              onUpload={handleMediaUpload} 
              sectionId={activeSection?.id} 
              closeModal={() => {
                setShowMediaUploader(false);
                setActiveSection(null);
              }} 
            />
          </div>
        </div>
      )}

      {/* Text Editor Modal */}
      {showTextEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <TextEditor 
              onSave={handleAddTextNote} 
              closeModal={() => {
                setShowTextEditor(false);
                setActiveSection(null);
              }} 
            />
          </div>
        </div>
      )}

      {/* Link Adder Modal */}
      {showLinkAdder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <LinkAdder 
              onSave={handleAddLink} 
              closeModal={() => {
                setShowLinkAdder(false);
                setActiveSection(null);
              }} 
            />
          </div>
        </div>
      )}

      {/* Pinterest Modal */}
      {showPinterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <PinterestImporter 
              onImport={handlePinterestImport}
              moodboardId={id}
              closeModal={() => setShowPinterestModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodboardEditor;