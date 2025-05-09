import { useState, useEffect, useCallback } from 'react';
import { Message, ChatState } from '@/types';

// Initial default messages
const defaultMessages: Message[] = [
  {
    id: '1',
    text: 'Olá, tudo bem?',
    type: 'received',
    time: '14:22'
  },
  {
    id: '2',
    text: 'Tudo ótimo! E com você?',
    type: 'sent',
    time: '14:23'
  },
  {
    id: '3',
    text: 'Tudo bem também, obrigado!',
    type: 'received',
    time: '14:25'
  }
];

// Get current time in HH:MM format
const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Initialize state from localStorage or defaults
const initialState: ChatState = {
  isDarkMode: false,
  contactName: 'João Silva',
  profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  statusTime: getCurrentTime(),
  batteryLevel: 85,
  messages: defaultMessages
};

// Try to load state from localStorage
const loadStateFromStorage = (): ChatState => {
  try {
    const savedState = localStorage.getItem('whatsapp-fake-chat-state');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage', error);
  }
  return initialState;
};

export const useChatStore = () => {
  const [state, setState] = useState<ChatState>(() => loadStateFromStorage());
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('whatsapp-fake-chat-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage', error);
    }
  }, [state]);
  
  // State setters
  const setIsDarkMode = useCallback((value: boolean) => {
    setState(prevState => ({ ...prevState, isDarkMode: value }));
  }, []);
  
  const setContactName = useCallback((value: string) => {
    setState(prevState => ({ ...prevState, contactName: value }));
  }, []);
  
  const setProfilePic = useCallback((value: string) => {
    setState(prevState => ({ ...prevState, profilePic: value }));
  }, []);
  
  const setStatusTime = useCallback((value: string) => {
    setState(prevState => ({ ...prevState, statusTime: value }));
  }, []);
  
  const setBatteryLevel = useCallback((value: number) => {
    setState(prevState => ({ ...prevState, batteryLevel: value }));
  }, []);
  
  // Messages CRUD operations
  const addMessage = useCallback((message: Message) => {
    console.log("Adicionando mensagem ao estado:", message);
    setState(prevState => {
      const newState = {
        ...prevState,
        messages: [...prevState.messages, message]
      };
      console.log("Novo estado após adicionar mensagem:", newState);
      return newState;
    });
  }, []);
  
  const editMessage = useCallback((id: string, updatedMessage: Message) => {
    setState(prevState => ({
      ...prevState,
      messages: prevState.messages.map(message => 
        message.id === id ? { ...message, ...updatedMessage } : message
      )
    }));
  }, []);
  
  const deleteMessage = useCallback((id: string) => {
    setState(prevState => ({
      ...prevState,
      messages: prevState.messages.filter(message => message.id !== id)
    }));
  }, []);
  
  const moveMessage = useCallback((sourceId: string, targetId: string) => {
    setState(prevState => {
      const messages = [...prevState.messages];
      const sourceIndex = messages.findIndex(msg => msg.id === sourceId);
      const targetIndex = messages.findIndex(msg => msg.id === targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const [movedMessage] = messages.splice(sourceIndex, 1);
        messages.splice(targetIndex, 0, movedMessage);
      }
      
      return { ...prevState, messages };
    });
  }, []);
  
  // Limpar todas as mensagens
  const clearAllMessages = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      messages: []
    }));
  }, []);

  return {
    ...state,
    setIsDarkMode,
    setContactName,
    setProfilePic,
    setStatusTime,
    setBatteryLevel,
    addMessage,
    editMessage,
    deleteMessage,
    moveMessage,
    clearAllMessages
  };
};
