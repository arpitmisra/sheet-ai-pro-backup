import { parseCellRef } from '../utils';

/**
 * Formula Engine for basic spreadsheet calculations
 * Supports: +, -, *, /, %, SUM, AVERAGE, COUNT, MIN, MAX, IF, and many more functions
 */

/**
 * Evaluate a formula
 * @param {string} formula - The formula string (e.g., "=SUM(A1:A10)")
 * @param {Object} cells - Cell data object { "A1": {value: 10}, ... }
 * @returns {number|string|Error}
 */
export function evaluateFormula(formula, cells) {
  if (!formula || !formula.startsWith('=')) {
    return formula;
  }

  try {
    console.log('Evaluating formula:', formula); // Debug log
    const expression = formula.substring(1).trim();
    const result = evaluateExpression(expression, cells);
    console.log('Formula result:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error); // Debug log
    return `#ERROR: ${error.message}`;
  }
}

/**
 * Evaluate an expression
 */
function evaluateExpression(expr, cells) {
  // Handle functions first
  expr = replaceFunctions(expr, cells);
  
  // Replace cell references with values
  expr = replaceCellReferences(expr, cells);
  
  // Evaluate the mathematical expression
  try {
    // Safe eval using Function constructor (limited scope)
    const result = new Function('return ' + expr)();
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

/**
 * Replace cell references (A1, B2, etc.) with their values
 */
function replaceCellReferences(expr, cells) {
  const cellRegex = /([A-Z]+\d+)/g;
  
  return expr.replace(cellRegex, (match) => {
    const cellData = cells[match];
    if (!cellData) return '0';
    
    const value = cellData.value;
    if (value === null || value === undefined || value === '') return '0';
    
    // If it's a number, return it
    if (!isNaN(value)) return value;
    
    // If it's a string number, parse it
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
    
    return '0';
  });
}

/**
 * Replace function calls with their computed values
 */
function replaceFunctions(expr, cells) {
  console.log('replaceFunctions input expression:', expr); // Debug log
  
  // SUM function
  expr = expr.replace(/SUM\(([^)]+)\)/gi, (match, range) => {
    console.log('Replacing SUM function with range:', range); // Debug log
    const result = computeSum(range, cells);
    console.log('SUM replacement result:', result); // Debug log
    return result;
  });
  
  // AVERAGE function
  expr = expr.replace(/AVERAGE\(([^)]+)\)/gi, (match, range) => {
    console.log('Replacing AVERAGE function with range:', range); // Debug log
    const result = computeAverage(range, cells);
    console.log('AVERAGE replacement result:', result); // Debug log
    return result;
  });
  
  // COUNT function
  expr = expr.replace(/COUNT\(([^)]+)\)/gi, (match, range) => {
    return computeCount(range, cells);
  });
  
  // MIN function
  expr = expr.replace(/MIN\(([^)]+)\)/gi, (match, range) => {
    return computeMin(range, cells);
  });
  
  // MAX function
  expr = expr.replace(/MAX\(([^)]+)\)/gi, (match, range) => {
    return computeMax(range, cells);
  });
  
  // IF function
  expr = expr.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, (match, condition, trueVal, falseVal) => {
    return computeIf(condition, trueVal, falseVal, cells);
  });

  // MEDIAN function
  expr = expr.replace(/MEDIAN\(([^)]+)\)/gi, (match, range) => {
    return computeMedian(range, cells);
  });

  // ROUND function
  expr = expr.replace(/ROUND\(([^,]+),(\d+)\)/gi, (match, num, decimals) => {
    const value = parseFloat(replaceCellReferences(num, cells));
    const dec = parseInt(decimals);
    return Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
  });

  // ABS function
  expr = expr.replace(/ABS\(([^)]+)\)/gi, (match, num) => {
    const value = parseFloat(replaceCellReferences(num, cells));
    return Math.abs(value);
  });

  // POWER function
  expr = expr.replace(/POWER\(([^,]+),([^)]+)\)/gi, (match, base, exp) => {
    const baseVal = parseFloat(replaceCellReferences(base, cells));
    const expVal = parseFloat(replaceCellReferences(exp, cells));
    return Math.pow(baseVal, expVal);
  });

  // SQRT function
  expr = expr.replace(/SQRT\(([^)]+)\)/gi, (match, num) => {
    const value = parseFloat(replaceCellReferences(num, cells));
    return Math.sqrt(value);
  });

  // MOD function
  expr = expr.replace(/MOD\(([^,]+),([^)]+)\)/gi, (match, dividend, divisor) => {
    const dividendVal = parseFloat(replaceCellReferences(dividend, cells));
    const divisorVal = parseFloat(replaceCellReferences(divisor, cells));
    return dividendVal % divisorVal;
  });

  // RAND function
  expr = expr.replace(/RAND\(\)/gi, () => {
    return Math.random();
  });

  // Date functions
  expr = expr.replace(/TODAY\(\)/gi, () => {
    const today = new Date();
    return `"${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}"`;
  });

  expr = expr.replace(/NOW\(\)/gi, () => {
    const now = new Date();
    return `"${now.toISOString()}"`;
  });

  // Text functions
  expr = expr.replace(/LEN\(([^)]+)\)/gi, (match, text) => {
    const cellValue = getCellTextValue(text, cells);
    return cellValue.length;
  });

  expr = expr.replace(/UPPER\(([^)]+)\)/gi, (match, text) => {
    const cellValue = getCellTextValue(text, cells);
    return `"${cellValue.toUpperCase()}"`;
  });

  expr = expr.replace(/LOWER\(([^)]+)\)/gi, (match, text) => {
    const cellValue = getCellTextValue(text, cells);
    return `"${cellValue.toLowerCase()}"`;
  });

  expr = expr.replace(/CONCATENATE\(([^)]+)\)/gi, (match, params) => {
    const parts = params.split(',').map(p => getCellTextValue(p.trim(), cells));
    return `"${parts.join('')}"`;
  });

  // Logical functions
  expr = expr.replace(/AND\(([^)]+)\)/gi, (match, conditions) => {
    const conditionList = conditions.split(',');
    return conditionList.every(cond => {
      const result = evaluateCondition(cond.trim(), cells);
      return result === true || result === 'TRUE' || result === 1;
    });
  });

  expr = expr.replace(/OR\(([^)]+)\)/gi, (match, conditions) => {
    const conditionList = conditions.split(',');
    return conditionList.some(cond => {
      const result = evaluateCondition(cond.trim(), cells);
      return result === true || result === 'TRUE' || result === 1;
    });
  });

  expr = expr.replace(/NOT\(([^)]+)\)/gi, (match, condition) => {
    const result = evaluateCondition(condition.trim(), cells);
    return !(result === true || result === 'TRUE' || result === 1);
  });

  expr = expr.replace(/ISBLANK\(([^)]+)\)/gi, (match, cellRef) => {
    const cellData = cells[cellRef.trim()];
    return !cellData || cellData.value === '' || cellData.value === null || cellData.value === undefined;
  });
  
  return expr;
}

