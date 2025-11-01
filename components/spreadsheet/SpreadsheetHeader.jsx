'use client';

import { useState, useRef } from 'react';
import { useSpreadsheetStore } from '@/store/spreadsheetStore';
import QuickToolbar from './QuickToolbar';
import {
  FileText,
  Edit3,
  Plus,
  Palette,
  Database,
  Settings,
  Puzzle,
  Download,
  Upload,
  Copy,
  Scissors,
  ClipboardPaste,
  Undo,
  Redo,
  Search,
  RotateCcw,
  Eye,
  ChevronDown,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  PaintBucket,
  Grid,
  Filter,
  BarChart3,
  Calculator,
  Share2,
  MessageCircle
} from 'lucide-react';

export default function SpreadsheetHeader({ 
  sheet, 
  onTitleChange, 
  onShareClick, 
  onChatToggle, 
  editingTitle, 
  setEditingTitle, 
  title, 
  setTitle 
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { cells, selectedCell, addRow, addColumn, clearCells, updateCell } = useSpreadsheetStore();
  const fileInputRef = useRef(null);

  // Helper function to parse cell reference to get row/col indices
  const parseCellReference = (ref) => {
    if (!ref) return { row: 0, col: 0 };
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) return { row: 0, col: 0 };
    
    let col = 0;
    const letter = match[1];
    for (let i = 0; i < letter.length; i++) {
      col = col * 26 + letter.charCodeAt(i) - 64;
    }
    col = col - 1;
    
    return {
      col: col,
      row: parseInt(match[2], 10) - 1,
    };
  };

  const currentCell = selectedCell ? parseCellReference(selectedCell) : { row: 0, col: 0 };

  const handleDownloadCSV = () => {
    const store = useSpreadsheetStore.getState();
    const cellEntries = Object.entries(store.cells);
    
    if (cellEntries.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Find max row and column
    let maxRow = 0;
    let maxCol = 0;
    
    cellEntries.forEach(([cellRef, cell]) => {
      if (cell.row !== undefined && cell.col !== undefined) {
        maxRow = Math.max(maxRow, cell.row);
        maxCol = Math.max(maxCol, cell.col);
      }
    });
    
    let csvContent = '';
    
    for (let row = 0; row <= maxRow; row++) {
      const rowData = [];
      for (let col = 0; col <= maxCol; col++) {
        // Find cell with matching row/col
        const cellEntry = cellEntries.find(([ref, cell]) => 
          cell.row === row && cell.col === col
        );
        
        const cellValue = cellEntry ? (cellEntry[1].value || '') : '';
        // Escape quotes and wrap in quotes if contains comma or quote
        const escapedValue = cellValue.toString().includes(',') || cellValue.toString().includes('"') 
          ? `"${cellValue.toString().replace(/"/g, '""')}"` 
          : cellValue.toString();
        rowData.push(escapedValue);
      }
      csvContent += rowData.join(',') + '\n';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${sheet?.title || 'spreadsheet'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      
      // Clear existing data
      clearCells();
      
      // Helper function to convert column index to letter
      const colToLetter = (col) => {
        let letter = '';
        while (col >= 0) {
          letter = String.fromCharCode((col % 26) + 65) + letter;
          col = Math.floor(col / 26) - 1;
        }
        return letter;
      };
      
      lines.forEach((line, rowIndex) => {
        if (line.trim()) {
          const values = line.split(',');
          values.forEach((value, colIndex) => {
            // Remove quotes from CSV values
            const cleanValue = value.replace(/^"|"$/g, '').replace(/""/g, '"');
            if (cleanValue) {
              // Convert row/col to cell reference
              const colLetter = colToLetter(colIndex);
              const cellRef = `${colLetter}${rowIndex + 1}`;
              updateCell(cellRef, cleanValue);
            }
          });
        }
      });
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const menuItems = {
    file: [
      { label: 'New', icon: Plus, action: () => window.open('/dashboard', '_blank') },
      { label: 'Import CSV', icon: Upload, action: () => fileInputRef.current?.click() },
      { label: 'Download as CSV', icon: Download, action: handleDownloadCSV },
      { label: 'Share', icon: Share2, action: onShareClick },
    ],
    edit: [
      { label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z' },
      { label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y' },
      { label: 'Cut', icon: Scissors, shortcut: 'Ctrl+X' },
      { label: 'Copy', icon: Copy, shortcut: 'Ctrl+C' },
      { label: 'Paste', icon: ClipboardPaste, shortcut: 'Ctrl+V' },
      { label: 'Find and replace', icon: Search, shortcut: 'Ctrl+H' },
    ],
    view: [
      { label: 'Freeze rows', icon: Grid },
      { label: 'Freeze columns', icon: Grid },
      { label: 'Show formulas', icon: Calculator },
      { label: 'Zoom', icon: Eye },
    ],
    insert: [
      { label: 'Row above', icon: Plus, action: () => addRow(currentCell.row) },
      { label: 'Row below', icon: Plus, action: () => addRow(currentCell.row + 1) },
      { label: 'Column left', icon: Plus, action: () => addColumn(currentCell.col) },
      { label: 'Column right', icon: Plus, action: () => addColumn(currentCell.col + 1) },
      { label: 'Chart', icon: BarChart3 },
      { label: 'Image', icon: FileText },
    ],
    format: [
      { label: 'Bold', icon: Bold, shortcut: 'Ctrl+B' },
      { label: 'Italic', icon: Italic, shortcut: 'Ctrl+I' },
      { label: 'Underline', icon: Underline, shortcut: 'Ctrl+U' },
      { label: 'Text color', icon: Type },
      { label: 'Fill color', icon: PaintBucket },
      { label: 'Align left', icon: AlignLeft },
      { label: 'Align center', icon: AlignCenter },
      { label: 'Align right', icon: AlignRight },
      { label: 'Number format', icon: Calculator },
    ],
    data: [
      { label: 'Sort range', icon: Filter },
      { label: 'Create filter', icon: Filter },
      { label: 'Data validation', icon: Database },
      { label: 'Pivot table', icon: Grid },
    ],
    tools: [
      { label: 'Spelling and grammar', icon: Search },
      { label: 'Explore', icon: BarChart3 },
      { label: 'Script editor', icon: Settings },
    ],
    extensions: [
      { label: 'Add-ons', icon: Puzzle },
      { label: 'Apps Script', icon: Settings },
    ]
  };

  const DropdownMenu = ({ items, isOpen }) => {
    if (!isOpen) return null;
    
    return (
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
        {items.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm"
            onClick={() => {
              item.action?.();
              setActiveDropdown(null);
            }}
          >
            <item.icon size={16} className="text-gray-600" />
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        {/* Top section with title and action buttons */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              {editingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setEditingTitle(false);
                    onTitleChange(title);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingTitle(false);
                      onTitleChange(title);
                    }
                    if (e.key === 'Escape') {
                      setEditingTitle(false);
                      setTitle(sheet?.title || 'Untitled');
                    }
                  }}
                  className="text-lg font-medium px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-lg font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => setEditingTitle(true)}
                >
                  {sheet?.title || 'Untitled spreadsheet'}
                </h1>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onChatToggle}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MessageCircle size={16} />
              Chat
            </button>
            <button
              onClick={onShareClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="flex items-center px-4 py-1 border-t border-gray-200">
          {Object.entries(menuItems).map(([menuKey, items]) => (
            <div key={menuKey} className="relative">
              <button
                className="px-3 py-1.5 text-sm capitalize hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(activeDropdown === menuKey ? null : menuKey)}
              >
                {menuKey}
              </button>
              <DropdownMenu items={items} isOpen={activeDropdown === menuKey} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Toolbar */}
      <QuickToolbar 
        onDownloadCSV={handleDownloadCSV}
        onImportCSV={() => fileInputRef.current?.click()}
      />

      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        className="hidden"
      />

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
}