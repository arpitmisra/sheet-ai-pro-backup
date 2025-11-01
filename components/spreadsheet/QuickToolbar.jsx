'use client';

import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  PaintBucket,
  Download,
  Upload,
  Plus,
  Minus
} from 'lucide-react';
import { useSpreadsheetStore } from '@/store/spreadsheetStore';

export default function QuickToolbar({ onDownloadCSV, onImportCSV }) {
  const { selectedCell, addRow, addColumn } = useSpreadsheetStore();

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

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-1">
        {/* Formatting tools */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
            <Bold size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
            <Italic size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
            <Underline size={16} />
          </button>
        </div>

        {/* Alignment tools */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Align Left">
            <AlignLeft size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Align Center">
            <AlignCenter size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Align Right">
            <AlignRight size={16} />
          </button>
        </div>

        {/* Color tools */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Text Color">
            <Type size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Fill Color">
            <PaintBucket size={16} />
          </button>
        </div>

        {/* Insert tools */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
          <button 
            className="p-1.5 hover:bg-gray-200 rounded" 
            title="Insert Row"
            onClick={() => addRow(currentCell.row + 1)}
          >
            <Plus size={16} />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-200 rounded" 
            title="Insert Column"
            onClick={() => addColumn(currentCell.col + 1)}
          >
            <Plus size={16} className="rotate-90" />
          </button>
        </div>

        {/* File tools */}
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-gray-200 rounded" 
            title="Import CSV"
            onClick={onImportCSV}
          >
            <Upload size={16} />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-200 rounded" 
            title="Download CSV"
            onClick={onDownloadCSV}
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}