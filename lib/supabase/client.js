import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign up with email and password
 */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  });
  return { data, error };
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Create a new sheet
 */
export async function createSheet(userId, title = 'Untitled Sheet') {
  try {
    const { data, error } = await supabase
      .from('sheets')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const newSheet = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      sheets.unshift(newSheet);
      localStorage.setItem('sheets', JSON.stringify(sheets));
      
      return { data: newSheet, error: null };
    }
    return { data: null, error };
  }
}

/**
 * Get all sheets for a user
 */
export async function getUserSheets(userId) {
  try {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      const userSheets = sheets.filter(s => s.user_id === userId);
      return { data: userSheets, error: null };
    }
    return { data: [], error };
  }
}

/**
 * Get a single sheet by ID
 */
export async function getSheet(sheetId) {
  // Skip Supabase for local sheets
  if (sheetId.startsWith('local-')) {
    if (typeof window !== 'undefined') {
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      const sheet = sheets.find(s => s.id === sheetId);
      return { data: sheet || null, error: sheet ? null : { message: 'Sheet not found' } };
    }
    return { data: null, error: { message: 'Sheet not found' } };
  }

  try {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .eq('id', sheetId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      const sheet = sheets.find(s => s.id === sheetId);
      return { data: sheet || null, error: sheet ? null : { message: 'Sheet not found' } };
    }
    return { data: null, error };
  }
}

/**
 * Update sheet title
 */
export async function updateSheetTitle(sheetId, title) {
  try {
    const { data, error } = await supabase
      .from('sheets')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sheetId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      const sheetIndex = sheets.findIndex(s => s.id === sheetId);
      if (sheetIndex !== -1) {
        sheets[sheetIndex].title = title;
        sheets[sheetIndex].updated_at = new Date().toISOString();
        localStorage.setItem('sheets', JSON.stringify(sheets));
        return { data: sheets[sheetIndex], error: null };
      }
    }
    return { data: null, error };
  }
}

/**
 * Get all cells for a sheet
 */
export async function getSheetCells(sheetId) {
  // Skip Supabase for local sheets
  if (sheetId.startsWith('local-')) {
    if (typeof window !== 'undefined') {
      const cells = JSON.parse(localStorage.getItem(`cells_${sheetId}`) || '[]');
      return { data: cells, error: null };
    }
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('cells')
      .select('*')
      .eq('sheet_id', sheetId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage for cells:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const cells = JSON.parse(localStorage.getItem(`cells_${sheetId}`) || '[]');
      return { data: cells, error: null };
    }
    return { data: [], error };
  }
}

/**
 * Update or create a cell
 */
export async function upsertCell(sheetId, row, col, value, formula = null) {
  // Skip Supabase for local sheets
  if (sheetId.startsWith('local-')) {
    if (typeof window !== 'undefined') {
      const cells = JSON.parse(localStorage.getItem(`cells_${sheetId}`) || '[]');
      const cellIndex = cells.findIndex(c => c.row === row && c.col === col);
      
      const cellData = {
        sheet_id: sheetId,
        row,
        col,
        value,
        formula,
        updated_at: new Date().toISOString(),
      };
      
      if (cellIndex !== -1) {
        cells[cellIndex] = cellData;
      } else {
        cells.push(cellData);
      }
      
      localStorage.setItem(`cells_${sheetId}`, JSON.stringify(cells));
      return { data: cellData, error: null };
    }
    return { data: null, error: { message: 'localStorage not available' } };
  }

  try {
    const { data, error } = await supabase
      .from('cells')
      .upsert(
        {
          sheet_id: sheetId,
          row,
          col,
          value,
          formula,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'sheet_id,row,col',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage for cell update:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const cells = JSON.parse(localStorage.getItem(`cells_${sheetId}`) || '[]');
      const cellIndex = cells.findIndex(c => c.row === row && c.col === col);
      
      const cellData = {
        sheet_id: sheetId,
        row,
        col,
        value,
        formula,
        updated_at: new Date().toISOString(),
      };
      
      if (cellIndex !== -1) {
        cells[cellIndex] = cellData;
      } else {
        cells.push(cellData);
      }
      
      localStorage.setItem(`cells_${sheetId}`, JSON.stringify(cells));
      return { data: cellData, error: null };
    }
    return { data: null, error };
  }
}

/**
 * Delete a sheet
 */
export async function deleteSheet(sheetId) {
  try {
    const { error } = await supabase
      .from('sheets')
      .delete()
      .eq('id', sheetId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Supabase error, using localStorage:', error);
    // Fallback to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const sheets = JSON.parse(localStorage.getItem('sheets') || '[]');
      const filtered = sheets.filter(s => s.id !== sheetId);
      localStorage.setItem('sheets', JSON.stringify(filtered));
    }
    return { error: null };
  }
}
