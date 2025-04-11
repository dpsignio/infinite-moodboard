import React, { useState, useRef } from 'react';
import { Rect, Group, Text, Image } from 'react-konva';
import { useMoodboard } from '../contexts/MoodboardContext';
import MediaItem from './MediaItem';
import SectionToolbar from './SectionToolbar';

const SectionContainer = ({ section, onDragEnd }) => {
  const { updateSection, deleteSection, addMediaItem } = useMoodboard();
  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [size, setSize] = useState({ width: 400, height: 300 });
  const groupRef = useRef(null);
  
  const handleDragEnd = (e) => {
    const newPosition = { x: e.target.x(), y: e.target.y() };
    onDragEnd(section.id, newPosition);
    
    // Update in database
    updateSection(section.id, { position: newPosition });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const saveTitleChange = () => {
    if (title.trim()) {
      updateSection(section.id, { title });
      setIsEditing(false);
    } else {
      setTitle(section.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the section "${section.title}"? All media items in this section will be deleted.`)) {
      deleteSection(section.id);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (files, type) => {
    // Process files and add them as media items
    // Implementation would depend on your media handling logic
  };

  // Calculate layout for media items
  const calculateMediaLayout = () => {
    // This would implement a grid or masonry layout
    // For now, we'll just return placeholder positions
    return section.mediaItems.map((item, index) => ({
      ...item,
      position: {
        x: 10 + (index % 3) * 125,
        y: 50 + Math.floor(index / 3) * 125
      }
    }));
  };

  const mediaItemsWithLayout = calculateMediaLayout();

  return (
    <Group
      ref={groupRef}
      x={section.position?.x || 0}
      y={section.position?.y || 0}
      draggable
      onDragEnd={handleDragEnd}
      onClick={() => setIsSelected(true)}
      onTap={() => setIsSelected(true)}
      onMouseLeave={() => !isEditing && setIsSelected(false)}
    >
      {/* Section background */}
      <Rect
        width={size.width}
        height={size.height}
        fill="white"
        stroke={isSelected ? "#8b5cf6" : "#e5e7eb"}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.5}
      />

      {/* Section title */}
      <Text
        text={section.title}
        x={16}
        y={16}
        fontSize={18}
        fontFamily="Arial"
        fill="#1f2937"
        width={size.width - 32}
        ellipsis
        visible={!isEditing}
      />

      {/* Media items */}
      {mediaItemsWithLayout.map((item) => (
        <MediaItem
          key={item.id}
          item={item}
          position={item.position}
        />
      ))}

      {/* Toolbar (visible when selected) */}
      {isSelected && (
        <SectionToolbar
          x={size.width - 40}
          y={10}
          onDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
          onUploadImage={() => {}}
          onAddText={() => {}}
          onAddLink={() => {}}
        />
      )}
    </Group>
  );
};

export default SectionContainer;
