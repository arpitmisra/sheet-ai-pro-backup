# Formula Feature Usage Guide

## How to Use Formulas in Your Spreadsheet

### 🚀 Quick Start Guide

#### Method 1: Using the Formula Toolbar (Recommended)
1. **Select a cell** - Click on any cell where you want the result
2. **Click a formula button** - Use the Quick formulas (=SUM(), =AVERAGE(), etc.) or category dropdowns
3. **Formula is inserted automatically** - The formula will be placed in the selected cell and calculated

#### Method 2: Manual Entry
1. **Select a cell** - Click on the target cell
2. **Type the formula** - Start with `=` followed by the formula (e.g., `=SUM(A1:A10)`)
3. **Press Enter** - The formula will be evaluated and the result displayed

### 📊 Quick Formula Buttons

The toolbar includes these quick-access formulas:

- **=SUM()** - Adds up numbers in range A1:A10
- **=AVERAGE()** - Calculates average of A1:A10
- **=COUNT()** - Counts numbers in A1:A10
- **=IF()** - Conditional logic example
- **=TODAY()** - Shows today's date

### 📂 Formula Categories

#### Basic Functions
- `=SUM(A1:A10)` - Add up numbers
- `=AVERAGE(A1:A10)` - Calculate average
- `=COUNT(A1:A10)` - Count numbers
- `=MIN(A1:A10)` - Find minimum value
- `=MAX(A1:A10)` - Find maximum value
- `=MEDIAN(A1:A10)` - Find middle value

#### Math Functions
- `=ROUND(A1,2)` - Round to 2 decimal places
- `=ABS(A1)` - Absolute value
- `=POWER(A1,2)` - Raise to power (square)
- `=SQRT(A1)` - Square root
- `=MOD(A1,3)` - Remainder after division
- `=RAND()` - Random number between 0 and 1

#### Text Functions
- `=LEN(A1)` - Length of text
- `=UPPER(A1)` - Convert to uppercase
- `=LOWER(A1)` - Convert to lowercase
- `=LEFT(A1,3)` - First 3 characters
- `=RIGHT(A1,3)` - Last 3 characters
- `=CONCATENATE(A1,B1)` - Join text

#### Date/Time Functions
- `=TODAY()` - Current date
- `=NOW()` - Current date and time
- `=YEAR(A1)` - Extract year from date
- `=MONTH(A1)` - Extract month from date
- `=DAY(A1)` - Extract day from date

#### Logical Functions
- `=IF(A1>10,"High","Low")` - Conditional logic
- `=AND(A1>5,B1<10)` - All conditions must be true
- `=OR(A1>5,B1<10)` - Any condition can be true
- `=NOT(A1>10)` - Opposite of condition

### 💡 Tips for Using Formulas

#### 1. Cell References
- **Single cell**: `A1`, `B5`, `Z10`
- **Range**: `A1:A10` (cells A1 through A10)
- **Multiple ranges**: `A1:A5,C1:C5`

#### 2. Best Practices
- Always start formulas with `=`
- Use parentheses to group operations: `=(A1+B1)*C1`
- Cell references are case-insensitive: `a1` = `A1`
- Use ranges instead of listing individual cells: `SUM(A1:A10)` not `SUM(A1,A2,A3...)`

#### 3. Testing Your Formulas
1. **Start with sample data** - Add some numbers to test
2. **Try simple formulas first** - Test `=A1+B1` before complex functions
3. **Check the result** - Make sure the calculation is correct

### 🔧 Troubleshooting

#### Formula Shows as Text Instead of Calculating
**Problem**: You see `=SUM(A1:A10)` in the cell instead of a number
**Solutions**:
1. Make sure you selected a cell before clicking the formula button
2. If typing manually, make sure the formula starts with `=`
3. Press Enter after typing the formula
4. Check that referenced cells contain numbers

#### Formula Buttons Don't Work
**Problem**: Clicking formula buttons does nothing
**Solutions**:
1. **Select a cell first** - You must click on a cell before using formula buttons
2. Look for the "Target cell" indicator in the toolbar
3. If you see "Select a cell first" message, click on any cell

#### Getting #ERROR in Cell
**Problem**: Cell shows `#ERROR: Invalid expression`
**Solutions**:
1. Check formula syntax - make sure parentheses match
2. Verify cell references exist and contain valid data
3. Make sure ranges are properly formatted: `A1:A10` not `A1-A10`

### 📝 Example Walkthrough

Let's create a simple budget calculation:

1. **Add sample data**:
   - A1: 100 (Income 1)
   - A2: 200 (Income 2)
   - A3: 150 (Income 3)
   - B1: 50 (Expense 1)
   - B2: 75 (Expense 2)

2. **Calculate total income**:
   - Click cell A4
   - Click "=SUM()" button (it will insert =SUM(A1:A10))
   - Edit to =SUM(A1:A3) if needed
   - Result: 450

3. **Calculate total expenses**:
   - Click cell B3
   - Use formula: =SUM(B1:B2)
   - Result: 125

4. **Calculate balance**:
   - Click cell C1
   - Type: =A4-B3
   - Result: 325

### 🎯 Pro Tips

1. **Use absolute references**: `$A$1` won't change when copied
2. **Chain formulas**: Use results from one formula in another
3. **Named ranges**: Advanced feature for easier formula reading
4. **Copy formulas**: Select cell with formula, copy (Ctrl+C), paste to other cells

### 🚨 Important Notes

- **Data types matter**: Make sure cells contain numbers for math operations
- **Circular references**: Don't reference the cell the formula is in
- **Performance**: Very complex formulas with large ranges may be slow
- **Updates**: Formulas recalculate automatically when referenced cells change

### 🔍 Debugging Formulas

When formulas don't work as expected:
1. Check the browser console (F12) for error messages
2. Verify that referenced cells contain the expected data types
3. Test with simple data first (like 1, 2, 3, 4, 5)
4. Break complex formulas into smaller parts

Happy calculating! 🧮✨