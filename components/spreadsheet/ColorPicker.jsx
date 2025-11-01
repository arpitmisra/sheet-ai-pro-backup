'use client';

import { useState } from 'react';
import { ChevronDown, Palette, Type } from 'lucide-react';

export default function ColorPicker({ 
  type = 'background', // 'background' or 'font'
  onColorSelect, 
  selectedColor = null,
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { name: 'None', value: 'transparent', hex: '#ffffff', border: true },
    { name: 'White', value: '#ffffff', hex: '#ffffff', border: true },
    { name: 'Light Gray', value: '#f8f9fa', hex: '#f8f9fa' },
    { name: 'Gray', value: '#e9ecef', hex: '#e9ecef' },
    { name: 'Dark Gray', value: '#6c757d', hex: '#6c757d' },
    { name: 'Black', value: '#212529', hex: '#212529' },
    { name: 'Red', value: '#dc3545', hex: '#dc3545' },
    { name: 'Orange', value: '#fd7e14', hex: '#fd7e14' },
    { name: 'Yellow', value: '#ffc107', hex: '#ffc107' },
    { name: 'Green', value: '#28a745', hex: '#28a745' },
    { name: 'Blue', value: '#007bff', hex: '#007bff' },
    { name: 'Indigo', value: '#6610f2', hex: '#6610f2' },
    { name: 'Purple', value: '#6f42c1', hex: '#6f42c1' },
    { name: 'Pink', value: '#e83e8c', hex: '#e83e8c' },
    { name: 'Light Red', value: '#f8d7da', hex: '#f8d7da' },
    { name: 'Light Orange', value: '#ffeaa7', hex: '#ffeaa7' },
    { name: 'Light Yellow', value: '#fff3cd', hex: '#fff3cd' },
    { name: 'Light Green', value: '#d4edda', hex: '#d4edda' },
    { name: 'Light Blue', value: '#cce5ff', hex: '#cce5ff' },
    { name: 'Light Purple', value: '#e2d9f3', hex: '#e2d9f3' },
  ];

  const handleColorSelect = (color) => {
    onColorSelect(color.value === 'transparent' ? null : color.value);
    setIsOpen(false);
  };

  const currentColor = selectedColor || (type === 'background' ? 'transparent' : '#000000');
  const icon = type === 'background' ? Palette : Type;
  const IconComponent = icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={`${type === 'background' ? 'Background' : 'Font'} color`}
      >
        <IconComponent size={14} className="text-gray-600" />
        <div 
          className={`w-4 h-4 rounded border ${
            currentColor === 'transparent' || !currentColor 
              ? 'bg-white border-gray-300' 
              : ''
          }`}
          style={{ 
            backgroundColor: currentColor === 'transparent' ? 'white' : currentColor,
            border: currentColor === 'transparent' ? '1px solid #d1d5db' : 'none'
          }}
        />
        <ChevronDown size={12} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Color Palette */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-64">
            <div className="mb-2">
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                {type === 'background' ? 'Background Color' : 'Font Color'}
              </h4>
              
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                      selectedColor === color.value 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : color.border 
                          ? 'border-gray-300' 
                          : 'border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: color.value === 'transparent' ? 'white' : color.value 
                    }}
                    title={color.name}
                  >
                    {color.value === 'transparent' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Color Input */}
            <div className="border-t border-gray-200 pt-2">
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Custom Color:
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  onChange={(e) => handleColorSelect({ value: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#000000"
                  onChange={(e) => {
                    if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                      handleColorSelect({ value: e.target.value });
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}