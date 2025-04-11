import React from 'react';
import { Group, Rect, Text } from 'react-konva';

const SectionToolbar = ({ x, y, onDelete, onEdit, onUploadImage, onAddText, onAddLink }) => {
  const buttonWidth = 30;
  const buttonHeight = 30;
  const buttonSpacing = 5;
  
  return (
    <Group x={x} y={y}>
      {/* Edit button */}
      <Group x={0} y={0} onClick={onEdit}>
        <Rect
          width={buttonWidth}
          height={buttonHeight}
          fill="#f3f4f6"
          stroke="#e5e7eb"
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          text="✎"
          x={0}
          y={0}
          width={buttonWidth}
          height={buttonHeight}
          fontSize={16}
          fontFamily="Arial"
          fill="#4b5563"
          align="center"
          verticalAlign="middle"
        />
      </Group>

      {/* Upload image button */}
      <Group x={0} y={buttonHeight + buttonSpacing} onClick={onUploadImage}>
        <Rect
          width={buttonWidth}
          height={buttonHeight}
          fill="#f3f4f6"
          stroke="#e5e7eb"
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          text="📷"
          x={0}
          y={0}
          width={buttonWidth}
          height={buttonHeight}
          fontSize={16}
          fontFamily="Arial"
          fill="#4b5563"
          align="center"
          verticalAlign="middle"
        />
      </Group>

      {/* Add text button */}
      <Group x={0} y={(buttonHeight + buttonSpacing) * 2} onClick={onAddText}>
        <Rect
          width={buttonWidth}
          height={buttonHeight}
          fill="#f3f4f6"
          stroke="#e5e7eb"
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          text="T"
          x={0}
          y={0}
          width={buttonWidth}
          height={buttonHeight}
          fontSize={16}
          fontFamily="Arial"
          fill="#4b5563"
          align="center"
          verticalAlign="middle"
        />
      </Group>

      {/* Add link button */}
      <Group x={0} y={(buttonHeight + buttonSpacing) * 3} onClick={onAddLink}>
        <Rect
          width={buttonWidth}
          height={buttonHeight}
          fill="#f3f4f6"
          stroke="#e5e7eb"
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          text="🔗"
          x={0}
          y={0}
          width={buttonWidth}
          height={buttonHeight}
          fontSize={16}
          fontFamily="Arial"
          fill="#4b5563"
          align="center"
          verticalAlign="middle"
        />
      </Group>

      {/* Delete button */}
      <Group x={0} y={(buttonHeight + buttonSpacing) * 4} onClick={onDelete}>
        <Rect
          width={buttonWidth}
          height={buttonHeight}
          fill="#fef2f2"
          stroke="#fee2e2"
          strokeWidth={1}
          cornerRadius={4}
        />
        <Text
          text="🗑"
          x={0}
          y={0}
          width={buttonWidth}
          height={buttonHeight}
          fontSize={16}
          fontFamily="Arial"
          fill="#ef4444"
          align="center"
          verticalAlign="middle"
        />
      </Group>
    </Group>
  );
};

export default SectionToolbar;
