import React, { useState, useEffect } from 'react';
import { Image, Text, Group, Rect } from 'react-konva';
import { useMoodboard } from '../contexts/MoodboardContext';

const MediaItem = ({ item, position }) => {
  const { updateMediaItem, deleteMediaItem } = useMoodboard();
  const [image, setImage] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [size, setSize] = useState({ width: 120, height: 120 });

  // Load image if the item is an image type
  useEffect(() => {
    if (item.type === 'image' && item.src) {
      const img = new window.Image();
      img.src = item.src;
      img.onload = () => {
        setImage(img);
        
        // Calculate appropriate size while maintaining aspect ratio
        const maxWidth = 120;
        const maxHeight = 120;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.floor(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.floor(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        setSize({ width, height });
      };
    }
  }, [item]);

  const handleDragEnd = (e) => {
    const newPosition = { x: e.target.x(), y: e.target.y() };
    updateMediaItem(item.id, { position: newPosition });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMediaItem(item.id);
    }
  };

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={() => setIsSelected(true)}
      onTap={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
    >
      {item.type === 'image' && image && (
        <Image
          image={image}
          width={size.width}
          height={size.height}
          stroke={isSelected ? "#8b5cf6" : null}
          strokeWidth={isSelected ? 2 : 0}
          cornerRadius={4}
        />
      )}
      
      {item.type === 'text' && (
        <Group>
          <Rect
            width={size.width}
            height={size.height}
            fill="#f9fafb"
            stroke={isSelected ? "#8b5cf6" : "#e5e7eb"}
            strokeWidth={isSelected ? 2 : 1}
            cornerRadius={4}
          />
          <Text
            text={item.content || 'Empty note'}
            x={5}
            y={5}
            width={size.width - 10}
            height={size.height - 10}
            fontSize={12}
            fontFamily="Arial"
            fill="#1f2937"
            padding={5}
            ellipsis
          />
        </Group>
      )}
      
      {item.type === 'link' && (
        <Group>
          <Rect
            width={size.width}
            height={40}
            fill="#f3f4f6"
            stroke={isSelected ? "#8b5cf6" : "#e5e7eb"}
            strokeWidth={isSelected ? 2 : 1}
            cornerRadius={4}
          />
          <Text
            text={item.content || 'Link'}
            x={5}
            y={5}
            width={size.width - 10}
            fontSize={12}
            fontFamily="Arial"
            fill="#2563eb"
            padding={5}
            ellipsis
          />
          <Text
            text={item.src || 'https://...'}
            x={5}
            y={22}
            width={size.width - 10}
            fontSize={10}
            fontFamily="Arial"
            fill="#6b7280"
            padding={5}
            ellipsis
          />
        </Group>
      )}
    </Group>
  );
};

export default MediaItem;
