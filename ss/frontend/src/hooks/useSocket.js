import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useNotificationStore } from '../store/notificationStore';

let socket = null;

export const useSocket = () => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const { addMessage, setTyping } = useChatStore();
  const { add } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    socket = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('message:new', addMessage);
    socket.on('typing:start', ({ userId, userName }) => setTyping(userId, true));
    socket.on('typing:stop', ({ userId }) => setTyping(userId, false));
    socket.on('notification:new', add);

    return () => { if (socket) { socket.disconnect(); socket = null; } };
  }, [isAuthenticated, accessToken]);
};

export const getSocket = () => socket;
