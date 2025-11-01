# How Real-Time Collaboration Works

## Overview
This app now supports real-time collaboration similar to Google Sheets, where multiple users can edit the same sheet simultaneously.

## Data Flow

### When HOST Creates a Sheet:

1. **Sheet Creation** (Dashboard):
   - Host clicks "New Sheet"
   - Sheet is created with ID format: `local-{timestamp}-{random}`
   - Stored in localStorage: `sheets` array

2. **Opening the Sheet** (Sheet Page):
   - Host navigates to `/sheets/{sheetId}`
   - Sheet metadata loaded from localStorage
   - Spreadsheet component initializes

3. **WebSocket Connection**:
   - Host connects to WebSocket server at `ws://localhost:3000/ws`
   - Server stores the connection in memory
   - **CRITICAL**: Host sends `SYNC_SHEET` message with all cell data
   - Server stores this data in memory (`sheetsData` Map)

4. **Sharing**:
   - Host clicks Share button
   - Link generated: `http://localhost:3000/sheets/{sheetId}`
   - Host shares this link with CLIENT

### When CLIENT Opens Shared Link:

1. **Navigation** (Client browser):
   - Client pastes link: `http://localhost:3000/sheets/{sheetId}`
   - Client must be logged in (redirected to login if not)

2. **Sheet Loading** (Sheet Page):
   - Client's browser tries to load sheet from localStorage
   - **Sheet NOT found** (it's not in their localStorage!)
   - Instead of failing, page shows "Loading..." state
   - Sets `waitingForServer = true`

3. **WebSocket Connection**:
   - Client connects to WebSocket server
   - Server sees the `sheetId` in connection params
   - Server checks if it has data for this sheet
   - **Server sends `INIT_DATA`** message with all cells to client
   - Client receives data and populates spreadsheet!

4. **Real-Time Sync**:
   - HOST edits cell → sends `CELL_UPDATE` → SERVER → broadcasts to CLIENT
   - CLIENT edits cell → sends `CELL_UPDATE` → SERVER → broadcasts to HOST
   - Both see changes instantly!

## Message Types

### SYNC_SHEET (Host → Server)
Sent by host when they connect, contains all their local data:
```json
{
  "type": "SYNC_SHEET",
  "payload": {
    "cells": {
      "A1": "Hello",
      "B2": "=A1+10"
    },
    "metadata": {
      "sheetId": "local-123-abc",
      "lastUpdated": 1234567890
    }
  }
}
```

### INIT_DATA (Server → Client)
Sent to new clients when they connect:
```json
{
  "type": "INIT_DATA",
  "data": {
    "cells": {
      "A1": "Hello",
      "B2": "=A1+10"
    },
    "metadata": {}
  }
}
```

### CELL_UPDATE (User → Server → Other Users)
Sent when any user edits a cell:
```json
{
  "type": "CELL_UPDATE",
  "payload": {
    "cellId": "A1",
    "value": "New value"
  }
}
```

### PRESENCE_UPDATE (Server → All Users)
Broadcast when users join/leave:
```json
{
  "type": "PRESENCE_UPDATE",
  "users": [
    {
      "userId": "user-1",
      "userName": "Alice",
      "isOnline": true
    }
  ]
}
```

### CHAT_MESSAGE (User → Server → All Users)
Real-time chat messages:
```json
{
  "type": "CHAT_MESSAGE",
  "payload": {
    "message": "Hello!"
  }
}
```

## Important Notes

### ⚠️ Server Memory is Temporary
- Sheet data is stored in server memory (`Map` objects)
- **Data is lost when server restarts!**
- For production: Add database persistence or use Redis

### ⚠️ localStorage is Per-Browser
- Host's localStorage is NOT shared with client
- Each browser has its own localStorage
- This is why we need the WebSocket server as the source of truth

### ⚠️ Sheet ID Types

**Local Sheets** (starts with `local-`):
- Example: `local-1761986078088-81a4hh1v1`
- Created by user in their browser
- Stored in localStorage
- Synced via WebSocket server
- **No Supabase queries** (skipped by `sheetId.startsWith('local-')` check)

**Supabase Sheets** (UUID format):
- Example: `806e5a07-d386-456b-a8c7-99567543bf35`
- Created in Supabase database
- Persisted across sessions
- **Currently not working for collaboration** (client can't access host's DB record)

## Testing Collaboration

### Step-by-Step Test:

1. **Start Server**:
   ```bash
   npm run dev
   ```

2. **Host Actions** (Browser 1 / Account 1):
   - Login to account 1
   - Create new sheet
   - Add some data (type in cells)
   - Click Share button
   - Copy the link

3. **Client Actions** (Browser 2 / Account 2):
   - Login to account 2 (different account!)
   - Paste the shared link
   - Should see "Online Users" showing both users
   - Should see the same data host entered
   - Edit a cell
   - Host should see the change instantly!

4. **Verify Real-Time Sync**:
   - Host types in cell A1
   - Client should see it appear
   - Client types in cell B1
   - Host should see it appear
   - Both users should see each other in "Online Users"
   - Chat messages should work

## Troubleshooting

### "WebSocket connection to 'ws://localhost:3000/_next/webpack-hmr' failed"
- **Ignore this!** It's a harmless Next.js HMR warning
- Our WebSocket is at `/ws`, not `/_next/webpack-hmr`

### "Supabase error: Cannot coerce the result to a single JSON object"
- This means the sheet ID is a UUID but not found in Supabase
- Check if you're trying to share a Supabase sheet
- Use local sheets (starts with `local-`) for collaboration

### Client sees "Loading..." forever
- WebSocket might not be connected
- Check browser console for connection errors
- Ensure server is running: `npm run dev`
- Check if host has synced data (host must connect first!)

### Changes not syncing
- Check "Online Users" - are both users shown?
- Check browser console for WebSocket errors
- Ensure both users are connected to same sheet ID
- Try refreshing both browsers

## Current Limitations

1. **No Persistence**: Server restart = data loss
2. **Single Server**: Won't work across multiple server instances
3. **No Conflict Resolution**: Last write wins
4. **No History**: Can't undo other users' changes
5. **Memory Only**: Large sheets could cause memory issues

## Future Improvements

- [ ] Add Redis for persistent storage
- [ ] Add conflict resolution (CRDTs)
- [ ] Add undo/redo with history
- [ ] Add presence cursors (see where others are typing)
- [ ] Add cell locking (prevent simultaneous edits)
- [ ] Add database persistence for shared sheets
