# Chat Feature Implementation & Testing Guide

## Overview
The chat feature has been enhanced to provide real-time communication between users working on the same spreadsheet. The chat system uses WebSocket connections to ensure instant message delivery and includes message persistence.

## Features Implemented

### 1. Real-time Messaging
- **WebSocket-based**: Messages are sent and received instantly via WebSocket connections
- **Room-based**: Users in the same sheet (sheetId) share the same chat room
- **User identification**: Messages show sender's name and timestamp

### 2. Message Persistence
- **Local Storage**: Messages are saved to browser's localStorage for persistence
- **24-hour retention**: Only messages from the last 24 hours are kept
- **100 message limit**: Keeps the most recent 100 messages to prevent storage bloat

### 3. Connection Status
- **Visual indicators**: Green/red dot shows connection status
- **Reconnection**: Automatically attempts to reconnect if connection is lost
- **Status messages**: Shows "Connecting..." or "Reconnecting to chat..." when appropriate

### 4. Enhanced UI/UX
- **Minimizable panel**: Chat can be minimized while staying accessible
- **Character limit**: 500 character limit per message with counter
- **Auto-scroll**: Automatically scrolls to newest messages
- **Responsive design**: Works well on different screen sizes

## How It Works

### Client Side (ChatPanel.jsx)
1. **Connection**: Uses `useWebSocket` hook to connect to the sheet's chat room
2. **Message Handling**: Listens for `CHAT_MESSAGE` events from the WebSocket
3. **Sending Messages**: Sends messages via WebSocket with `CHAT_MESSAGE` type
4. **Persistence**: Saves/loads messages from localStorage using sheet ID as key

### Server Side (websocket.js)
1. **Room Management**: Groups users by `sheetId` parameter
2. **Message Broadcasting**: When a user sends a message, it's broadcast to all other users in the same room
3. **User Tracking**: Maintains user presence and information for each sheet

### WebSocket Hook (useWebSocket.js)
1. **Connection Management**: Handles connection, reconnection, and error states
2. **Message Routing**: Routes different message types to appropriate handlers
3. **Presence Updates**: Tracks online users and their status

## Testing the Chat Feature

### Prerequisites
1. Start the development server: `npm run dev`
2. Open the application in multiple browser tabs/windows
3. Navigate to the same sheet in both tabs

### Test Scenarios

#### Test 1: Basic Messaging
1. **Setup**: Open same sheet in 2 browser tabs
2. **Action**: 
   - Click "Chat" button in both tabs
   - Type a message in Tab 1 and press Enter
3. **Expected**: Message appears in Tab 2 immediately
4. **Verify**: Sender name, timestamp, and message content are correct

#### Test 2: Connection Status
1. **Setup**: Open chat in one tab
2. **Action**: 
   - Observe the green dot next to "Team Chat"
   - Disconnect internet briefly
3. **Expected**: 
   - Dot turns red when disconnected
   - Shows "Reconnecting to chat..." message
   - Automatically reconnects when internet returns

#### Test 3: Message Persistence
1. **Setup**: Send several messages between tabs
2. **Action**: Refresh one of the tabs
3. **Expected**: Previous messages still visible after refresh

#### Test 4: Multiple Users
1. **Setup**: Open same sheet in 3+ different browsers/devices
2. **Action**: Send messages from different browsers
3. **Expected**: All messages appear in all chat windows

#### Test 5: Character Limit
1. **Setup**: Open chat
2. **Action**: Type a very long message (over 400 characters)
3. **Expected**: Character counter appears showing remaining characters

### Debug Information
The chat includes console logging for debugging:
- WebSocket connection status
- Message sending/receiving
- Presence updates

To view debug logs:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for messages starting with:
   - "WebSocket connected"
   - "Received chat message:"
   - "WebSocket sending:"

## Troubleshooting

### Chat Not Working
1. **Check Console**: Look for WebSocket connection errors
2. **Verify User Authentication**: Ensure user is logged in
3. **Check Network**: Ensure WebSocket port (3000) is accessible
4. **Clear Storage**: Clear localStorage if messages seem corrupted

### Messages Not Appearing
1. **Check Connection Status**: Look for green/red indicator
2. **Verify Sheet ID**: Ensure both users are on the same sheet
3. **Check Server Logs**: Look for message broadcasting errors

### Connection Issues
1. **Firewall**: Ensure WebSocket connections aren't blocked
2. **Browser Support**: Verify WebSocket support in browser
3. **Server Status**: Ensure WebSocket server is running

## Technical Details

### Message Structure
```javascript
{
  type: 'CHAT_MESSAGE',
  data: {
    userId: 'user-123',
    userName: 'John Doe',
    message: 'Hello everyone!',
    timestamp: 1635724800000
  }
}
```

### WebSocket Events
- `CHAT_MESSAGE`: Chat message from another user
- `PRESENCE_UPDATE`: User join/leave notifications
- `PRESENCE_HEARTBEAT`: Keep-alive messages

### Storage Keys
- `chat-${sheetId}`: Stores chat messages for specific sheet

## Files Modified/Enhanced

1. **`components/collaboration/ChatPanel.jsx`**
   - Added message persistence
   - Enhanced connection status indicators
   - Improved error handling and debugging

2. **`lib/hooks/useWebSocket.js`**
   - Added better debugging logs
   - Improved message handling
   - Enhanced connection status tracking

3. **`server/websocket.js`** (already working correctly)
   - Handles chat message broadcasting
   - Manages user presence in rooms

## Future Enhancements

1. **Emoji Support**: Add emoji picker for messages
2. **File Sharing**: Allow file attachments in chat
3. **Message Threading**: Reply to specific messages
4. **User Mentions**: @mention functionality
5. **Message History**: Server-side message persistence
6. **Typing Indicators**: Show when users are typing
7. **Message Reactions**: Like/react to messages