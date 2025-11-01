'use client';

import { useState } from 'react';
import { useSpreadsheetStore } from '@/store/spreadsheetStore';
import ColorPicker from './ColorPicker';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette
} from 'lucide-react';

export default function CellFormatting() {
  const { selectedCell, cells, updateCellFormat } = useSpreadsheetStore();
  
  if (!selectedCell) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500">
        Select a cell to format
      </div>
    );
  }

  const cellData = cells[selectedCell];
  const formatting = cellData?.formatting || {};

  const handleBackgroundColor = (color) => {
    updateCellFormat(selectedCell, { backgroundColor: color });
  };

  const handleFontColor = (color) => {
    updateCellFormat(selectedCell, { color: color });
  };

  const handleBold = () => {
    updateCellFormat(selectedCell, { 
      fontWeight: formatting.fontWeight === 'bold' ? 'normal' : 'bold' 
    });
  };

  const handleItalic = () => {
    updateCellFormat(selectedCell, { 
      fontStyle: formatting.fontStyle === 'italic' ? 'normal' : 'italic' 
    });
  };

  const handleUnderline = () => {
    updateCellFormat(selectedCell, { 
      textDecoration: formatting.textDecoration === 'underline' ? 'none' : 'underline' 
    });
  };

  const handleAlignment = (align) => {
    updateCellFormat(selectedCell, { textAlign: align });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-3">
        {/* Cell Reference */}
        <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
          <span className="text-xs font-medium text-gray-600">Formatting:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
            {selectedCell}
          </span>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
          <button
            onClick={handleBold}
            className={`p-1.5 rounded transition-colors ${
              formatting.fontWeight === 'bold' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            onClick={handleItalic}
            className={`p-1.5 rounded transition-colors ${
              formatting.fontStyle === 'italic' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            onClick={handleUnderline}
            className={`p-1.5 rounded transition-colors ${
              formatting.textDecoration === 'underline' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Underline"
          >
            <Underline size={14} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
          <button
            onClick={() => handleAlignment('left')}
            className={`p-1.5 rounded transition-colors ${
              formatting.textAlign === 'left' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Left"
          >
            <AlignLeft size={14} />
          </button>
          <button
            onClick={() => handleAlignment('center')}
            className={`p-1.5 rounded transition-colors ${
              formatting.textAlign === 'center' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Center"
          >
            <AlignCenter size={14} />
          </button>
          <button
            onClick={() => handleAlignment('right')}
            className={`p-1.5 rounded transition-colors ${
              formatting.textAlign === 'right' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align Right"
          >
            <AlignRight size={14} />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2">
          <ColorPicker
            type="font"
            onColorSelect={handleFontColor}
            selectedColor={formatting.color}
          />
          <ColorPicker
            type="background"
            onColorSelect={handleBackgroundColor}
            selectedColor={formatting.backgroundColor}
          />
        </div>

        {/* Clear Formatting */}
        <button
          onClick={() => updateCellFormat(selectedCell, {
            backgroundColor: null,
            color: null,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left'
          })}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          title="Clear Formatting"
        >
          Clear Format
        </button>
      </div>
    </div>
  );
}