/**
 * Get values from a range (e.g., A1:A10)
 */
function getRangeValues(range, cells) {
  console.log('getRangeValues called with range:', range, 'cells:', Object.keys(cells)); // Debug log
  const values = [];
  
  if (range.includes(':')) {
    // Range like A1:B10
    const [start, end] = range.split(':');
    const startRef = parseCellRef(start.trim());
    const endRef = parseCellRef(end.trim());
    
    console.log('Range parsing - start:', startRef, 'end:', endRef); // Debug log
    
    if (!startRef || !endRef) return values;
    
    for (let row = startRef.row; row <= endRef.row; row++) {
      for (let col = startRef.col; col <= endRef.col; col++) {
        const cellRef = colToLetter(col) + (row + 1);
        const cellData = cells[cellRef];
        console.log('Checking cell:', cellRef, 'data:', cellData); // Debug log
        if (cellData && cellData.value !== null && cellData.value !== undefined && cellData.value !== '') {
          const num = parseFloat(cellData.value);
          if (!isNaN(num)) {
            values.push(num);
            console.log('Added value:', num, 'from cell:', cellRef); // Debug log
          }
        }
      }
    }
  } else {
    // Single cell or comma-separated list
    const parts = range.split(',').map(p => p.trim());
    parts.forEach(part => {
      const cellData = cells[part];
      if (cellData && cellData.value !== null && cellData.value !== undefined && cellData.value !== '') {
        const num = parseFloat(cellData.value);
        if (!isNaN(num)) {
          values.push(num);
        }
      }
    });
  }
  
  console.log('getRangeValues returning:', values); // Debug log
  return values;
}

