import React, { useState, useRef, useEffect } from 'react';
import { Rect, Group, Text } from 'react-konva';
import { useMoodboard } from '../contexts/MoodboardContext';
import MediaItem from './MediaItem';
import SectionToolbar from './SectionToolbar';

const SectionContainer = ({ 
  section, 
  onDragEnd, 
  onDeleted,
  onAddImage,
  onAddText,
  onAddLink
}) => {
  const { updateSection, deleteSection } = useMoodboard();
  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [size, setSize] = useState({ width: 400, height: 300 });
  const groupRef = useRef(null);
  
  const handleDragEnd = (e) => {
    const newPosition = { x: e.target.x(), y: e.target.y() };
    onDragEnd(section.id, newPosition);
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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the section "${section.title}"? All media items in this section will be deleted.`)) {
      await deleteSection(section.id);
      if (onDeleted) {
        onDeleted(section.id);
      }
    }
  };

  // Calculate layout for media items
  const calculateMediaLayout = () => {
    if (!section.mediaItems || section.mediaItems.length === 0) {
      return [];
    }
    
    // Simple grid layout for media items
    const itemWidth = 120;
    const itemHeight = 120;
    const padding = 10;
    const startY = 60; // Space for title
    const itemsPerRow = Math.floor((size.width - padding * 2) / (itemWidth + padding));
    
    return section.mediaItems.map((item, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      return {
        ...item,
        position: {
          x: padding + col * (itemWidth + padding),
          y: startY + row * (itemHeight + padding)
        }
      };
    });
  };

  const mediaItemsWithLayout = calculateMediaLayout();

  // Dynamically adjust section height based on content
  useEffect(() => {
    if (mediaItemsWithLayout.length > 0) {
      const lastItem = mediaItemsWithLayout[mediaItemsWithLayout.length - 1];
      const contentHeight = lastItem.position.y + 120 + 20; // item height + bottom padding
      const minHeight = 300;
      
      setSize({
        width: 400,
        height: Math.max(minHeight, contentHeight)
      });
    }
  }, [mediaItemsWithLayout]);

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
      {isEditing ? (
        <Group>
          <Rect
            x={10}
            y={10}
            width={size.width - 20}
            height={36}
            fill="#f9fafb"
            stroke="#8b5cf6"
            strokeWidth={2}
            cornerRadius={4}
          />
          <Text
            text={title}
            x={16}
            y={16}
            fontSize={18}
            fontFamily="Arial"
            fill="#1f2937"
            width={size.width - 32}
            onDblClick={() => setIsEditing(true)}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Group x={size.width - 80} y={14}>
            <Rect
              width={30}
              height={24}
              fill="#f3f4f6"
              stroke="#e5e7eb"
              strokeWidth={1}
              cornerRadius={4}
              onClick={() => {
                setIsEditing(false);
                setTitle(section.title);
              }}
            />
            <Text
              text="Cancel"
              fontSize={10}
              fontFamily="Arial"
              fill="#4b5563"
              width={30}
              height={24}
              align="center"
              verticalAlign="middle"
              onClick={() => {
                setIsEditing(false);
                setTitle(section.title);
              }}
            />
            <Rect
              x={35}
              width={30}
              height={24}
              fill="#8b5cf6"
              cornerRadius={4}
              onClick={saveTitleChange}
            />
            <Text
              x={35}
              text="Save"
              fontSize={10}
              fontFamily="Arial"
              fill="white"
              width={30}
              height={24}
              align="center"
              verticalAlign="middle"
              onClick={saveTitleChange}
            />
          </Group>
        </Group>
      ) : (
        <Text
          text={section.title}
          x={16}
          y={16}
          fontSize={18}
          fontFamily="Arial"
          fill="#1f2937"
          width={size.width - 32}
          onDblClick={() => setIsEditing(true)}
        />
      )}

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
          onUploadImage={onAddImage}
          onAddText={onAddText}
          onAddLink={onAddLink}
        />
      )}
    </Group>
  );
};

export default SectionContainer;