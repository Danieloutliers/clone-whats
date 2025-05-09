import React, { useState, useEffect } from 'react';
import ChatPreview from './ChatPreview';
import ChatSettings from './ChatSettings';
import MessageManagement from './MessageManagement';
import AIConversationGenerator from './AIConversationGenerator';
import { useChatStore } from '@/hooks/use-chat-store';
import { Message } from '@/types';

const WhatsAppGenerator: React.FC = () => {
  const { 
    isDarkMode, 
    setIsDarkMode,
    messages,
    contactName,
    profilePic,
    statusTime,
    batteryLevel
  } = useChatStore();

  useEffect(() => {
    // Apply dark mode to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column - Phone preview */}
      <div className="lg:w-1/2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            <i className="fas fa-mobile-alt mr-2"></i>Prévia da Conversa
          </h2>
          
          <ChatPreview
            isDarkMode={isDarkMode}
            messages={messages}
            contactName={contactName}
            profilePic={profilePic}
            statusTime={statusTime}
            batteryLevel={batteryLevel}
          />
        </div>
      </div>
      
      {/* Right column - Generator options */}
      <div className="lg:w-1/2">
        <ChatSettings />
        <AIConversationGenerator />
        <MessageManagement />
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
