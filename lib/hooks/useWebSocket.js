import { useEffect, useRef, useCallback, useState } from 'react';

export function useWebSocket(sheetId, userId, userName) {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messageHandlers = useRef(new Map());
  const reconnectAttempts = useRef(0);
  const isConnecting = useRef(false);

  const connect = useCallback(() => {
    if (!sheetId || !userId) return;
    if (isConnecting.current) return; // Prevent multiple connection attempts
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return; // Already connected

    isConnecting.current = true;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:${window.location.port || 3000}/ws?sheetId=${sheetId}&userId=${userId}&userName=${encodeURIComponent(userName || 'Anonymous')}`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    try {
      ws.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      isConnecting.current = false;
      return;
    }

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      isConnecting.current = false;
      reconnectAttempts.current = 0; // Reset on successful connection
      
      // Start heartbeat
      const heartbeat = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'PRESENCE_HEARTBEAT' }));
        }
      }, 30000);

      ws.current.heartbeat = heartbeat;
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket received:', message); // Debug log
        
        // Handle presence updates
        if (message.type === 'PRESENCE_UPDATE') {
          setOnlineUsers(message.users || []);
        }
        
        // Call registered handlers
        const handlers = messageHandlers.current.get(message.type) || [];
        handlers.forEach(handler => {
          // For chat messages and other data, pass the data property
          // For presence updates, pass the whole message
          const payload = message.data || message;
          handler(payload);
        });
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting.current = false;
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      isConnecting.current = false;
      
      // Clear heartbeat
      if (ws.current?.heartbeat) {
        clearInterval(ws.current.heartbeat);
      }
      
      // Exponential backoff for reconnection
      reconnectAttempts.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Max 30 seconds
      
      console.log(`Will attempt to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);
      
      reconnectTimeout.current = setTimeout(() => {
        if (reconnectAttempts.current < 10) { // Max 10 attempts
          connect();
        } else {
          console.error('Max reconnection attempts reached');
        }
      }, delay);
    };
  }, [sheetId, userId, userName]);

  useEffect(() => {
    connect();

    return () => {
      // Prevent reconnection on unmount
      reconnectAttempts.current = 999;
      
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current?.heartbeat) {
        clearInterval(ws.current.heartbeat);
      }
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((type, payload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message = { type, payload };
      console.log('WebSocket sending:', message); // Debug log
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected, cannot send:', type, payload);
    }
  }, []);

  const on = useCallback((type, handler) => {
    if (!messageHandlers.current.has(type)) {
      messageHandlers.current.set(type, []);
    }
    messageHandlers.current.get(type).push(handler);

    // Return cleanup function
    return () => {
      const handlers = messageHandlers.current.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }, []);

  const off = useCallback((type, handler) => {
    const handlers = messageHandlers.current.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }, []);

  return {
    send,
    on,
    off,
    isConnected,
    onlineUsers,
  };
}