/**
 * SUM function
 */
function computeSum(range, cells) {
  console.log('computeSum called with range:', range); // Debug log
  const values = getRangeValues(range, cells);
  console.log('computeSum values:', values); // Debug log
  const result = values.reduce((sum, val) => sum + val, 0);
  console.log('computeSum result:', result); // Debug log
  return result;
}

/**
 * AVERAGE function
 */
function computeAverage(range, cells) {
  console.log('computeAverage called with range:', range); // Debug log
  const values = getRangeValues(range, cells);
  console.log('computeAverage values:', values); // Debug log
  if (values.length === 0) return 0;
  const result = values.reduce((sum, val) => sum + val, 0) / values.length;
  console.log('computeAverage result:', result); // Debug log
  return result;
}

/**
 * COUNT function
 */
function computeCount(range, cells) {
  const values = getRangeValues(range, cells);
  return values.length;
}

/**
 * MIN function
 */
function computeMin(range, cells) {
  const values = getRangeValues(range, cells);
  if (values.length === 0) return 0;
  return Math.min(...values);
}

/**
 * MAX function
 */
function computeMax(range, cells) {
  const values = getRangeValues(range, cells);
  if (values.length === 0) return 0;
  return Math.max(...values);
}

/**
 * IF function
 */
function computeIf(condition, trueVal, falseVal, cells) {
  // Replace cell references in condition
  const evaluatedCondition = replaceCellReferences(condition, cells);
  
  try {
    const result = new Function('return ' + evaluatedCondition)();
    return result ? trueVal.trim() : falseVal.trim();
  } catch {
    return falseVal.trim();
  }
}

/**
 * Helper to convert column index to letter
 */
function colToLetter(col) {
  let letter = '';
  while (col >= 0) {
    letter = String.fromCharCode((col % 26) + 65) + letter;
    col = Math.floor(col / 26) - 1;
  }
  return letter;
}

/**
 * Validate formula syntax
 */
export function validateFormula(formula) {
  if (!formula || !formula.startsWith('=')) {
    return { valid: true };
  }

  const expression = formula.substring(1).trim();
  
  // Check for balanced parentheses
  let parenthesesCount = 0;
  for (const char of expression) {
    if (char === '(') parenthesesCount++;
    if (char === ')') parenthesesCount--;
    if (parenthesesCount < 0) {
      return { valid: false, error: 'Unbalanced parentheses' };
    }
  }
  
  if (parenthesesCount !== 0) {
    return { valid: false, error: 'Unbalanced parentheses' };
  }

  return { valid: true };
}

/**
 * Helper function to compute median
 */
function computeMedian(range, cells) {
  const values = getRangeValues(range, cells).sort((a, b) => a - b);
  if (values.length === 0) return 0;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
}

/**
 * Helper function to get cell text value
 */
function getCellTextValue(cellRef, cells) {
  const trimmed = cellRef.trim().replace(/"/g, '');
  if (cells[trimmed]) {
    return String(cells[trimmed].value || '');
  }
  return trimmed; // Return as literal if not a cell reference
}

/**
 * Helper function to evaluate conditions for logical functions
 */
function evaluateCondition(condition, cells) {
  try {
    const replacedCondition = replaceCellReferences(condition, cells);
    return new Function('return ' + replacedCondition)();
  } catch {
    return false;
  }
}
