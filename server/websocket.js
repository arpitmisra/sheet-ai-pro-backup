const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const url = require('url');

// Store active connections by sheet ID
const connections = new Map();

// Store sheet data in memory (cells + metadata)
const sheetsData = new Map();

// Store user presence
const userPresence = new Map();

function setupWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'  // Only handle WebSocket connections on /ws path
  });

  wss.on('connection', (ws, req) => {
    const params = url.parse(req.url, true).query;
    const sheetId = params.sheetId;
    const userId = params.userId;
    const userName = params.userName || 'Anonymous';

    if (!sheetId) {
      console.log('WebSocket connection without sheetId, closing');
      ws.close();
      return;
    }

    console.log(`User ${userName} connected to sheet ${sheetId}`);

    // Initialize connections map for this sheet
    if (!connections.has(sheetId)) {
      connections.set(sheetId, new Set());
    }
    connections.get(sheetId).add(ws);

    // Store user info on the websocket
    ws.sheetId = sheetId;
    ws.userId = userId;
    ws.userName = userName;

    // Add to presence
    if (!userPresence.has(sheetId)) {
      userPresence.set(sheetId, new Map());
    }
    userPresence.get(sheetId).set(userId, {
      userId,
      userName,
      isOnline: true,
      lastSeen: Date.now(),
      cursorPosition: null,
    });

    // Send current sheet data to the newly connected client
    try {
      if (sheetsData.has(sheetId)) {
        const sheetData = sheetsData.get(sheetId);
        ws.send(JSON.stringify({
          type: 'INIT_DATA',
          data: {
            cells: sheetData.cells || {},
            metadata: sheetData.metadata || {},
          },
        }));
      }

      // Send current online users to everyone
      broadcastToSheet(sheetId, {
        type: 'PRESENCE_UPDATE',
        users: Array.from(userPresence.get(sheetId).values()),
      });
    } catch (error) {
      console.error('Error sending initial data:', error);
    }

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleMessage(ws, data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log(`User ${userName} disconnected from sheet ${sheetId}`);
      
      // Remove from connections
      if (connections.has(sheetId)) {
        connections.get(sheetId).delete(ws);
        if (connections.get(sheetId).size === 0) {
          connections.delete(sheetId);
        }
      }

      // Update presence
      if (userPresence.has(sheetId)) {
        userPresence.get(sheetId).delete(userId);
        
        // Broadcast updated presence
        broadcastToSheet(sheetId, {
          type: 'PRESENCE_UPDATE',
          users: Array.from(userPresence.get(sheetId).values()),
        }, ws);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      // Clean up on error
      try {
        if (connections.has(sheetId)) {
          connections.get(sheetId).delete(ws);
        }
        if (userPresence.has(sheetId)) {
          userPresence.get(sheetId).delete(userId);
        }
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    });
  });

  // Handle server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  return wss;
}

function handleMessage(ws, data) {
  const { type, payload } = data;
  const { sheetId, userId } = ws;

  switch (type) {
    case 'SYNC_SHEET':
      // Host sends full sheet data to server
      if (!sheetsData.has(sheetId)) {
        sheetsData.set(sheetId, { cells: {}, metadata: {} });
      }
      const syncData = sheetsData.get(sheetId);
      syncData.cells = payload.cells || {};
      syncData.metadata = payload.metadata || {};
      console.log(`Sheet ${sheetId} data synced from host`);
      break;

    case 'CELL_UPDATE':
      // Update cell data
      if (!sheetsData.has(sheetId)) {
        sheetsData.set(sheetId, { cells: {}, metadata: {} });
      }
      const sheetData = sheetsData.get(sheetId);
      if (!sheetData.cells) sheetData.cells = {};
      sheetData.cells[payload.cellId] = payload.value;
      
      // Broadcast to all other clients
      broadcastToSheet(sheetId, {
        type: 'CELL_UPDATE',
        data: {
          cellId: payload.cellId,
          value: payload.value,
          userId,
          userName: ws.userName,
        },
      }, ws);
      break;

    case 'CURSOR_MOVE':
      // Update cursor position
      if (userPresence.has(sheetId)) {
        const presence = userPresence.get(sheetId).get(userId);
        if (presence) {
          presence.cursorPosition = payload.position;
          presence.lastSeen = Date.now();
        }
      }
      
      // Broadcast cursor position
      broadcastToSheet(sheetId, {
        type: 'CURSOR_UPDATE',
        data: {
          userId,
          userName: ws.userName,
          position: payload.position,
        },
      }, ws);
      break;

    case 'CHAT_MESSAGE':
      // Broadcast chat message
      broadcastToSheet(sheetId, {
        type: 'CHAT_MESSAGE',
        data: {
          userId,
          userName: ws.userName,
          message: payload.message,
          timestamp: Date.now(),
        },
      });
      break;

    case 'BULK_UPDATE':
      // Handle bulk cell updates (paste, drag-fill, etc.)
      if (!sheetsData.has(sheetId)) {
        sheetsData.set(sheetId, { cells: {}, metadata: {} });
      }
      const sheet = sheetsData.get(sheetId);
      if (!sheet.cells) sheet.cells = {};
      payload.cells.forEach(cell => {
        sheet.cells[cell.cellId] = cell.value;
      });
      
      broadcastToSheet(sheetId, {
        type: 'BULK_UPDATE',
        data: {
          cells: payload.cells,
          userId,
          userName: ws.userName,
        },
      }, ws);
      break;

    case 'PRESENCE_HEARTBEAT':
      // Update last seen
      if (userPresence.has(sheetId)) {
        const presence = userPresence.get(sheetId).get(userId);
        if (presence) {
          presence.lastSeen = Date.now();
        }
      }
      break;

    default:
      console.log('Unknown message type:', type);
  }
}

function broadcastToSheet(sheetId, message, excludeWs = null) {
  if (!connections.has(sheetId)) return;

  const messageStr = JSON.stringify(message);
  
  connections.get(sheetId).forEach((client) => {
    if (client !== excludeWs && client.readyState === 1) { // OPEN
      client.send(messageStr);
    }
  });
}

module.exports = { setupWebSocketServer };
