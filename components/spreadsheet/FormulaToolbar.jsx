'use client';

import { useState, useRef } from 'react';
import { useSpreadsheetStore } from '@/store/spreadsheetStore';
import {
  Calculator,
  Plus,
  Minus,
  Percent,
  Hash,
  Calendar,
  TrendingUp,
  BarChart,
  ChevronDown,
  Sigma,
  Target,
  Clock
} from 'lucide-react';

export default function FormulaToolbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { selectedCell, updateCell } = useSpreadsheetStore();

  const insertFormula = (formula) => {
    if (selectedCell) {
      console.log('Inserting formula:', formula, 'into cell:', selectedCell); // Debug log
      updateCell(selectedCell, formula, true); // true indicates it's a formula
      setActiveDropdown(null);
    } else {
      alert('Please select a cell first to insert the formula');
    }
  };

  const formulaCategories = {
    basic: {
      icon: Calculator,
      label: 'Basic',
      formulas: [
        { name: 'SUM', formula: '=SUM(A1:A10)', description: 'Add up numbers in a range' },
        { name: 'AVERAGE', formula: '=AVERAGE(A1:A10)', description: 'Calculate average of numbers' },
        { name: 'COUNT', formula: '=COUNT(A1:A10)', description: 'Count cells with numbers' },
        { name: 'MIN', formula: '=MIN(A1:A10)', description: 'Find minimum value' },
        { name: 'MAX', formula: '=MAX(A1:A10)', description: 'Find maximum value' },
        { name: 'MEDIAN', formula: '=MEDIAN(A1:A10)', description: 'Find middle value' },
      ]
    },
    math: {
      icon: Hash,
      label: 'Math',
      formulas: [
        { name: 'ROUND', formula: '=ROUND(A1,2)', description: 'Round to specified decimals' },
        { name: 'ABS', formula: '=ABS(A1)', description: 'Absolute value' },
        { name: 'POWER', formula: '=POWER(A1,2)', description: 'Raise to power' },
        { name: 'SQRT', formula: '=SQRT(A1)', description: 'Square root' },
        { name: 'MOD', formula: '=MOD(A1,B1)', description: 'Remainder after division' },
        { name: 'RAND', formula: '=RAND()', description: 'Random number 0-1' },
      ]
    },
    text: {
      icon: Target,
      label: 'Text',
      formulas: [
        { name: 'CONCATENATE', formula: '=CONCATENATE(A1," ",B1)', description: 'Join text strings' },
        { name: 'LEN', formula: '=LEN(A1)', description: 'Length of text' },
        { name: 'UPPER', formula: '=UPPER(A1)', description: 'Convert to uppercase' },
        { name: 'LOWER', formula: '=LOWER(A1)', description: 'Convert to lowercase' },
        { name: 'LEFT', formula: '=LEFT(A1,5)', description: 'First N characters' },
        { name: 'RIGHT', formula: '=RIGHT(A1,5)', description: 'Last N characters' },
      ]
    },
    date: {
      icon: Calendar,
      label: 'Date/Time',
      formulas: [
        { name: 'TODAY', formula: '=TODAY()', description: 'Current date' },
        { name: 'NOW', formula: '=NOW()', description: 'Current date and time' },
        { name: 'YEAR', formula: '=YEAR(A1)', description: 'Extract year from date' },
        { name: 'MONTH', formula: '=MONTH(A1)', description: 'Extract month from date' },
        { name: 'DAY', formula: '=DAY(A1)', description: 'Extract day from date' },
        { name: 'DATEDIF', formula: '=DATEDIF(A1,B1,"D")', description: 'Difference between dates' },
      ]
    },
    logical: {
      icon: TrendingUp,
      label: 'Logical',
      formulas: [
        { name: 'IF', formula: '=IF(A1>10,"High","Low")', description: 'Conditional logic' },
        { name: 'AND', formula: '=AND(A1>5,B1<10)', description: 'All conditions true' },
        { name: 'OR', formula: '=OR(A1>5,B1<10)', description: 'Any condition true' },
        { name: 'NOT', formula: '=NOT(A1>10)', description: 'Opposite of condition' },
        { name: 'IFERROR', formula: '=IFERROR(A1/B1,"Error")', description: 'Handle errors' },
        { name: 'ISBLANK', formula: '=ISBLANK(A1)', description: 'Check if cell is empty' },
      ]
    }
  };

  const quickFormulas = [
    { name: '=SUM()', icon: Sigma, formula: '=SUM(A1:A10)', description: 'Sum range A1 to A10' },
    { name: '=AVERAGE()', icon: BarChart, formula: '=AVERAGE(A1:A10)', description: 'Average of A1 to A10' },
    { name: '=COUNT()', icon: Hash, formula: '=COUNT(A1:A10)', description: 'Count numbers in A1 to A10' },
    { name: '=IF()', icon: TrendingUp, formula: '=IF(A1>10,"High","Low")', description: 'Conditional logic' },
    { name: '=TODAY()', icon: Calendar, formula: '=TODAY()', description: "Today's date" },
  ];

  const FormulaDropdown = ({ category, formulas }) => (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-64">
      <div className="max-h-80 overflow-y-auto">
        {formulas.map((formula, index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            onClick={() => insertFormula(formula.formula)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-mono text-sm font-semibold text-blue-600">
                  {formula.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formula.description}
                </div>
              </div>
            </div>
            <div className="font-mono text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded">
              {formula.formula}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Quick Formula Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
          <span className="text-xs font-medium text-gray-600 mr-2">Quick:</span>
          {quickFormulas.map((formula, index) => (
            <button
              key={index}
              onClick={() => insertFormula(formula.formula)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
              title={formula.description}
            >
              <formula.icon size={12} className="text-blue-600" />
              <span className="font-mono">{formula.name}</span>
            </button>
          ))}
        </div>

        {/* Formula Categories */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-600 mr-2">Formulas:</span>
          {Object.entries(formulaCategories).map(([key, category]) => (
            <div key={key} className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
              >
                <category.icon size={12} className="text-gray-600" />
                <span>{category.label}</span>
                <ChevronDown size={10} className="text-gray-400" />
              </button>
              
              {activeDropdown === key && (
                <FormulaDropdown 
                  category={category}
                  formulas={category.formulas}
                />
              )}
            </div>
          ))}
        </div>

        {/* Selected Cell Info */}
        {selectedCell ? (
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-600">
            <span>Target cell:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
              {selectedCell}
            </span>
          </div>
        ) : (
          <div className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            👆 Select a cell first to insert formulas
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}