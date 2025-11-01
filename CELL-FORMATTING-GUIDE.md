# Cell Formatting Feature Guide

## Overview
The spreadsheet now includes comprehensive cell formatting capabilities similar to Google Sheets, including background colors, font colors, text formatting, and alignment options.

## Features Implemented

### 1. **Color Formatting**
- **Background Colors**: 20+ predefined colors plus custom color picker
- **Font Colors**: Same color palette for text colors
- **Custom Colors**: Hex color input and browser color picker
- **Color Removal**: "None/Transparent" option to remove colors

### 2. **Text Formatting**
- **Bold**: Make text bold (Ctrl+B equivalent)
- **Italic**: Italicize text (Ctrl+I equivalent)  
- **Underline**: Underline text (Ctrl+U equivalent)

### 3. **Text Alignment**
- **Left Align**: Default alignment
- **Center Align**: Center text in cell
- **Right Align**: Right-align text in cell

### 4. **Clear Formatting**
- **Reset All**: Clear all formatting and return to defaults
- **Selective**: Individual format options can be toggled off

## How to Use

### **Step 1: Select a Cell**
1. Click on any cell in the spreadsheet
2. The cell reference will appear in the formatting toolbar
3. Current formatting will be highlighted in the toolbar

### **Step 2: Apply Formatting**

#### **Background Color:**
1. Click the **background color picker** (palette icon)
2. Choose from predefined colors or use custom color
3. Select "None" to remove background color

#### **Font Color:**
1. Click the **font color picker** (text icon)
2. Choose from predefined colors or use custom color
3. Color applies immediately to selected cell

#### **Text Formatting:**
1. Click **Bold (B)** to toggle bold text
2. Click **Italic (I)** to toggle italic text
3. Click **Underline (U)** to toggle underlined text

#### **Alignment:**
1. Click **Left**, **Center**, or **Right** alignment buttons
2. Text alignment changes immediately

#### **Clear Formatting:**
1. Click **"Clear Format"** button to remove all formatting
2. Cell returns to default appearance

## Available Colors

### **Standard Colors:**
- **None/Transparent**: No background color
- **White**: #ffffff
- **Light Gray**: #f8f9fa
- **Gray**: #e9ecef
- **Dark Gray**: #6c757d
- **Black**: #212529

### **Theme Colors:**
- **Red**: #dc3545
- **Orange**: #fd7e14
- **Yellow**: #ffc107
- **Green**: #28a745
- **Blue**: #007bff
- **Indigo**: #6610f2
- **Purple**: #6f42c1
- **Pink**: #e83e8c

### **Light Colors:**
- **Light Red**: #f8d7da
- **Light Orange**: #ffeaa7
- **Light Yellow**: #fff3cd
- **Light Green**: #d4edda
- **Light Blue**: #cce5ff
- **Light Purple**: #e2d9f3

### **Custom Colors:**
- **Color Picker**: Browser-native color picker
- **Hex Input**: Enter exact hex values (#000000 format)

## User Interface

### **Formatting Toolbar Location**
The formatting toolbar appears below the formula toolbar when a cell is selected:

```
[File] [Edit] [View] [Insert] [Format] [Data] [Tools] [Extensions]
[Quick Formulas: SUM() AVERAGE() COUNT() MAX()]
[Selected Cell: A1] [B] [I] [U] [Left] [Center] [Right] [Font Color] [Background Color] [Clear Format]
```

### **Visual Indicators**
- **Selected Tools**: Active formatting options are highlighted in blue
- **Color Previews**: Small color squares show current colors
- **Cell Reference**: Shows which cell is being formatted
- **Tooltips**: Hover over buttons for descriptions

## Technical Implementation

### **Data Structure**
Cell formatting is stored in the cell object:
```javascript
{
  value: "Hello",
  formula: null,
  row: 0,
  col: 0,
  formatting: {
    backgroundColor: "#fff3cd",
    color: "#dc3545",
    fontWeight: "bold",
    fontStyle: "italic",
    textDecoration: "underline",
    textAlign: "center"
  }
}
```

### **CSS Application**
Formatting is applied via inline styles:
```css
style={{
  backgroundColor: formatting.backgroundColor || 'transparent',
  color: formatting.color || '#000000',
  fontWeight: formatting.fontWeight || 'normal',
  fontStyle: formatting.fontStyle || 'normal',
  textDecoration: formatting.textDecoration || 'none',
  textAlign: formatting.textAlign || 'left',
}}
```

## Files Added/Modified

### **New Components:**
1. **`components/spreadsheet/ColorPicker.jsx`**
   - Color palette with predefined and custom colors
   - Separate pickers for font and background colors
   - Dropdown interface with color grid

2. **`components/spreadsheet/CellFormatting.jsx`**
   - Main formatting toolbar component
   - Text formatting buttons (Bold, Italic, Underline)
   - Alignment buttons (Left, Center, Right)
   - Integration with color pickers
   - Clear formatting functionality

### **Enhanced Components:**
3. **`store/spreadsheetStore.js`**
   - Added `updateCellFormat()` function
   - Enhanced `updateCell()` to preserve formatting
   - Added formatting support to cell data structure

4. **`components/spreadsheet/Spreadsheet.jsx`**
   - Updated `renderCell()` to apply formatting styles
   - Added `cells` to store destructuring
   - Enhanced cell rendering with formatting support

5. **`components/spreadsheet/SpreadsheetHeader.jsx`**
   - Integrated CellFormatting component
   - Added import for new formatting component

## Testing the Feature

### **Basic Formatting Test:**
1. Enter "Hello World" in cell A1
2. Select cell A1
3. Apply red background color
4. Apply white font color
5. Make text bold and centered
6. Verify formatting appears correctly

### **Multiple Cells Test:**
1. Format several different cells with different colors
2. Switch between cells to verify formatting persists
3. Test that each cell maintains its own formatting

### **Clear Formatting Test:**
1. Apply multiple formats to a cell
2. Click "Clear Format" button
3. Verify all formatting is removed

### **Custom Color Test:**
1. Use custom color picker to select unique colors
2. Enter hex codes manually (#ff5733)
3. Verify custom colors apply correctly

## Future Enhancements

### **Planned Features:**
1. **Font Size**: Dropdown for different font sizes
2. **Font Family**: Different font options (Arial, Times, etc.)
3. **Borders**: Cell border formatting options
4. **Number Formats**: Currency, percentage, date formats
5. **Conditional Formatting**: Rules-based formatting
6. **Format Painter**: Copy formatting between cells
7. **Cell Merge**: Merge adjacent cells
8. **Text Wrapping**: Wrap text within cells

### **Advanced Features:**
1. **Format Templates**: Predefined format combinations
2. **Theme Support**: Coordinated color schemes
3. **Print Formatting**: Print-specific formatting options
4. **Export Formatting**: Maintain formatting in CSV/Excel export

## Keyboard Shortcuts (Future)
- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+E**: Center align
- **Ctrl+L**: Left align
- **Ctrl+R**: Right align
- **Ctrl+Shift+C**: Copy formatting
- **Ctrl+Shift+V**: Paste formatting

The cell formatting feature provides a comprehensive set of tools for creating visually appealing and well-organized spreadsheets, bringing the application closer to the functionality of professional spreadsheet software like Google Sheets and Excel.